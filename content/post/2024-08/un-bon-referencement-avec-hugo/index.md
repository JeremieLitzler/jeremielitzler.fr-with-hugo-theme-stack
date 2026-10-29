---
title: "Un bon référencement avec Hugo"
description: "Une chose dont j’avais besoin sur mes blogs était de rendre mes articles efficaces pour le référencement. Voyons comment je l’ai fait avec Hugo et le thème de Jimmy Cai."
image: images/2024-08-07-scrabble-letters-forming-the-word-seo.jpg
imageAlt: 'Lettres de scrabble formant le mot "SEO"'
date: 2024-08-28
categories:
  - Développement Web
tags:
  - SEO
  - Go
  - Hugo
  - Générateur de sites statiques
  - JAMStack
---

J’ai écrit [un article la semaine dernière](../un-bon-referencement-avec-vuepress-2/index.md) sur le thème du référencement avec Vuepress 2 lorsque l’on utilise l’excellent thème de Mr Hope.

Du côté de Hugo, Jimmy Cai a également créé un excellent thème.

Quand il s’agit d’écrire des articles, j’ai toujours eu besoin de quelque chose de simple et facile à utiliser.

J’ai essayé Hugo pour des raisons de performance.

Aujourd’hui, je vais partager l’expérience que j’ai acquise en utilisant Hugo pour construire un blog qui fonctionne bien et fournit naturellement un bon référencement.

## Contexte

### Qu’est-ce que Hugo ?

Hugo est le moteur SSG (Static Site Generator) basé sur le langage Go.

[bep](https://github.com/bep) et [jmooring](https://github.com/jmooring) maintiennent Hugo avec l’aide d’autres contributeurs (site web : https://gohugo.io/) et je l’utilise pour mes blogs :

- [Mon blog français](https://jeremielitzler.fr/), où vous vous trouvez actuellement.
- [Mon blog en anglais](https://iamjeremie.me/)

Jusqu’à il y a un an, mes blogs utilisaient Vuepress, mais je suis passé à Hugo parce que j’avais atteint un point où il consommait trop mes minutes de _build_ sur Netlify… J’explique pourquoi dans l’article VuePress cité ci-dessus.

### Que peut faire Hugo

De la même manière que Vuepress, il prend simplement le contenu Markdown et le transforme en un fichier HTML.

Vous utilisez un thème à appliquer sur le Markdown pour générer les pages HTML.

Il est possible de l’étendre grâce à des _shortcodes_ écrits en HTML et Go. Vous pouvez également utiliser des thèmes à part entière, comme celui de Jimmy Cai, qui est parfait pour les blogs. N’hésitez pas à [visiter cette page pour plus de détails](https://github.com/CaiJimmy/hugo-theme-stack) et [son projet de démarrage](https://github.com/CaiJimmy/hugo-theme-stack-starter).

## Comment utiliser le _frontmatter_ pour le référencement

En ce qui concerne le référencement, tout commence de la même manière qu’avec Vuepress : une balise `title` et une méta `description`.

Vous pouvez y parvenir en utilisant le même _frontmatter_ qu’avec Vuepress :

```yaml
---
title: "Un bon référencement avec Hugo"
description: "Une chose dont j'avais besoin sur mes blogs était de rendre mes articles efficaces pour le référencement. Voyons comment je l'ai fait avec Hugo et le thème de Jimmy Cai."
---
```

Pour la suite, la méthode diverge.

### Un HTML sémantique

A certains endroits, j’ai dû ajuster les éléments d’en-tête du thème pour respecter les règles du bon HTML sémantique, important pour le référencement naturel ainsi que le respect des bonnes pratiques.

Par exemple, dans le `layouts\_default\archives.html`, j’avais un `h2` au lieu d’un `h1` pour le titre de la page.

Même chose dans la page `layouts\page\search.html` et dans de nombreuses vues partielles comme `layouts\partials\article\components\details.html`, qui affiche les détails de tous les articles.

Pourquoi cela ?

Dans le menu de gauche, le nom du site était le `h1`, ce qui est très bien sur la page d’accueil. Cependant, à mon avis, cela ne s’appliquait pas aux autres pages, en particulier les articles, les autres pages personnalisées ou la page générée pour les catégories et les tags. J’ai beaucoup travaillé sur le menu de gauche pour qu’il affiche les `h1` et `h2` pour le nom et la description du site uniquement sur la page d’accueil.

Cette partie s’est avérée délicate à modifier, car les vues partielles utilisées étaient les mêmes entre la page d’accueil et les pages de catégories, de tags, de recherche et d’archives.

Cependant, je pense que j’ai sauté sur l’occasion pour me lancer et faire des expérimentations, dans le bon sens du terme, avec Hugo et la programmation Go.

### Pour le lien canonique

J’ai mis à jour le thème lui-même dans une copie locale. Je n’utilise pas le thème de Jimmy comme modèle _dynamique_ car, une fois, il a cassé mon _build_ Netlify lors d’une mise à jour automatique. C’est ainsi que cela fonctionne si vous utilisez son dépôt de démarrage.

Donc dans le `head.html`, j’ai ajouté ceci :

```html
<!-- https://discourse.gohugo.io/t/how-to-add-cannonical-url-to-a-blog/34670/4 -->
{{ with .Params.relcanonical }}
<link rel="canonical" href="{{ . | absLangURL }}" itemprop="url" />
{{ else -}}
<link rel="canonical" href="{{ .Permalink }}" itemprop="url" />
{{ end -}}
```

Qu’est-ce que cela signifie ? Si le _frontmatter_ contient la propriété `relcanonical`, alors on l’utilise. Sinon, le lien de la page ou de l’article généré par Hugo est utilisé.

J’utilise rarement `relcanonical`, mais c’est pratique de l’avoir à disposition.

{{< blockcontainer jli-notice-note "Mise à jour suite au passage à hugo-theme-stack v4">}}

Le champ personnalisé `relcanonical` décrit ci-dessus a été utilisé jusqu'au passage du site à hugo-theme-stack v4. Cette version gère nativement une URL canonique personnalisée : le champ a donc été renommé `canonicalUrl` dans tous les articles du site pour l'utiliser directement.

{{< /blockcontainer >}}

Par exemple, j’avais un post LinkedIn que j’avais publié avant l’article :

```yaml
---
canonicalUrl: https://www.linkedin.com/pulse/making-unused-method-argument-compliant-typescript-eslint-litzler-uiktf/
---
```

Cela indique aux robots d’indexation que le contenu original du lien canonique est le lien sur LinkedIn.

### Pour l’image de tête dans les articles

Par défaut, je ne pouvais pas définir un texte alternatif personnalisé pour l’image d’en-tête de l’article. Pour moi, c’était indispensable.

Pour utiliser ce qui suit, je dois modifier `layouts\partials\article\components\header.html`, qui représente la section supérieure de tous les articles.

```yaml
image: images/2024-08-07-scrabble-letters-forming-the-word-seo.jpg
imageAlt: 'Lettres de scrabble formant le mot "SEO"'
```

Dans le modèle de vue partielle, j’ai modifié ce code :

```go
<img
  src="{{ $Permalink }}"
  {{ with $Srcset }}
  srcset="{{ . }}"
  {{ end }}
  width="{{ $Width }}"
  height="{{ $Height }}"
  loading="lazy"
  alt="Featured image of post {{ .Title }}"
/>
```

En celui-ci :

```go
<img src="{{ $Permalink }}"
  {{ with $Srcset }}
  srcset="{{ . }}"
  {{ end }}
  width="{{ $Width }}"
  height="{{ $Height }}"
  alt="{{ .Params.imageAlt }}"
  title="{{ .Params.imageAlt }}"
/>
```

Vous remarquerez peut-être une autre différence avec l’absence de l’attribut `loading="lazy"`. En effet, vous n’en avez pas besoin pour les images dans le _viewport_ au chargement de la page.

J’ai dû modifier la vue de la liste d’articles par exemple pour que les trois premiers articles n’utilisent pas l’attribut `loading="lazy"`, mais que ce soit le cas pour les suivants.

Pour cela, j’ai besoin de transmettre l’index de l’article à l’en-tête de la liste d’articles.

Mais comment ai-je obtenu le `pageIndex` ?

Dans le fichier `index.html`, j’ai modifié la boucle _for_ et j’ai défini la variable que j’ai initialisée par la méthode `.Scratch.Set` :

```html
<section class="article-list">
  {{ range $index, $element := $pag.Pages }} {{ .Scratch.Set "pageIndex" $index
  }} {{ partial "article-list/default" . }} {{ end }}
</section>
```

Ensuite, j’ai lu l’index dans la vue d’en-tête de la liste d’articles en utilisant `.Scratch.Get` et j’ai calculé la variable `outOfVisibleViewPort` :

```go
 {{- $pageIndex := .Scratch.Get "pageIndex" }}
 {{- $outOfVisibleViewPort := ge (int $pageIndex) 3 }}
```

Enfin, dans l’élément `<img>`, j’ai indiqué que le `loading="lazy"` doit être inclus si le `$outOfVisibleViewPort` est égal à `true` :

```go
<img
  src="{{ $Permalink }}"
  {{ with $Srcset }}
  srcset="{{ . }}"
  {{ end }}
  width="{{ $Width }}"
  height="{{ $Height }}"
  {{ with $outOfVisibleViewPort }}
  loading="lazy"
  {{ end }}
  alt="{{ .Params.imageAlt }}"
/>
```

### Pour les métabalises d’OpenGraph et de Twitter

Le thème s’en charge par défaut, par le biais de la vue `layouts\partials\head\opengraph\provider\base.html`. Il lit le `titre` et la `description` de la page ou de l’article. Ainsi, contrairement à Vuepress, vous n’avez pas besoin de les spécifier. Cela allège beaucoup le _frontmatter_, n’est-ce pas ? 😁

De même, `hugo-theme-stack-master\layouts\partials\head\opengraph\provider\twitter.html` traite l’ajout des métabalises Twitter.

## Conclusion

Voilà, c’est fait. Pas d’extension fantaisiste, pas de dépendance (sauf pour Go et Hugo), pas d’installation complexe. Vous pouvez utiliser Hugo et le thème de Jimmy pour construire aujourd’hui votre blog avec un référencement naturel sans effort ! Vous n’avez qu’à travailler le contenu, peut-être le plus important pour le référencement.

Je n’ai pas encore construit de kit de démarrage. [Faites-moi savoir si vous avez besoin d’aide](../../../page/contactez-moi/index.md).

Commencez à bloguer dès aujourd’hui et oubliez WordPress !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo par [Pixabay](https://www.pexels.com/photo/three-white-and-black-scrabble-tiles-on-brown-wooden-surface-270637/)
