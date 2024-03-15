---
title: "Ajouter une URL canonique à chaque article avec Hugo"
description: "En matière de référencement, la bonne pratique veut que nous incluions un lien canonique dans l’en-tête de chaque page. En utilisant le générateur de site statique Hugo, comment pouvons-nous réaliser cela ? Plongeons dans le vif du sujet."
image: images/2024-03-15-a-smartphone-and-a-pen-on-a-desk.jpg
imageAlt: "Un smartphone et un stylo sur un bureau"
date: 2024-03-15
categories:
  - Développement Web
tags:
  - SEO
  - Hugo
  - Astuce du jour
---

J’utilise le [thème Hugo](https://github.com/CaiJimmy/hugo-theme-stack) réalisé par [Jimmy Cai](https://jimmycai.com/).

Il inclut déjà dans le modèle d’en-tête le code pour ajouter un lien canonique.

Mais, à un moment donné, j’ai dû publier un article que j’avais déjà publié sur une plateforme en ligne.

Je ne pouvais donc pas laisser le thème générer un lien canonique automatiquement.

## L’objectif

Je voulais conserver l’automatisation pour les articles publiés initialement sur mon blog.

Ensuite, dans certains cas, je voulais republier un article sur mon blog alors qu’il était déjà disponible sur Internet.

## Pourquoi

En matière de référencement, les bonnes pratiques sont les suivantes :

- Chaque page web doit avoir un lien canonique.
- Une page web unique avec le même contenu doit être publiée une et une seule fois sur Internet.

Si vous ne respectez pas ces deux règles, les robots n’indexeront pas vos pages et vous perdrez du trafic.

## Solution utilisant le thème Hugo

Tout d’abord, j’ai dû trouver où le lien canonique était généré. Je l’ai trouvé dans `layouts/partials/head/head.html` :

```html
<link rel="canonical" href="{{ .Permalink }}" />
```

Maintenant, comment pouvais-je spécifier dans la [_frontmatter_](https://docusaurus.io/fr/docs/next/create-doc#:~:text=Le%20frontmatter%20est%20utilis%C3%A9e%20pour,m%C3%A9tadonn%C3%A9es%20n%C3%A9cessaires%20sans%20le%20frontmatter.) d’un article donné que je voulais que le lien canonique soit un lien spécifique ?

En cherchant un peu, j’ai trouvé [ce fil de discussion sur le forum Hugo](https://discourse.gohugo.io/t/how-to-add-cannonical-url-to-a-blog/34670/4).

Les données de la _frontmatter_ sont accessibles via `.Params` qui contient des paires clé/valeur.

La clé est le nom de la propriété _frontmatter_.

Dans mon cas, j’ai nommé la propriété canonique `relcanonical` et la valeur doit être une chaîne de caractères.

Cela donne ce qui suit :

```yaml
---
relcanonical: https://jeremielitzler.fr
---
```

La ligne `head.html` ci-dessus doit être remplacée par ce qui suit :

```htm
{{ with .Params.relcanonical }}
<link rel="canonical" href="{{ . | relLangURL }}" itemprop="url" />
{{ else -}}
<link rel="canonical" href="{{ .Permalink }}" itemprop="url" />
{{ end -}}
```

Dans le code ci-dessus,

- Lorsque le paramètre `relcanonical` est défini dans la `frontmatter` (`{{ with .Params.relcanonical }}`)
- On utilise sa valeur, qui est le `.` dans `{{ . }}`.

{{< blockcontainer jli-notice-note "La syntaxe de la moustache est utilisée pour la programmation Go dans le modèle HTML">}}}
{{< /blockcontainer >}}

J’espère que vous avez trouvé cela utile.

N’hésitez pas à partager !

Crédit : Photo de [Steve Johnson](https://unsplash.com/@steve_j?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/black-smartphone-beside-pen-rNYCrcjUnOA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
