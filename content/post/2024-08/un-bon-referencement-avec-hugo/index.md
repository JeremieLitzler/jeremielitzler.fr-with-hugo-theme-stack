---
title: "Un bon référencement avec Hugo"
description: "Une chose dont j'avais besoin sur mes blogs était de rendre mes articles efficaces pour le référencement. Voyons comment je l'ai fait avec Hugo et le thème de Jimmy Cai."
image: images/2024-08-07-scrabble-letters-forming-the-word-seo.jpg
imageAlt: 'Lettres de scrabble formant le mot "SEO"'
date: 2024-08-28
categories:
  - Développement
tags:
  - SEO
  - Go
  - Hugo
  - Générateur de sites statiques
  - JAMStack
---

J'ai écrit [un article la semaine dernière](../un-bon-referencement-avec-vuepress-2/index.md) sur le thème du référencement avec Vuepress 2 lorsque l'on utilise l'excellent thème de Mr Hope.

Du côté de Hugo, Jimmy Cai a également créé un excellent thème.

Quand il s'agit d'écrire des articles, j'ai toujours eu besoin de quelque chose de simple et facile à utiliser.

J'ai essayé Hugo pour des raisons de performance.

Aujourd'hui, je vais partager l'expérience que j'ai acquise en utilisant Hugo pour construire un blog qui fonctionne bien et fournit naturellement un bon référencement.

## Contexte

### Qu'est-ce que Hugo ?

Hugo est le moteur SSG (Static Site Generator) basé sur le language Go.

[bep](https://github.com/bep) et [jmooring](https://github.com/jmooring) maintiennent Hugo avec l'aide d'autres contributeurs (site web : https://gohugo.io/) et je l'utilise pour mes blogs :

- [Mon blog français](https://jeremielitzler.fr/), où vous vous trouvez actuellement.
- [Mon blog en anglais](https://iamjeremie.me/)

Jusqu'à il y a un an, mes blogs utilisaient Vuepress, mais je suis passé à Hugo parce que j'avais atteint un point où il consommait trop mes minutes de _build_ sur Netlify... J'explique pourquoi dans l'article VuePress cité ci-dessus.

### Que peut faire Hugo

De la même manière que Vuepress, il prend simplement le contenu Markdown et le transforme en un fichier HTML.

Vous utilisez un thème à appliquer sur le Markdown pour générer les pages HTML.

Il est possible de l'étendre grâce à des shortcodes écrits en HTML et Go. Vous pouvez également utiliser des thèmes à part entière, comme celui de Jimmy Cai, qui est parfait pour les blogs. N'hésitez pas à [visiter cette page pour plus de détails](https://github.com/CaiJimmy/hugo-theme-stack) et [son projet de démarrage](https://github.com/CaiJimmy/hugo-theme-stack-starter).

## Comment utiliser le _frontmatter_ pour le référencement

En ce qui concerne le référencement, tout commence de la même manière qu'avec Vuepress : une balise `title` et une méta `description`.

Vous pouvez y parvenir en utilisant le même _frontmatter_ qu'avec Vuepress :

```yaml
---
title: "Un bon référencement avec Hugo"
description: "Une chose dont j'avais besoin sur mes blogs était de rendre mes articles efficaces pour le référencement. Voyons comment je l'ai fait avec Hugo et le thème de Jimmy Cai."
---
```

Pour la suite, la méthode diverge.

### Un HTML sémantique

A certains endroits, j'ai dû ajuster les éléments d'en-tête du thème pour respecter les règles du bon HTML sémantique, important pour le référencement naturel ainsi que le respect des bonnes pratiques.

Par exemple, dans le `layouts\_default\archives.html`, j'avais un `h2` au lieu d'un `h1` pour le titre de la page.

Même chose dans la page `layouts\page\search.html` et dans de nombreuses vues partielles comme `layouts\partials\article\components\details.html`, qui affiche les détails de tous les articles.

Pourquoi cela ?

Dans le menu de gauche, le nom du site était le `h1`, ce qui est très bien sur la page d'accueil. Cependant, à mon avis, cela ne s'appliquait pas aux autres pages, en particulier les articles, les autres pages personnalisées ou la page générée pour les catégories et les tags. J'ai beaucoup travaillé sur le menu de gauche pour qu'il affiche les `h1` et `h2` pour le nom et la description du site uniquement sur la page d'accueil.

Cette partie s'est avérée délicate à modifier car les vues partielles utilisées étaient les mêmes entre la page d'accueil et les pages de catégories, de tags, de recherche et d'archives.

Cependant, je pense que j'ai sauté sur l'occasion pour me lancer et faire des expérimentations, dans le bon sens du terme, avec Hugo et la programmation Go.

### Pour le lien canonique

J'ai mis à jour le thème lui-même dans une copie locale. Je n'utilise pas le thème de Jimmy comme modèle _dynamique_ car, une fois, il a cassé mon _build_ Netlify lors d'une mise à jour automatique. C'est ainsi que cela fonctionne si vous utilisez son dépôt de démarrage.

Donc dans le `head.html`, j'ai ajouté ceci :

```html
<!-- https://discourse.gohugo.io/t/how-to-add-cannonical-url-to-a-blog/34670/4 -->
{{ with .Params.relcanonical }}
<link rel="canonical" href="{{ . | relLangURL }}" itemprop="url" />
{{ else -}}
<link rel="canonical" href="{{ .Permalink }}" itemprop="url" />
{{ end -}}
```

Qu'est-ce que cela signifie ? Si le _frontmatter_ contient la propriété `relcanonical`, alors on l'utilise. Sinon, le lien de la page ou de l'article généré par Hugo est utilisé.

J'utilise rarement `relcanonical`, mais c'est pratique de l'avoir à disposition.

Par exemple, j'avais un post LinkedIn que j'avais publié avant l'article :

```yaml
---
relcanonical: https://www.linkedin.com/pulse/making-unused-method-argument-compliant-typescript-eslint-litzler-uiktf/
---
```

Cela indique aux robots d'indexation que le contenu original du lien canonique est le lien sur LinkedIn.

### For head image in articles

By default, I couldn’t set a custom image alt text to the head image in the article. To me, it was a must-have.

To use the following, I have to modify `layouts\partials\article\components\header.html`, which represents the top section of all articles.

```yaml
title: "Good SEO with Hugo"
description: "One thing that I needed on my blogs was to make my articles SEO-effecient. Let’s look at how I did it with Hugo and Jimmy Cai’s theme."
image: images/2024-08-07-scrabble-letters-forming-the-word-seo.jpg
imageAlt: 'Scrabble letters forming the word "SEO"'
```

In the partial view template, I modified the code from:

```go
<img src="{{ $Permalink }}"
                        {{ with $Srcset }}srcset="{{ . }}"{{ end }}
                        width="{{ $Width }}"
                        height="{{ $Height }}"
                        loading="lazy"
                        alt="Featured image of post {{ .Title }}" />
```

to

```go
<img src="{{ $Permalink }}"
                        {{ with $Srcset }}srcset="{{ . }}"{{ end }}
                        width="{{ $Width }}"
                        height="{{ $Height }}"
                        alt="{{ .Params.imageAlt }}"
						            title="{{ .Params.imageAlt }}" />
```

You might notice another difference with the `loading="lazy"` attribute missing. Well, that’s because you don’t need it on the images in the _viewport_ on page loads.

I had to modify the article list view for example so that the first three article tiles didn’t use the `loading="lazy"` attribute, but the following did.

For that, I need to pass on to the article list tile header the index of the article in the list.

But how did I get the `pageIndex`?

In the `index.html`, I modified the _for loop_ and set the variable which I passed through the `.Scratch.Set` method:

```go
    <section class="article-list">
        {{ range $index, $element := $pag.Pages }}
			      {{ .Scratch.Set "pageIndex" $index }}
            {{ partial "article-list/default" . }}
        {{ end }}
    </section>
```

Then, I read the index in the article list tile header view using `.Scratch.Get` and calculated the `outOfVisibleViewPort` variable:

```go
 {{- $pageIndex := .Scratch.Get "pageIndex" }}
 {{- $outOfVisibleViewPort := ge (int $pageIndex) 3 }}
```

Finally, in the `<img>` element, I told Hugo to render the `loading="lazy"` is the`$outOfVisibleViewPort` equaled to `true`:

```go
     <img src="{{ $Permalink }}"
        {{ with $Srcset }}srcset="{{ . }}"{{ end }}
        width="{{ $Width }}"
        height="{{ $Height }}"
				{{ with $outOfVisibleViewPort }}
          loading="lazy"
				{{ end }}
        alt="{{ .Params.imageAlt }}" />
```

### For OpenGraph and Twitter meta tags

The theme takes care of it out of the box, through the `layouts\partials\head\opengraph\provider\base.html` view. It reads the frontmatter `title` and `description` of the page or article. So, unlike Vuepress, you don’t need to specify them. It lightens the frontmatter a lot, doesn’t it? 😁

Similarly, `hugo-theme-stack-master\layouts\partials\head\opengraph\provider\twitter.html` processes the addition of the Twitter meta tags.

## Conclusion

There, you have it. No fancy plugin, no dependency (except for Go and Hugo), no complex setup. You can use Hugo and Jimmy’s theme and build today your blog with good SEO out-of-the-box!

I have yet to build a boilerplate. [Let me know if you need help](../../../page/contact-me/index.md).

Start blogging today and forget WordPress!

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Credit: Photo by [Pixabay](https://www.pexels.com/photo/three-white-and-black-scrabble-tiles-on-brown-wooden-surface-270637/)
