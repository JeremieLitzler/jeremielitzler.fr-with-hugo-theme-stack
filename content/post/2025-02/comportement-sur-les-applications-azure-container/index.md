---
title: "Comportement courant des applications de conteneurs Azure"
description: "Lorsque vous déployez une application en conteneur sur Azure ou tout autre fournisseur de services en nuage, vous devez le savoir."
image: 2025-02-17-tunnel-written-on-a-metal-structure.jpg
imageAlt: « Tunnel » inscrit sur une structure métallique
date: 2025-02-21
categories:
  - Développement Web
tags:
  - Python
  - Sécurité
---

J'ai travaillé sur une API REST en Python qui intégrait Twilio pour gérer des appels entrants.

J'avais configuré le webhook avec un protocole HTTPS.

Pour sécuriser le webhook, j'ai besoin comparer la signature de Twilio avec les en-têtes pour valider que l'appel provenait bien d'eux.

Vous pouvez commencer par consulter la [documentation de Twilio](https://www.twilio.com/docs/messaging/tutorials/how-to-receive-and-reply/python) pour comprendre ce fonctionnement.

Vous pouvez même demander à [Twilio Docs AI](https://help.twilio.com/).

Tout était implémenté et j'étais prêt à tester. Mais ensuite...

## Le problème

Lorsque j'ai réalisé l'appel sur le numéro de téléphone fourni par Twilio, la dame de Twilio m'a dit : « Désolé, une erreur applicative s'est produite ».

Je m'étais assuré d'enregistrer toutes les parties qui composent la signature avant de déployer la version :

- le jeton `Auth`, fourni par Twilio,
- l'URL de la requête,
- la charge utile de la requête,
- la signature réelle envoyée par Twilio.

Qu'ai-je appris ?

L'URL posait problème : il manquait le « s » à « http »...

Par conséquent, lorsque je calculais la signature à partir de l'API de Twilio, elle s'avérait différente de la valeur fournie par Twilio, ce qui entraînait l'erreur.

## D'où vient l'URL en `http` ?

Ce comportement provient de la façon dont un _Azure Container Apps_ gère le trafic `https`. Voici ce que j'ai compris :

1. La requête externe à l'application arrive en `https`. Les journaux d'appels de Twilio me le confirment.
2. L'_Azure Container App_ met fin à la connexion SSL/TLS au niveau de la répartition de charge ou de son _reverse proxy_.
3. La demande est ensuite transmise à l'application Flask en utilisant `http` à l'intérieur du container.

Par conséquent, Flask ne voit que la requête en `http` et non la requête `https` originale. Il s'agit d'une configuration courante avec des containers Docker pour des raisons de performance et de sécurité.

## Comment résoudre ce problème

Pour obtenir l'URL `https` d'origine, vous pouvez essayer ce qui suit :

### Méthode 1

Vérifiez si Flask se trouve derrière un proxy en analysant l'en-tête `X-Forwarded-Proto` :

```python
from flask import request

if request.headers.get('X-Forwarded-Proto') == 'https':
    # The original request was HTTPS
    original_url = 'https://' + request.host + request.path
else:
    # Use the regular request.url
    original_url = request.url

```

### Méthode 2

Si cela ne fonctionne pas, il se peut que vous deviez configurer Flask pour qu'il fasse confiance aux en-têtes du proxy :

```python
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1)

```

Cela indique à Flask de faire confiance à l'en-tête `X-Forwarded-Proto`.

Si vous avez toujours des problèmes, vous devrez peut-être vérifier votre configuration _Azure Container Apps_ pour vous assurer qu'elle définit correctement l'en-tête `X-Forwarded-Proto`.

Dans mon cas, la première méthode suffit. J'ai toutefois réécrit la solution en utilisant la méthode `replace` pour réécrire l'URL.

```python
        no_header = 'header not sent'
        request_protocol = request.headers.get("X-Forwarded-Proto", no_header)
        if request_protocol == 'https':
            return request.url.replace('http://', 'https://', 1)
        else:
            return request.url
```

## Conclusion

L'exécution d'une application à l'intérieur d'un conteneur signifie souvent que vous avez un _reverse proxy_, si l'application est accessible depuis Internet. Et entre le _reverse proxy_ et l'application, la communication ne nécessite pas `https`.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Jonny Gios](https://unsplash.com/@supergios?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/a-close-up-of-a-train-on-a-train-track-avLaWXizuWM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
