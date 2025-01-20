---
title: "Comment mettre à jour l'état d'un intervalle dans Vue"
description: "Au fur et à mesure que j'apprenais à connaître Vue.js et à coder des applications avec le framework, j'ai appris à mettre à jour par intervalle les composants. Voyons comment cela fonctionne avec un exemple détaillé."
image: images/2024-05-03-wood-hourglass.jpg
imageAlt: "Un sablier en bois"
date: 2024-05-03
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Vue.js
---

## Cahier des charges

J’ai choisi l’exemple simple d’un compte à rebours pour démontrer l’intervalle en action. Vous pouvez également appliquer ce qui suit à une horloge web.

Imaginons que vous souhaitiez créer une application de compte à rebours pour le Nouvel An.

```html
<template>
  <div class="app-wrapper">
    <div class="countdown-box">
      <main class="flex justify-center">
        <CountdownSegment data-test="days" label="days" :number="daysLeft" />
        <CountdownSegment data-test="hours" label="hours" :number="hoursLeft" />
        <CountdownSegment
          data-test="minutes"
          label="minutes"
          :number="minutesLeft"
        />
        <CountdownSegment
          data-test="seconds"
          label="seconds"
          :number="secondsLeft"
        />
      </main>
    </div>
  </div>
</template>
```

Il doit répondre aux exigences suivantes :

- Utilisez un composant **`CountdownSegment`** pour afficher les jours, les heures, les minutes et les secondes jusqu’à minuit du 1er janvier de l’année prochaine.

  ```html
  <template>
    <div class="segment">
      <div class="number-wrapper">
        <span class="number">0</span>
      </div>
      <span class="block pt-2 label">{{ label }}</span>
    </div>
  </template>
  ```

- Chaque chiffre doit être mis à jour de manière appropriée toutes les secondes.
- Vous devez mettre à jour les minutes, les secondes, etc., au fur et à mesure qu’elles s’écoulent.
- Le composant **`CountdownSegment`** doit accepter une propriété **`nombre`** et l’utiliser pour afficher combien de temps il reste (x étant les jours, les minutes, etc.).

Disséquons donc l’étape pour obtenir chaque valeur : `daysLeft`, `hoursLeft`, `minutesLeft` et `secondsLeft`.

## Quelle est l’heure actuelle ?

En utilisant l’API `Date`, il suffit d’utiliser le constructeur `new Date()`. Il vous donne l’heure _maintenant_.

## Obtenir la date et l’heure du prochain Nouvel An

Si vous êtes novice en JavaScript, je dois vous avertir : le type `Date` de JavaScript suit le temps en UTC en interne. Il accepte typiquement des entrées et produit des sorties en heure locale de l’ordinateur sur lequel il est exécuté.

Lorsque vous utilisez les différentes fonctions de l’objet `Date`, l’ordinateur applique le fuseau horaire local à la représentation interne. C’est le cas du constructeur `new Date()` qui vous donne la date et l’heure de votre fuseau horaire.

Si vous initialisez, comme je l’ai fait, la valeur de la nouvelle année suivante avec le constructeur `new Date(year, monthIndex, day)`, je vous partage deux mises en garde :

1. Vous aurez un décalage horaire si vous n’êtes pas dans le fuseau horaire GMT+1 (heure de Londres) puisqu’il fournit l’heure GMT+1 (UTC est l’heure GMT).
2. De plus, comme vous pouvez le lire dans `new Date(year, monthIndex, day)`, le second argument est un index et il est basé sur un index de base zéro. Ainsi, janvier n’est pas _mois 1_ mais _mois 0_.

Alors, quel est le code JavaScript pour obtenir la date du Nouvel An et l’heure correcte pour votre fuseau horaire ?

Utilisez le constructeur `const nextNewYear = new Date('2025-01-01')` car il fonctionnera comme `new Date()` et vous serez sûr de ne pas manquer ou d’avoir des heures supplémentaires en fonction de votre fuseau horaire.

## Obtenir les variables calculées

En fait, la source sera un `ref` (pour l’instant).

```tsx
const rightNow = ref(new Date());
```

Ensuite, nous voulons obtenir le temps restant en secondes jusqu’au Nouvel An prochain :

```tsx
const ONE_SECOND = 1000;
const timeLeftSeconds = computed(
  () => (nextNewYear.getTime() - rightNow.value.getTime()) / ONE_SECOND,
);
```

Ensuite, nous pouvons commencer à calculer les `daysLeft`, les `hoursLeft`, les `minutesLeft` et les `secondsLeft` :

```tsx
// nous extrayons le nombre arrondi de jours à partir de `timeLeftSeconds`
const daysLeft = computed(() =>
  Math.floor(timeLeftSeconds.value / oneDayInSeconds),
);
// et nous calculons le nombre exact de secondes à partir du nombre de jours...
const daysLeftSeconds = computed(() => daysLeft.value * oneDayInSeconds);

//et ainsi de suite pour l'heure...
const hoursLeft = computed(() =>
  Math.floor(
    (timeLeftSeconds.value - daysLeftSeconds.value) / oneHourInSeconds,
  ),
);
const hoursLeftSeconds = computed(() => hoursLeft.value * oneHourInSeconds);
//... et les minutes...
const minutesLeft = computed(() =>
  Math.floor(
    (timeLeftSeconds.value - daysLeftSeconds.value - hoursLeftSeconds.value) /
      oneMinInSeconds,
  ),
);
const minutesLeftSeconds = computed(() => minutesLeft.value * oneMinInSeconds);
//... et finalement les secondes...
const secondsLeft = computed(() =>
  Math.floor(
    timeLeftSeconds.value -
      daysLeftSeconds.value -
      hoursLeftSeconds.value -
      minutesLeftSeconds.value,
  ),
);
```

## Animer le compte à rebours

Si vous imprimez les `computed` dans la `<template>`, vous obtiendrez le compte à rebours exact au moment où Vue compile et charge l’application. Mais les nombres ne se mettront pas à jour.

Comment s’assurer que toutes les valeurs se mettent correctement à jour à l’approche de la date du Nouvel An ?

Rappelons le besoin : mettre à jour les minutes, les secondes, etc., au fur et à mesure qu’elles s’écoulent. Comment effectuer une opération sur un _intervalle_ de temps avec JavaScript ?

Oui, j’ai laissé entrevoir la solution : avec `setInterval`.

C’est ce que nous allons faire avec le code suivant :

```tsx
setInterval(() => {
  console.log("one second passed...");

  rightNow.value = new Date();
}, 1000);
```

Nous réassignons `rightNow` à la date actuelle en utilisant le constructeur sur une base de 1000 millisecondes.

Notez qu’une bonne pratique consiste à assigner la valeur de retour de `setInterval` à une variable. Elle contient l’identifiant de l’intervalle que vous utilisez comme argument de `clearInterval(id)` pour arrêter l’intervalle.

Mais où l’appelle-t-on dans une application Vue ?

Appeler `clearInterval()` dans le _script setup_ arrêtera l’intervalle et le compte à rebours ne s’animera pas…

Avec Vue, un hook existe et on l’appelle lors de la destruction du composant : `onUnmounted`.

Voici la syntaxe de Vue 3 dans un _script setup_ :

```tsx
<script setup>
import { ref, onUnmounted } from 'vue';

const rightNow = ref(new Date());
const interval = setInterval(() => {
  console.log('one second passed...');
  rightNow.value = new Date();
}, 1000);
onUnmounted(() => {
  console.log('cleared interval', interval);
  clearInterval(interval);
});
```

Et voilà : le compte à rebours s’anime toutes les secondes jusqu’à une date donnée.

Quand le compte à rebours atteint zéro sur toutes les variables, appelez simplement la fonction `clearInterval`... Vous ne verrez alors pas le compte à rebours reculer…

Savez-vous comment faire ?

```tsx
watchEffect(() => {
  // S'assurer de regarder le temps restant jusqu'à une seconde ou plus...
  // Le fait de regarder jusqu'à 0 ou plus donnera un compte à rebours interrompu avec une valeur erroné...
  const someTimeLeft = timeLeftSeconds.value > 1;
  if (!someTimeLeft) {
    clearInterval(interval);
  }
});
```

Crédit: Photo par [Kenny Eliason](https://unsplash.com/@neonbrand?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/clear-hour-glass-with-brown-frame-KYxXMTpTzek?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
