---
title: "Consommer une API sans Fetch ou Modern Framework"
description: "Il fut un temps où l'on utilisait XHR . Aujourd'hui, tout le monde utilise (ou devrait utiliser) l'API fetch, propre à JavaScript. Mais connaissez-vous la troisième façon d'interroger des données ?"
image: 2025-03-31-a-question-mark-drawn-with-chalk.jpg
imageAlt: Un point d'interrogation dessiné à la craie
date: 2025-04-04
categories:
  - Développement Web
tags:
  - HTML
  - JavaScript
---

Il y a moins de vingt ans, les développeurs utilisaient XHR, soit en JavaScript pur, soit avec la méthode `ajax()` de jQuery.

Puis, EMCAScript 2015 est sorti et a introduit `fetch` et sa logique basée sur les promesses. L’interrogation des données avec cette méthode a beaucoup amélioré notre expérience de développeurs.

Avec le JavaScript moderne comme Angular, puis React et Vue, pour citer les principaux frameworks utilisés aujourd’hui, nous utilisons tous `fetch` sous une couche d’abstraction.

Récupérer des données s’avère aisé tant que l’on comprend un minimum comment fonctionnent les promesses.

## La troisième façon

Bien que `fetch` soit excellent, sur un projet l’année dernière, on m’a demandé de construire une UI avec du HTML et du JavaScript pur afin de réduire les dépendances à un minimum absolu.

Pas de XHR, pas de `fetch` avec ou sans frameworks JavaScript.

Je me suis demandé : « comment cela est-ce possible ? »

Eh bien, c’est la troisième façon. C’est probablement la voie qui existait avant que le XHR n’existe. Connaissez-vous son origine et son histoire ? [Dites-moi sur X](https://x.com/LitzlerJeremie) !

## L’exemple

Prenons un exemple. Vous avez une page de connexion avec un formulaire composé de deux entrées : un email et un mot de passe.

Lors de la soumission, le formulaire envoie les informations d’identification à un point d’entrée basé sur Flask, un framework web populaire de Python.

Ce point de terminaison répond sur `POST /app/login` et renvoie la réponse JSON possible suivante :

```json
// on success
{
  "success": true,
  "error": ""
  "next_page": "/path/to/next/page"
}

// on failure
{
  "success": false,
  "error": "Credentials are invalid"
}
```

## Le code HTML

Commençons à coder l’exemple avec l’HTML.

Un formulaire est défini avec un élément `form` et plusieurs éléments `input` combinés avec son `label` (toujours) et un bouton qui vous permet de soumettre le formulaire.

```html
<!-- Voyez-vous la partie spéciale ? Oui, la clé est `target=« responseFrame »` et son iframe associé.
 -->
<form
  id="loginForm"
  method="POST"
  action="{{ url_for('frontend.execute_login', next=next) }}"
  target="responseFrame"
  class="p-4 border rounded shadow-sm"
>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" name="email" required />
  </div>
  <div class="password-block mb-3">
    <label for="password" class="form-label">Mot de passe</label>
    <input type="password" class="form-control" id="password" name="password" />
  </div>
  <div class="d-grid">
    <button id="loginButton" type="submit" class="btn btn-primary">
      Se connecter
    </button>
  </div>
  <div id="feedbackMessage" class="mt-3 alert" style="display: none;"></div>
</form>
<!-- Cette iframe cachée pour recevoir les soumissions de formulaire -->
<iframe name="responseFrame" id="responseFrame" hidden></iframe>
```

## Le JavaScript

### Commençons avec la base

Je vais vous donner le code complet dans l’article, étape par étape : tout d’abord, nous enregistrons l’événement `DOMContentLoaded` avec toutes les méthodes dont nous avons besoin pour gérer la connexion.

```javascript
// L'élément de formulaire
const loginForm = document.getElementById("loginForm");
// L'élément courriel
const emailInput = document.getElementById("email");
// Le mot de passe
const passwordContainer = document.querySelector(".password-block");
// Le bouton de soumission
const submitBtn = loginForm.querySelector('button[type="submit"]');
// L'élément magique...
const responseFrame = document.getElementById("responseFrame");

document.addEventListener("DOMContentLoaded", function () {
  // gère le scénario dans lequel la connexion SSO
  // Je n'entrerai pas dans les détails de l'article
  emailInput.addEventListener("input", useSsoLoginButton);

  // déplace l'attention sur le bouton de connexion lorsque l'on quitte la saisie du courriel
  emailInput.addEventListener("blur", function () {
    submitBtn.focus();
  });

  // affiche un message de « connexion » pendant que nous attendons la réponse de l'API
  loginForm.addEventListener("submit", showConnecting);

  // traite la réponse de l'API
  responseFrame.addEventListener("load", processLoginResponse);
});
```

### Afficher le message de connexion

Celui-ci est simple : tant que l’API n’a pas répondu, désactivons le bouton et affichons un message :

```javascript
function showConnecting(e) {
  submitBtn.disabled = true;
  showFeedback("Connexion en cours...", false);
}
```

### Traiter la réponse de l’API

Ensuite, à un moment donné, l’API enverra la réponse. Mais comment « attraper » la réponse ?

Vous vous souvenez du `target=« responseFrame »` ? Eh bien, cela indique au navigateur de transmettre la réponse de l’API à l’élément `responseFrame`.

Nous avons donc cette implémentation :

```javascript
// `this` dans la fonction correspond à l'élément `responseFrarme`.
function processLoginResponse() {
  try {
    // En transmettant la réponse de l'API, le navigateur a rempli
    // le contenu du corps du document de l'iframe avec les données
    // de la réponse.
    // Puisqu'il s'agit d'une chaîne de cacratères, commençons par
    // la transformer en objet.
    const response = JSON.parse(this.contentDocument.body.textContent);
    // Si la connexion a échoué, nous appelons `showFeedback`
    // pour afficher les détails de l'erreur.
    if (!response.success) {
      // le message de retour d'information contient la valeur
      // d'erreur de la réponse ou une solution de repli
      showFeedback(
        response.error || "Vous n'avez pas réussi à vous connecter...",
        true,
      );
      // and re-enable the login button to allow a new attempt.
      submitBtn.disabled = false;
      return;
    }
    // Sinon, changeons le message pour fournir le feedback de
    // à l'utilisateur que nous sommes sur le point de le rediriger
    showFeedback("Redirection en cours...", false);
    // ... et redirigeons l'utilisateur vers la page suivante
    // à la fin du délai d'attente.
    // Le délai d'attente ne sert qu'à afficher le message de
    // redirection
    let timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      window.location.href = response.next_page;
    }, 250);
  } catch (error) {
    // Assurez-vous d'attraper toutes les erreurs
    console.error("Error parsing response:", error);
    showFeedback(
      "Une erreur s'est produite. Ouvrez DevTools, réessayez et signalez l'erreur à l'administrateur.",
      true,
    );
    submitBtn.disabled = false;
  }
}
```

Voilà, c’est fait !

Au passage, vous n’avez pas besoin d’un `event.preventDefault()`. Avec cette stratégie, l’action de soumission ne recharge pas la page. Vous gérez tout ce qui concerne la connexion dans `processLoginResponse`.

## Conclusion

Avez-vous appris quelque chose aujourd’hui ? J’ai certainement appris quelque chose lorsque j’ai codé ceci.

D’ailleurs, j’ai appris cela en utilisant Claude.ai, qui m’a guidé et m’a aidé à découvrir cette technique (oubliée) que nous devrions tous connaître.

Pour être honnête, l’IA a eu du mal à donner cette solution au début, essayant les deux autres solutions…

Photo par [Pixabay](https://www.pexels.com/photo/question-mark-on-chalk-board-356079/).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo by [Pixabay](https://www.pexels.com/photo/question-mark-on-chalk-board-356079/).

<!-- more -->
