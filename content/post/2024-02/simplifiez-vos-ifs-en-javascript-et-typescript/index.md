---
title: "Simplifiez vos ifs en JavaScript et TypeScript"
description: "La qualité du code, est-ce une chose à laquelle vous veillez dans vos tâches quotidiennes ? Oui, j’y veille. Mais parfois, il ne s’agit pas seulement d’économiser des frappes ou un certain nombre de caractères. Voyons cela de plus près."
image: images/2024-02-23-code-sample.jpg
imageAlt: "Contenu d'un fichier TypeScript"
date: 2024-02-23
categories:
  - Développement Web
tags:
  - Astuce du jour
---

Supposons que vous ayez ce qui suit :

```jsx
const result = value1;
if (result === null || result === undefined) {
  result = value2;
}
```

Comment le transformer en une ligne sans écrire `if` ?

```jsx
const result = value1 ?? value2;
```

OK, vous gagnez 3 lignes, mais avant de l'utiliser partout, pensez à 2 choses pour vos cas d'utilisation :

1. Cela change-t-il quelque chose à la performance de votre application ?
2. Cela est-il lisible par n'importe qui, aussi bien expérimenté que débutant ?

Peut-être que, dans l'exemple, il est correct d'utiliser l'opérateur de _Nullish coalescing_.

Je dirais que ce n'est pas toujours le cas.

Veuillez lire l'[article MDN sur l'opérateur de *Nullish coalescing*] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) à ce sujet.

Jetez également un coup d'œil à cet article [_javascripttutorial.net_](https://www.javascripttutorial.net/es-next/javascript-nullish-coalescing-operator/) que j'ai bien aimé. Il va dans le détail avec des cas d'utilisation intéressants.

Merci pour votre lecture.
