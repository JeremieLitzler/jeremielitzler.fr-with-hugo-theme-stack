---
title: "Comment gérer un 404 dans une application à page unique déployée sur Netlify ?"
description: "Il est important de traiter les erreurs HTTP 404. Montrer une page conviviale est un must en termes d’UX. Sans cela, vous risquez de perdre un client. Sur les applications web constituées d’un document HTML unique déployé sur Netlify, il faut toutefois ajuster la configuration pour que les erreurs 404 soient gérées par l’application."
image: images/2024-02-14-404-page-displayed-on-laptop.jpg
imageAlt: Une page 404 affichée sur un PC portable
date: 2024-02-14
categories:
  - Dévelopment Web
tags:
  - Netlify
  - Astuce du jour
---

Les applications à page unique (SPA) gèrent ce que nous appelons des _soft 404_. Lorsque vous déployez Netlify, vous verrez une page comme celle-ci :

![Page 404 _Not Found_ de Netlify](images/netlify-404-page.png)

Pour éviter cela, il suffit d’ajouter un fichier `_redirects` dans le répertoire `public` de l’application et d’ajouter ce qui suit :

```txt
/* /index.html 200
```

Cela permet à l’application de gérer le 404 comme un _soft 404_.

Voir [ce fil de discussion] (https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125) pour plus d’exemples d’utilisation.

Crédit : l’image d’entête par [Erik Mclean](https://unsplash.com/@introspectivedsgn?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/black-asus-laptop-computer-showing-3-00-sxiSod0tyYQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
