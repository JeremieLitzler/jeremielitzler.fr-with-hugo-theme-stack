---
title: "Un bon référencement avec Vuepress 2"
description: "Une chose dont j’avais besoin sur mon blog était d’atteindre un référencement sur mes articles. Voyons comment j’ai procédé avec Vuepress 2."
image: images/2024-08-28-3d-lettres-de-scrabble-formant-le-mot-seo.jpg
imageAlt: 'Lettres de Scrabble formant le mot "SEO"'
date: 2024-08-07
categories:
  - Développement Web
tags:
  - SEO
---

Lorsqu’il s’agit d’écrire des articles, j’ai longtemps cherché une méthode simple et de facile à utiliser.

J’ai essayé WordPress. Mais on finit toujours par payer soit un plugin, soit un expert pour atteindre près de 100 sur les scores Lighthouse, **dans toutes les catégories**.

Aujourd’hui, je vais partager l’expérience acquise en utilisant Vuepress pour construire un blog performant et offrant naturellement un bon référencement.

## Contexte

### Qu’est-ce que Vuepress ?

Vuepress est le moteur SSG (Générateur de Site Statique, ou _Static Site Generator_ en anglais) basé sur Vue et Vite (pour la version 2).

Il évolue grâce à [_Mr Hope_](https://github.com/Mister-Hope) et [_meteorlxy_](https://github.com/meteorlxy) principalement (site web : https://v2.vuepress.vuejs.org/) et je l’ai utilisé pour plusieurs projets simples :

- [Un site web construit pour une productrice de quinoa en Normandie](https://inflorescences-quinoa.fr/)
- [Un projet personnel pour enseigner l’optimisation de la consommation et la production d’énergie](https://passonslecap.fr/)

Auparavant, mes blogs utilisaient Vuepress, mais je suis passé à Hugo pour des raisons de performance.

Pourquoi ? Quand on atteint un certain nombre de pages et d’articles, Vuepress, basé sur Node, montre ses limites (plus d’informations à ce sujet dans [cette discussion](https://github.com/orgs/vuepress-theme-hope/discussions/2887)).

### Que permet Vuepress ?

Il prend simplement un contenu en Markdown et l’analyse pour générer des fichiers HTML à l’aide d’un thème JavaScript, dans le cas de Vuepress, il est construit sur Vue 3.

Vuepress s’étend par le biais de plugins ou de thèmes plus ou moins riches en options. Par exemple, le thème de Mr Hope ajoute des extensions de syntaxe Markdown vraiment sympas qui enrichissent votre Markdown et in fine, le HTML généré.

N’hésitez pas à visiter [cette page](https://theme-hope.vuejs.press/) pour plus de détails.

## Comment utiliser _frontmatter_ pour le référencement

Maintenant, je vais partager un cas d’utilisation avec le thème de Mr Hope. Il est possible que d’autres thèmes supportent ou non cette fonctionnalité.

Un bon référencement commence par une bonne balise `title` ([jusqu’à 60 caractères](https://www.google.com/search?q=seo+title+length+limit)) et une méta `description` ([jusqu’à 150-160 caractères](https://www.google.com/search?q=seo+description+length+limit)).

{{< blockcontainer jli-notice-note "A propos des limites ci-dessus">}}

Ces limites ne sont pas des règles qui s’appliquent à tous les titres ou à toutes les descriptions.

J’aime beaucoup [cet article qui prend en compte la taille en pixels des titres](https://medium.com/@masaharuhayataki/busting-the-seo-myth-title-length-limit-is-not-50-60-characters-1debab9acbb3) lorsqu’il est affiché à l’écran.

{{< /blockcontainer >}}

Vous pouvez déclarer le titre et la description en utilisant le _frontmatter_ suivant :

```yaml
---
title: "Comment exécuter une API REST NodeJS sur Cloudways ?"
description: "Je suis en train de développer une API de recherche personnalisée à partir de sites web statiques VuePress et j'ai besoin de l'héberger. Comme j'ai un VPS Cloudways, voyons comment faire fonctionner l'API REST."
---
```

Ensuite, vous avez le lien canonique :

```yaml
head:
  - [
      link,
      {
        rel: canonical,
        href: https://iamjeremie.me/2023/07/how-to-run-a-nodejs-rest-api-on-cloudways,
      },
    ]
```

Ensuite, les métas OpenGraph :

```yaml
head:
  - [
      meta,
      { "og:type": article },
      meta,
      { "og:title": "Mon expérience avec le kit Bafang VAE 250 W" },
      meta,
      {
        "og:description": "Je roule en VAE depuis plus de 5 ans, d'abord sur un Scott CX Comp 2011, puis sur un Raleigh Brazil. Je vais vous dire pourquoi, comment et ce que j'en pense.",
      },
      meta,
      {
        "og:image": /images/2023-07-25-le-raleigh-brazil-300-ex-en-mode-vae.jpg,
      },
    ]
```

Ou encore les balises méta de Twitter, alias X :

```yaml
head:
  - [
      meta,
      { "og:type": article },
      meta,
      { "twitter:title": "Mon expérience avec le kit Bafang VAE 250 W" },
      meta,
      {
        "twitter:description": "Je roule en VAE depuis plus de 5 ans, d'abord sur un Scott CX Comp 2011, puis sur un Raleigh Brazil. Je vais vous dire pourquoi, comment et ce que j'en pense.",
      },
      meta,
      {
        "twitter:image": /images/2023-07-25-le-raleigh-brazil-300-ex-en-mode-vae.jpg,
      },
      meta,
      { "twitter:card": "summary_large_image" },
    ]
```

Avec les balises méta `og:*` et `twitter:*`, vous obtenez des aperçus riches sur toutes les plateformes quand vous partagez l’article. J’ai testé sur LinkedIn, X, Substack et Facebook.

## Limites

C’est assez verbeux d’écrire un _frontmatter_ qui génère les balises méta appropriées dans l’HTML. De plus, vous répétez certaines valeurs pour différentes balises méta, par exemple `description` vs `og:description` vs `twitter:description`.

J’ai donc créé un _snippet_ pour remplir le _frontmatter_ plus rapidement. Voici l’exemple de `og:*` :

```json
{
  "FM Template for OpenGraph meta": {
    "scope": "yaml",
    "prefix": "set og:metas",
    "body": [
      "meta,",
      "{ \"og:type\": article },",
      "meta,",
      "{ \"og:title\": \"\" },",
      "meta,",
      "{",
      "  \"og:description\": \"\",",
      "},",
      "meta,",
      "{",
      "  \"og:image\": /images/.jpg,",
      "},"
    ],
    "description": "Set prev and next articles"
  }
}
```

Vous pouvez l’utiliser directement dans votre _frontmatter_ pour ajouter les métatags à votre convenance.

Vous pouvez ajouter au _snippet_ le lien `canonical`, recommandé sur toutes les pages et les métatags `twitter`.

## Conclusion

Voilà, c’est fait. Pas de plugin fantaisiste ni d’installation complexe. Vous pouvez utiliser Vuepress et le thème de Mr Hope et construire aujourd’hui votre blog avec un bon référencement prêt à l’emploi !

J’ai construit un kit de démarrage [ici](https://github.com/Puzzlout/TemplateVuepress) pour les anglophones et [là](https://github.com/JeremieLitzler/mon-site-demo-tutoriel) pour les francophones.

À vous de jouer !

Crédit : Photo de [Pixabay](https://www.pexels.com/photo/three-white-and-black-scrabble-tiles-on-brown-wooden-surface-270637/)
