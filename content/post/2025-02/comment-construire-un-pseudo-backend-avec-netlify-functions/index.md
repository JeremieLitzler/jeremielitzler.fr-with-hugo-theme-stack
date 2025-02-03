---
title: "Comment construire un pseudo-backend avec Netlify Functions"
description: "Et c'est formidable pour des MVP simples"
image: 2025-02-03-a-json-sticker-held-by-someone.jpg
imageAlt: Un autocollant JSON dans la main d’une personne
date: 2025-02-07
categories:
  - Développement Web
tags:
  - Netlify
---

## Mon besoin

L’année dernière, j’ai travaillé sur une application intégrant l’API Twilio pour une application pour gérer une équipe de garde.

Nous avions un scénario dans lequel la personne de garde principale ne pouvait pas répondre à l’appel du client.

Par conséquent, après un certain temps, une tâche planifiée déclenchait un appel à la personne de réserve via l’API d’appel de Twilio.

Pour ce faire, nous devons effectuer l’appel de la manière suivante :

```python
message = self.twilio_client.calls.create(
    from_=self.config.TWILIO_PHONE_NUMBER,
    to=on_call_individual.phone_number,
    url=quote(call_instructions, safe=':/')
```

Cependant, l’API vérifie si le paramètre `url` est valide.

Devinez quoi ? Localement, le paramètre `url` était valide, mais pas accessible du point de vue de Twilio.

## Solution

J’ai développé une application rapide en utilisant les Netlify Functions.

L’objectif était que l’URL ci-dessus soit `http://domain.com/twiml/instructions/call/%7Bdynamic_value%7D` et réponde :

```xml
<Response>
  <script/>
  <Say>
    <speak-as interpret-as="telephone"> Un appel de +41123456789 a a eu lieu. Un SMS vous a été envoyé pour confirmer que vous rappelerez la personne. Le message contient le numéro de la personne ayant appelée. Merci de votre compréhension. </speak-as>
  </Say>
</Response>
```

### Étape 1 : Structurer votre projet pour Netlify

```plaintext
twiml-response-app/
│
├── functions/
│   └── twiml.js
│
├── public/
│   └── index.html
│
├── netlify.toml
└── package.json
```

### Étape 2 : Initialiser et implémenter le projet

Avec `npm init -y`, vous pouvez initialiser le projet.

Ensuite, installez la dépendance :

```bash
@netlify/functions
```

Ensuite, créez le fichier `index.html` pour fournir des instructions lors du chargement de l’URL de base.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TwiML Response App</title>
  </head>
  <body>
    <h1>TwiML Response App</h1>
    <p>
      Utilisez le point de terminaison /twiml/instructions/call/{dynamic_value}
      pour obtenir des réponses TwiML pour obtenir des réponses TwiML.
    </p>
    <form>
      <label for="phoneNumber">
        Saisir le numéro :
        <input type="tel" name="phoneNumber" id="phoneNumber" />
      </label>
    </form>
    <section class="link"></section>
    <script>
      const phoneNumberEl = document.querySelector("[name='phoneNumber']");
      const link = document.querySelector(".link");
      phoneNumberEl.addEventListener("keyup", () => {
        event.preventDefault();
        const anchor = document.createElement("a");
        const phoneNumberEncoded = encodeURIComponent(phoneNumberEl.value);
        const href = `${document.location.protocol}//${document.location.host}/twiml/instructions/call/${phoneNumberEncoded}`;
        anchor.innerText = href;
        anchor.href = href;
        anchor.target = "_blank";
        link.innerHTML = "";
        link.appendChild(anchor);
      });
    </script>
  </body>
</html>
```

Ensuite, nous créons la fonction `twiml.js` dans le répertoire `functions`.

```js
exports.handler = async function (event, context) {
  const path = event.path.split("/");
  const encodedValue = path[path.length - 1];
  const dynamicValue = decodeURIComponent(encodedValue);
  console.log(`Received request at ${event.path}`);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
    <Say>
        Un appel de <say-as interpret-as="telephone">${dynamicValue}</say-as>  a a eu lieu. Un SMS vous a été envoyé pour confirmer que vous rappelerez la personne. Le message contient le numéro de la personne ayant appelée. Merci de votre compréhension.
    </Say>
</Response>`;

  console.log(`Replying with ${xmlResponse}`);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/xml",
    },
    body: xmlResponse,
  };
};
```

**Soyez prudent avec le XML** : dans la chaîne de caractères du modèle, évitez de mettre une nouvelle ligne. Sinon, vous obtiendrez « `error on line 2 at column 10 : XML declaration allowed only at the start of the document` ».

Enfin, configurons le fichier `netlify.toml` avec le contenu suivant :

```toml
[build]
  functions = "functions"
  publish = "public"

[[redirects]]
  from = "/twiml/*"
  to = "/.netlify/functions/twiml/:splat"
  status = 200
```

Tout d’abord, nous indiquons à Netlify où se trouvent les fonctions à exécuter. Notez que, par défaut, Netlify cherche dans le répertoire `netlify/functions` si nous ne fournissons pas `functions = "functions"`.

Ensuite, `publish = "public"` indique à Netlify où se trouve le répertoire racine pour servir l’application.

Enfin, nous définissons une redirection pour dire à Netlify, sur toute requête vers `/twiml/*`, d’appeler la fonction avec le `:splat` qui capture et transmet tout segment de chemin supplémentaire après `/twiml/` à la fonction.

### Étape 3 : Déployer l’application

Cette étape est très simple.

Créez-vous un compte chez Netlify ou d’utiliser votre compte Git préféré et déployez l’application à partir de votre dépôt Git.

Les paramètres par défaut fonctionnent très bien.

### Étape 4 : Tester l’application

Naviguez jusqu’à l’URL fournie par Netlify et saisissez une valeur dans l’entrée.

Cliquez sur le lien qui apparaît ci-dessous pour prévisualiser le XML généré.

## Conclusion

Voilà, c’est fait ! Vous pouvez maintenant utiliser cette application hébergée sur votre environnement local et tester l’API Twilio dans le cas décrit en début d’article.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [RealToughCandy.com](https://www.pexels.com/photo/a-person-holding-a-paper-11035481/)
