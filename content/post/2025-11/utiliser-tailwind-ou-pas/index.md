---
title: "Tailwind CSS ou pas ?"
description: "Les avis divergent quant à l'utilisation ou non de Tailwind."
image: 2025-09-19-example-of-tailwind-css.png
imageAlt: Exemple de Tailwind CSS
date: 2025-11-19
categories:
  - Développement web
tags:
  - Tailwind CSS
---

Que vous aimiez son approche axée sur les classes utilitaires ou que vous détestiez ses listes de classes encombrées dans l'HTML, Tailwind CSS suscite des opinions très tranchées parmi les développeurs.

Examinons de plus près ce qui le rend à la fois puissant et controversé.

## Tailwind CSS en vaut-il la peine ?

Franchement, la première chose qui m'a frappé, c'est le code HTML vraiment brouillé, comme beaucoup d'entre vous, j'en suis sûr. Il y a tellement de classes CSS !

Cependant, [voici les problèmes](https://www.youtube.com/watch?v=lHZwlzOUOZ4) qu'il tente de résoudre en utilisant du CSS standard, selon [Fireship](https://www.youtube.com/@Fireship) :

- Colocation :
  - Avec le CSS classique, nous avons décidé d'appliquer une séparation des responsabilité entre le balisage (HTML) et les styles (CSS). Cela nécessite de nommer les classes, ce que nous, les humains, ne savons pas bien faire. De plus, le nom de la classe ne vous renseigne pas sur les styles qui se cachent derrière.
  - Avec Tailwind, nous utilisons des classes utilitaires qui explicitent les styles dans le balisage. C'est ce qui crée le HTML brut qui affiche un attribut de classe avec des tonnes de classes, on est d'accord...
- Verbosité
  - Avec le CSS classique, la verbosité est une réalité. Par exemple, pour positionner un élément, vous devez définir les propriétés `position`, `top`, `right`, `bottom` et `left`.
  - Avec Tailwind, il suffit d'utiliser `inset-0`, vous n'avez pas besoin d'écrire toutes ces propriétés.
- Trop de puissance
  - Avec le CSS vanilla, vous avez trop de contrôle sur l'interface utilisateur, et si vous ne comprenez pas bien le fonctionnement du CSS, vous pouvez en souffrir.
  - Avec Tailwind, nous nous situons à mi-chemin entre le CSS vanille (utilisant la convention) et Bootstrap (utilisant la configuration).
- Zombies
  - Avec le CSS vanilla, il est fort probable que vous écriviez des styles qui ne seront pas utilisés ou qui deviendront inutilisés lorsque vous mettrez à jour le balisage.
  - Avec Tailwind, comme il est intégré au paquet CSS, l'étape de compilation purgera automatiquement le CSS dont l'application n'a pas besoin.

Au final, soit vous l'appréciez et vous l'utilisez, soit vous ne l'appréciez pas et vous ne l'utilisez pas. Point final.

Mais avant de nous plonger dans la liste des problèmes, comprenez bien qu'utiliser un outil tel que Tailwind CSS vous empêchera de revenir à vos anciennes méthodes.

Pourquoi ? Parce qu'il vous fera gagner du temps.

Allons-y.

## The Problems Tailwind Tries to Solve

### Separation of Concern

The standard for the last 20 years has been to separate the markup from the style. And it requires naming CSS classes that you’ll see in the HTML (which is hard).

But, more importantly, several weeks later, you’d come back to your code and you’d have forgotten what is the style applied to these classes just by looking at the HTML. So you go back the styles.

Plus, you might use those CSS classes in multiple places and changing their style could break things where you don’t expect…

With Tailwind CSS, you don’t have that problem.

![Screenshot from “**Tailwind CSS is the worst…**” by Fireship.](https://prod-files-secure.s3.us-west-2.amazonaws.com/56cdf79b-bb9b-43db-829f-e971e65ed439/8636ad6e-4cb5-4196-8580-a39ce4e63b51/44086F81-7F47-43D0-A818-1D17D83D027C.png)

Credit: Screenshot from “**Tailwind CSS is the worst…**” by Fireship.

True, this can result in the bolded HTML we’ve all seen and say: “BURK!”

With Visual Studio Code, you can use the extension “Inline fold” to minimize those inline Tailwind CSS classes.

Alternatively, you can use the `@apply` grouping in your component’s CSS, but that won’t solve the problem of blotted HTML when you look at the HTML in your browser DevTools.

### Verbosity

CSS is verbose. With Tailwind CSS classes, you type a lot more characters.

Yes, it’s always better to use the platform directly. With Tailwind CSS, you have to learn an abstraction on top of the CSS. It’s additional work if you’re getting started.

I’d say that you need a good understanding of CSS before you decide to use Tailwind CSS.

### Too Much Power

While CSS gives you too much control over the UI. And you probably know BootStrap, right? Well, it’s difficult to customize and doesn’t give enough power.

Tailwind CSS falls right in the middle of these.

It gives a standard set of constraints that you can use to design a good-looking and consistent UI.

### Zombies

Who has written a CSS class that ends up not being used at all? I have.

With Tailwind CSS, you know that the tool will strip off everything that you don’t use, generating a smaller bundle in the end.

Yes, the drawback is that you need to follow at least 5 steps to set Tailwind CSS up in your project. So it might be better to use it on large projects.

For smaller projects, consider [PicoCss](https://picocss.com/). I’ll give some feedback on this framework later if I use it.

## My Conclusion: Know CSS Before Learning Tailwind CSS

When I discovered Tailwind CSS, the thought that came after a few weeks of using it was:

> You need to understand CSS no matter what.

If you don’t understand Flexbox, you won’t know how to use Tailwind CSS Flexbox classes. And so on…

This is what [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified) also tells web developers.

## Sources I Reviewed For This Article

- [Tailwind CSS is the worst, by Fireship](https://www.youtube.com/watch?v=lHZwlzOUOZ4)
- [Why developers HATE TailwindCSS, by James Luterek](https://www.youtube.com/watch?v=mznsLAWVnOI)
- [Should You Use Tailwind CSS, by Web Dev Simplified](https://www.youtube.com/watch?v=hdGsFpZ0J2E)

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
