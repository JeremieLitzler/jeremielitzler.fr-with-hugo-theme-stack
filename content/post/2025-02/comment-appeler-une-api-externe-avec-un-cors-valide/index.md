---
title: "Comment appeler une API externe avec un CORS valide ?"
description: "Avez-vous déjà eu besoin d’appeler une API tierce qui réside sur un domaine différent ? Vous avez probablement rencontré des problèmes de CORS."
image: 2024-08-02-matrix-like-background.jpg
imageAlt: Arrière-plan de type « Matrix »
date: 2025-02-12
categories:
  - Développement Web
tags:
  - Sécurité
---

## Le problème

J'ai testé le LLM d'Infomaniak l'année dernière sur une application et j'ai à nouveau été confronté au problème CORS (Cross-Origin Resource Sharing).

C'est un problème récurrent lorsque vous hébergez votre application sur par exemple `https://my-app.com` et qu'elle consomme une API sur `https://api.example.com`.

Le navigateur vous empêchera de le faire à moins que le backend n'autorise explicitement le frontend avec l'en-tête `Access-Control-Allow-Origin`, en espérant que vous avez pas configurer `*`...

MDN décrit en détail [le concept sur leur site web](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS).

## La solution

Si vous utilisez Netlify, vous pouvez utiliser deux méthodes :

### Le fichier `netlify.toml`

Comme l'indique un fil de discussion sur le forum de Netlify (PS : j'ai écrit l'article en anglais en août 2024 et je n'avais pas pris note du lien, désolé), vous devez définir une règle de réécriture :

```toml
# This is the rule to query the API without CORS
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200
  force = true

# This is the rule you set to handle soft 404 in your SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

{{< blockcontainer jli-notice-tip "">}}

Le `:splat` représente tout ce qui suit `https://api.example.com/`.

{{< /blockcontainer >}}

### Un fichier `_redirects`

Cette option est la même que la précédente, mais vous l'écrivez différemment :

```txt
/api-llm https://api.example.com/:splat 200
/\* /index.html 200
```

Veillez également à nommer le fichier `_redirects` et à le placer dans le répertoire `public` pour Netlify le prenne en compte.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de [Markus Spiske](https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/matrix-movie-still-iar-afB0QQw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
