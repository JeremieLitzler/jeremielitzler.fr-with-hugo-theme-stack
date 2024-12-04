---
title: "Les fondamentaux de Vue.js"
description: "J’aime beaucoup Vue.js. C’est facile à apprendre et efficace à exécuter. C’est de loin mon framework frontal préféré."
image: images/desk-with-computer-opened-and-a-couple-of-books.jpg
imageAlt: "Un bureau avec ordinateur ouvert et quelques livres"
date: 2024-12-04
categories:
  - Développement Web
tags:
  - Vue
---

Vue.js, c’est le pied !

J’ai travaillé un peu avec React. Mais je n’ai pas aimé l’approche JSX. Pour moi, elle brise le concept de séparation des préoccupations.

Je travaille un peu sur les applications Angular et, wow, combien de fichiers faut-il générer pour une application moyenne… J’aimerais m’y former professionnellement pour voir si la courbe d’apprentissage est aussi raide qu’elle me semble l’être pour l’instant.

{{< blockcontainer jli-notice-tip "Si vous êtes intéressés...">}}

Le cours est **gratuit** et disponible [ici](https://vueschool.io/courses/vuejs-fundamentals?utm_source=JLI_Blog_FR&utm_medium=recommandations).

{{< /blockcontainer >}}

## Comprendre les crochets du cycle de vie dans Vue.js

Vous pouvez trouver le diagramme du cycle de vie [ici](https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram).

Vous pouvez également trouver la liste des étapes du cycle de vie dans [la documentation officielle](https://vuejs.org/api/composition-api-lifecycle.html) pour lire davantage sur chaque étape.

Note : cette documentation explique les étapes avec **Vue 3 et l’API de `Composition`**.

Pour l’API `Options`, voir [cette documentation](https://vuejs.org/api/options-lifecycle.html) qui explique la manière d'utiliser l’API `Options`.

Quelques commentaires :

- il est important de noter que dans l’étape `beforeCreate`, la réactivité n’est pas encore en place. Vous pouvez donc mettre à jour n’importe quelle donnée pour le moment.
- l’étape `mounted` donne accès à `this.$el`, qui représente l’élément dans le DOM où réside l’application.

En résumé, l’ordre du cycle de vie est le suivant : `beforeCreate > created > beforeMount > mounted > beforeUnmount > unmounted`

## Double moustache

On peut évaluer une expression dans un `{{ ... }}`.

On ne peut pas déclarer de variables ou d’instructions if dans les doubles moustaches. Cependant, l’instruction ternaire peut s'utiliser dans `{{ ifTrue ? "Afficher ceci" : "Afficher cela" }}`, ou l’opérateur `OR` `{{ aStringValue || "Valeur par défaut" }}`.

## Classes CSS dynamiques

Au lieu de créer une `computed` pour renvoyer une valeur de chaîne d’une classe CSS basée sur un calcul JavaScript, il est préférable d’utiliser des classes CSS dynamiques.

Vous pouvez les utiliser pour activer ou désactiver des expressions JavaScript qui renvoient `vrai` ou `faux`.

Ci-dessous, si `item.purchased` est `true`, nous activons la classe CSS `strikeout` sur l’élément. _L’exemple utilise la syntaxe objet_.

```javascript
        <li
          v-for="item in items"
          :key="item.label"
          class="item"
          :class="{strikeout: item.purchased}"
        >
          {{ item.label }}
        </li>
```

Si vous le souhaitez, vous pouvez combiner plusieurs classes avec la syntaxe *tableau* :

```javascript
        <li
          v-for="item in items"
          :key="item.label"
          class="item"
          :class="[item.purchased ? 'strikeout': '', item.highlight ? 'highlight': '']"
        >
          {{ item.label }}
        </li>
```

## A propos du `computed` (calculé)

Une propriété `computed` est une valeur calculée et doit retourner une valeur, contrairement aux méthodes, où le retour peut être null.

Une `computed` :

- renvoie toujours des données
- ne devrait jamais changer les données sources, mais seulement la façon dont elles sont présentées. Sinon, **c’est une grande source d’anomalies complexes à résoudre !**.

La question la plus fréquente : quand faut-il utiliser `computed` plutôt que les méthodes ?

- Quand vous changez les données, utilisez les méthodes.
- Lorsque vous changez la présentation sur l’interface utilisateur, utilisez les `computed`.

## A propos des `props`

Lorsque vous utilisez une propriété, assurez-vous d’utiliser [_kebab-case_](https://medium.com/@salmankhan_27014/a-comprehensive-guide-to-understanding-naming-conventions-camel-case-vs-pascal-case-vs-kebab-case-e8d3bf1e14db) dans le modèle.

Par exemple, ce composant déclare une `prop` nommée `notificationType` :

```javascript
let NotificationMessageComponent = {
  template: "#notification-message-template",
  props: {
    notificationType: {
      type: String,
      default: "info",
    },
  },
};
```

L’utilisation du nom _camelCase_ dans le modèle dérangera le *linter* :

```html
<notification-message notificationType="error"></notification-message>
```

Avec ce qui suit, tout le monde est content :

```htm
<notification-message notification-type="error"></notification-message>
```

Lisez [la règle dans le guide de style](https://v2.vuejs.org/v2/style-guide/?redirect=true#Prop-name-casing-strongly-recommended) :

> **Les noms d’objets doivent toujours utiliser le _camelCase_ lors de la déclaration, mais le _kebab-case_ dans les modèles et le JSX.**
>
> Nous suivons simplement les conventions de chaque langage. En JavaScript, le _camelCase_ est plus naturel. En HTML, c’est le _kebab-case_ qui l’est.

## L’objet `$event`

Si vous en avez besoin, l’événement original du DOM est disponible via `$event`, que vous pouvez passer aux méthodes de vos directives `v-on` ou `@`.

```htm
<template>
  <!-- Utilisation de la variable $event -->
  <button
    @click="warn('Le formulaire ne peut pas encore être soumis
.', $event)"
  >
    Submit
  </button>

  <!-- Utilisation de la fonction flèche -->
  <button
    @click="(event) => warn('Le formulaire ne peut pas encore être soumis
.', event)"
  >
    Soumettre
  </button>
</template>
<script setup>
  function warn(message, event) {
    // nous avons maintenant accès à l'événement natif
    if (event) {
      event.preventDefault();
    }
    alert(message);
  }
</script>
```

Pou plus d’informations, lisez [la documentation](https://vuejs.org/guide/essentials/event-handling).

## Différences entre `v-if` et `v-show`

`v-if` exclut l’élément du DOM au moment du rendu.

`v-show` fait simplement basculer la propriété CSS `display`.

Le choix entre les deux dépend du cas d’utilisation et de la fréquence à laquelle vous voulez faire basculer l’élément.

D’une manière générale, `v-if` est plus efficace que `v-show`,

- `v-if` a des coûts de basculement plus élevés parce que l’élément n’est pas rendu dans le DOM si la condition est fausse.
- `v-show` a un coût de rendu initial plus élevé parce que l’élément est rendu si la valeur de la condition n’a pas d’importance. Un `display : none` est simplement appliqué par Vue.

Préférez donc `v-show` si vous avez besoin de basculer quelque chose très souvent, et préférez `v-if` si la condition n’est pas susceptible de changer à l’exécution.

Abonnez-vous pour en apprendre davantage sur Vue. J’ai encore beaucoup de choses à partager.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo par [Emile Perron](https://unsplash.com/@emilep?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/macbook-pro-showing-programming-language-xrVDYZRGdw4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
