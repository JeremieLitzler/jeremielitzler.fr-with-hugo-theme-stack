---
title: "Utiliser le composant de transition dans Vue"
description: "L’animation CSS est une fonctionnalité intéressante disponible nativement depuis la sortie du CSS 3. Mais je n’ai jamais eu l’occasion de jouer avec. Avec Vue, c’est supporté grâce à un composant natif."
image: images/2024-06-28-night-picture-with-light-effects.jpg
imageAlt: Photo de nuit avec effets de lumière.
date: 2024-11-25
categories:
  - Développement Web
tags:
  - Vue.js
  - Animation
---

Jusqu’à ce que je passe la certification Vue.js en avril dernier et qui testa ma compréhension du concept, je ne l’avais pas entièrement compris.

Comment fonctionnent donc `Transition` et `TransitionGroup` ?

## Les cas d’usage

Si vous lisez [la documentation](https://vuejs.org/guide/built-ins/transition.html#transition) correctement (en prenant votre temps), vous comprendrez facilement :

> La transition peut être déclenchée par l’un des éléments suivants :
>
> 1. Rendu conditionnel via `v-if`
> 2. Affichage conditionnel via `v-show` > 3.
> 3. le basculement des composants dynamiques via l’élément spécial `<composant>` > 4. le basculement des composants dynamiques via l’élément spécial `<composant>`.
> 4. Modification de l’attribut spécial `key

## Quelle est la signification de chaque cas d'usage

Les cas 1 et 2 se ressemblent beaucoup : prenons pour exemple cette template, avec `v-if` :

```html
<button @click="show=!show">Afficher</button>
<Transition>
  <p v-if="show">Bonjour</p>
</Transition>
```

Lorsque `show` change, Vue bascule le paragraphe et exécute la transition.

Vous pouvez remplacer `v-if` par `v-show` et vous obtiendrez exactement la même chose.

Qu'en est-il du cas d'usage numéro 3 ? Dans le cas d'un carousel d'images, nous pourrions avoir ceci :

```html
<Transition>
  <li :key="«" `image-${currentImage.title}` »>
    <!-- this is a Scope slot -->
    <slot :item="«" { ...currentImage } »></slot>
  </li>
</Transition>
```

Lorsque vous passez d'une image à une autre, `currentImage.title` est mis à jour ainsi que la valeur `:key`. Cela déclenche alors la transition.

Le cas d'usage numéro 4 était le plus difficile à comprendre. Il concerne l'élément spécial `<component>` que vous pouvez utiliser avec le routeur de Vue. Voici un exemple :

```html
<router-link v-slot="{ Component }">
  <transition name="slide">
    <component :is="Component" :key="$route.path"></component>
  </transition>
</router-link>
```

En fait, la transition s'exécutera à chaque fois que le chemin de la route changera.

N'oubliez pas non plus que `<Transition>` ne peut contenir qu'un seul élément ou composant. Si le contenu est un composant, le composant doit également avoir un seul élément racine.

Cela ne fonctionnerait donc pas :

```html
<button @click="show = !show">Afficher</button>
<Transition>
  <p v-if="show">Bonjour</p>
  <p>le monde</p>
</Transition>
```

Toutefois, cela ne signifie pas que vous ne pouvez pas faire défiler plusieurs éléments comme dans cet exemple :

```html
<Transition>
  <button v-if="docState === 'saved'">Editer</button>
  <button v-else-if="docState === 'edited'">Sauvegarder</button>
  <button v-else-if="docState === 'editing'">Annuler</button>
</Transition>
```

## Learn More

Voir le code complet de cet exemple dans [l’environnement de démonstration de Vue.js](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==).

Il y a plus d’informations sur l’utilisation des transitions, comme [les modes de transition](https://vuejs.org/guide/built-ins/transition.html#transition-modes), [les transitions entre composants](https://vuejs.org/guide/built-ins/transition.html#transition-between-components) ou [les transitions dynamiques](https://vuejs.org/guide/built-ins/transition.html#dynamic-transitions), alors n’hésitent pas à consulter la documentation.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédits: l’image d’en-tête provient de [Federico Beccari](https://unsplash.com/@federize?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/time-lapse-photography-of-square-containers-at-night-ahi73ZN5P0Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
