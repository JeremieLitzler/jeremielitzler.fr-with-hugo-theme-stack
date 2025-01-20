---
title: "Comment écrire un composable avec Vue.js"
description: "Les Composables dans Vue.js sont des fonctions réutilisables qui encapsulent une logique d'état et son comportement, permettant de partager du code entre composants de manière modulaire."
image: 2025-01-20-des-lettres-de-scrabble-formant-le-mot-apprendre-en-anglais.jpg
imageAlt: Lettres de scrabble formant le mot « apprendre » en anglais
date: 2025-01-20
categories:
  - Développement Web
tags:
  - Vue.js
---

Vous avez entendu parler des _composables_ Vue.js et vous voulez écrire les vôtres ? Peut-être avez-vous déjà utilisé des _composables_ écrits par d’autres, mais vous doutez de la démarche à suivre commencer à en créer un pour vous-même. C’est l’objet de cet article !

## Qu’est-ce qu’un _composable_ dans Vue.js

Un _composable_ Vue s’apparente à un utilitaire, avec une différence importante : il contient un état, c'est-à-dire des données définies avec la fonction `reactive` ou `ref` de Vue.

[L’exemple utilisé dans la documentation de Vue.js correspond à une fonction _composable_ `useMouse`](https://vuejs.org/guide/reusability/*composables*#mouse-tracker-example). On expose les données réactives `x` et `y` par la fonction _composable_. Cela signifie qu’à chaque fois que les données sont mises à jour, cela déclenche la mise à jour de l’interface utilisateur (UI) des éléments DOM correspondants. [Ici, vous pouvez voir l’effet du _composable_ `useMouse`](https://play.vuejs.org/#eNqNUttq4zAQ/ZVBL3HBuAu7T6Ut7C55aOmNXqAFvRh7kqq1R0IXxyH43zuSEyeFUvpia2bOHJ0zo434a0zRBRQn4tRVVhkPDn0w55JUa7T1sIHg8FrzBwZYWN3CrDhuY1y8uZkkSZUmF3F9DmvGnE0N2ZGk0+ORlgk58NiapvTIEcBIarRTXmkC5aD0J7BhIhiGPB6YbogUU5vIxe5qVjwptLjIQRMTksc6Hp+IcTGYRLPJpBb71LQIVKVr92JhE1WNbnq2wazZL7awy60PcjG7pzA1i8uwQ/JbFoC+6MomIPekfGHKJT6PpfUXpZdYYrPxNznJWNTZOawU1XpVlHU9j/gr5TwS2myWZtHqDmf5VsRR0nvg/zOFTegfsUQey0/B0rRaSQMvwDsex0IteQeaeAvJrxSVbo1q0N6aOBMnBa9ytCtF2TR6dZly3gbMd/nqFav3L/Jvro85Ke4sOrQdSjHVfGmX6Mfy/OEGez5PxVbXoWH0N8V7dLoJUeMI+xeoZtkHuKT2Ir0tRctHN+95UG5nKgpNu0p4Kfhd/f/G+l7u7+LPdseDGD4A5q4sqQ==)

Le point vraiment intéressant des _composables_ réside dans le fait que nous pouvons bénéficier de la définition de données réactives (tout comme dans un composant), mais sans avoir à présenter une UI ! Cela signifie que nous pouvons abstraire la logique en dehors d’un composant et la réutiliser dans le contexte d’une variété de composants différents (ou même sans aucun composant).

Vous pouvez avoir une bonne idée de ce qui est possible en [consultant la documentation de VueUse](https://vueuse.org/). Il s’agit d’une collection de plus de 200 _composables_ immédiatement utilisables qui résolvent des problématiques courantes telles que le travail avec des données dans `localStorage`, le basculement du mode _dark_, et bien plus encore.

## Comment définir un _composable_ avec Vue

Maintenant que vous avez une bonne idée à quoi correspond un _composable_, voyons étape par étape comment en créer un.

La première étape est de créer un fichier pour votre _composable_. La convention nous indique qu’il faut le stocker dans un répertoire appelé `*composables*`.

Dans ce fichier, vous allez exporter une fonction avec un nom qui décrit ce que fait votre _composable_. Pour cet article, nous allons créer un _composable_ `useMenu` comme exemple.

```ts
// @/src/*composables*/useCycleElements.ts
export const useCycleElements = () => {};
```

### Le préfixe `use` pour les _composables_

Notez que le nom du _composable_ commence par `use`. C’est aussi une autre convention commune pour aider les utilisateurs de votre _composable_ à le distinguer d’une fonction utilitaire normale et non étatique.

### Écrire ses _composables_ en TypeScript

C’est aussi une très bonne idée d’écrire vos _composables_ en utilisant TypeScript. Cela les rend plus intuitifs à utiliser (autocomplétion, détection d’erreurs, etc.). Nous utiliserons TypeScript dans cet article, mais si vous n’êtes pas à l’aise avec TypeScript, vous pouvez toujours écrire vos _composables_ en JS.

## Accepter les arguments _composables_

Tous les _composables_ ne nécessitent pas d’argument, mais la plupart en ont besoin. Pour notre exemple, prenons une liste de mots :

```ts
export const useCycleElements = (elements: any[]) => {};
```

Les arguments constituent l’interface (ou API) pour l’_INPUT_ ou entrée du _composable_.

## Retourner des données et des fonctions à partir d’un _composable_

Ensuite, définissons l’API de SORTIE de notre _composable_, c’est-à-dire ce qui est renvoyé par la fonction.

```ts
export const useCycleElements = (elements: any[]) => {
  return {
    prev,
    next,
    current,
  };
};
```

Ici, nous exposons 2 choses. Décomposons chacune d’entre elles.

### `current` ou la donnée d’état

Nous avons ici une donnée réactive.

Par exemple, dans l’utilisation suivante, `current` pourrait valoir le premier mot dans la liste :

```ts
const { current } = useCycleElements("Bonjour", "cher", "lecteur !");
console.log(current); // logs "Bonjour"
```

### La fonction `next`

La fonction exposée `next` permettrait au consommateur du _composable_ de passer à la valeur suivante dans la liste. Ainsi, avec le code suivant, `current` devient `cher` puis `lecteur !`.

```ts
const { current, next } = useCycleElements("Bonjour", "cher", "lecteur !");
console.log(current); // logs "Bonjour"
next();
console.log(current); // logs "cher"
next();
console.log(current); // logs "lecteur !"
```

## Flux de conception des _composables_

Définir l’interface de notre _composable_ (son API). Rien de tout cela ne fonctionne encore parce que nous devons encore implément la logique métier du _composable_. Mais ce n’est pas grave. Il s’agit en fait d’une très bonne méthode pour écrire un _composable_.

On définit comment l’on souhaite utiliser le _composable_ (faites-en une DX, ou expérience de développement, agréable) AVANT d’implémenter les détails.

Cette approche de conception s’applique à tous les types de fonctionnalités (composants, magasins, etc.) et nous pouvons certainement l’appliquer aux _composables_ également.

## Définir un état réactif pour le _composable_

Maintenant, créons un état réactif pour savoir quel élément de la liste est _actif_. C’est ce qui en fait un _composable_ et qui le rend utile dans le contexte d’une application Vue. Ce que nous voulons vraiment savoir, c’est la **position** de l’élément actif. Créons donc un `ref` réactif `activeIndex`.

```ts
import { ref } from "vue";
export const useCycleElements = (elements: any[]) => {
  const activeIndex = ref(0);
  // ...
};
```

Ensuite, nous pouvons créer des données dérivées réactives (c’est-à-dire une variable `computed`) pour déterminer ce que vaudra `menuOpen` en fonction de la valeur de `isDesktop`.

```ts
import { ref, computed } from "vue";
export const useCycleElements = (elements: any[]) => {
  const activeIndex = ref(0);
  // 👇 la variable `current` réactive est basé sur la valeur de `activeIndex`
  const current = computed(() => elements[activeIndex.value]);
  //...
  return { current /*...*/ };
};
```

## Définir des fonctions exposées pour le _composable_

Avec cela, `prev` et `next` sont vraiment faciles à implémenter.

```ts
export const useCycleElements = (elements: any[]) => {
  //...
  // 👇 la fonction next
  function next() {
    // si l'`état` est le dernier élément, commencer au début de la liste
    if (activeIndex.value === elements.length - 1) {
      activeIndex.value = 0;
    } else {
      // sinon, il suffit d'incrémenter l'indice actif de 1
      activeIndex.value += 1;
    }
  }
  // 👇 la fonction prev
  function prev() {
    // si `state` est le premier élément, il faut l'enrouler jusqu'à la fin
    if (activeIndex.value === 0) {
      activeIndex.value = elements.length - 1;
    } else {
      // sinon, il suffit de décrémenter l'indice actif de 1
      activeIndex.value -= 1;
    }
  }
  return { /*...*/ next, prev };
};
```

## Fournir au _composable_ des arguments réactifs

Une chose importante à prendre en compte lors de l’écriture d’un _composable_ est que les gens travaillent souvent avec des données réactives dans leurs composants. Ils s’attendent ainsi à pouvoir passer intuitivement ces données réactives dans n’importe quel _composable_.

En d’autres termes, ils peuvent vouloir faire ceci :

```ts
const sentence = ref(["Bonjour", "cher", "lecteur !"]);
const { current, next } = useCycleElements(sentence);
```

Mettons donc à jour le _composable_ pour qu’il accepte une liste réactive (une liste définie avec `ref` ou `reactive`).

```ts
import { /* ... */, watch, type Ref } from "vue";
export const useCycleElements = (elements: Ref<string[]>) => {
  //...
  // Et ensuite, tout au long du *composable*, vous devrez remplacer toutes les utilisations de
  // `elements` par `elements.value`
  // par exemple 👇
  const current = computed(() => elements.value[activeIndex.value]);
  // faire de même pour list dans next, prev, etc...
  // 👇 enfin, puisque la liste peut changer,
  // exécutons un petit nettoyage sur activeIndex
  // si la liste est remplacée par quelque chose de plus court
  watch(elements, () => {
    if (activeIndex.value >= elements.value.length) {
      activeIndex.value = 0;
    }
  });
  // ...
};
```

## Permettre au _composable_ d’accepter des arguments non réactifs ET réactifs (plus des Getters !)

Ce qui précède est parfait pour accepter une liste réactive. Mais maintenant, nous avons OBLIGÉ le consommateur _composable_ à passer quelque chose de réactif.

Certains peuvent préférer la facilité de passer un simple tableau quand cela s’avère nécessaire. Pas de soucis ! Nous pouvons supporter les deux avec une fonction d’aide de Vue appelée `toRef`.

```ts
import { ref, computed, toRef, watch } from "vue";
import { type MaybeRefOrGetter } from "vue";
// 👇 nous utilisons le type `MaybeRefOrGetter`, natif à Vue
export const useCycleElements = (elements: MaybeRefOrGetter<any[]>) => {
  // l'appel à toRef normalise la liste en ref (quelle que soit la manière dont elle a été transmise)
  const reactiveElements = toRef(elements);
  // remplacer toutes les utilisations de elements.value
  // par reactiveElements.value
  // par exemple 👇
  const current = computed(() => reactiveElements.value[activeIndex.value]);
  // faire de même pour list dans next, prev, watch, etc...
  //...
};
```

Maintenant nous pouvons supporter les deux types de données pour cette liste, et nous obtenons le support d’un troisième type de données GRATUITEMENT ! Tout ce qui suit fonctionne maintenant :

```ts
// Comme des données simples
const { current, prev, next } = useCycleElements([
  "Bonjour",
  "cher",
  "lecteur !",
]);
// En tant que données réactives
const list = ref(["Bonne", "journée", " à vous !"]);
const { current, prev, next } = useCycleElements(list);
// En tant que getter
const list = ref(["A bientôt", "sur", "mon blog"]);
const { current, prev, next } = useCycleElements(() => list.value);
```

Vous pouvez [en savoir plus sur `toRef`](https://vuejs.org/api/reactivity-utilities#toref) dans la documentation de Vue.js. De plus, d'autres fonctions similaires existent pour créer des composants flexibles et robustes : [`toValue`](https://vuejs.org/api/reactivity-utilities#tovalue) et [`isRef`](https://vuejs.org/api/reactivity-utilities#isref), [entre autres](https://vuejs.org/api/reactivity-utilities).

## Améliorer l’API du _composable_ avec une propriété _computed_ modifiable

Actuellement, si nous essayons de définir l’état (`current`) à partir du composant, cela ne fonctionnera pas. Pourquoi ? Nous le définissons comme une propriété calculée ou _computed_.

```ts
const current = computed(() => reactiveElements.value[activeIndex.value]);
```

Pour rendre l’API un peu plus flexible, on pourrait modifier le code pour mettre à jour la valeur de l’index courant dans la liste.

```ts
const current = computed({
  // la méthode `get` est appelée lorsque l'état est lu
  get() {
    // c'est la même chose que le retour de la fonction précédente
    return reactiveElements.value[activeIndex.value];
  },
  // la méthode set est appelée lorsque l'état est écrit
  set(value) {
    // prend la valeur donnée et l'applique à l'élément du tableau à l'index actif
    reactiveElements.value[activeIndex.value] = value;
  },
});
```

## Rendre le _composable_ _TypeSafe_

Jusqu’à présent, nous avons utilisé `string[]` pour définir l’argument _composable_ `word`. C’est assez logique, car nous voulons que notre _composable_ fonctionne pour un tableau de n’importe quoi (pas seulement des chaînes de caractères comme dans les exemples).

Cependant, la plupart des utilisateurs de TypScript savent que l’utilisation de `any` ne rend pas le linter TypeScript très content. Sa présence signifie qu’on peut encore améliorer le code.

Utilisons donc un générique pour dire que chaque élément du tableau est un type de variable.

```ts
// T est le générique ici
export const useCycleElements = <T>(list : MaybeRefOrGetter<T[]>) => {
```

En quoi cela est-il utile ?

Maintenant, TypeScript peut déduire que notre état est un `WritableComputedRef` du MÊME type que les éléments de la liste passée. Dans notre exemple, nous utilisons une chaîne de caractères.

Ce n’est pas une fonctionnalité 100% nécessaire, mais cela peut s’avérer utile en pensant à la façon dont tous les utilisateurs pourraient utiliser votre _composable_ et de le rendre aussi intuitif que possible.

## Conclusion

Les _composables_ sont un outil puissant pour créer une logique réutilisable et avec un état dans vos applications Vue.js. Ils s'avèrent plus faciles à écrire que vous ne le pensez. Bien que VueUse fournisse une vaste gamme de _composables_ pré-écrits pour vous, il y a certainement des moments où vous aurez besoin d’écrire les vôtres. Vous savez maintenant comment faire !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : [Photo de Pixabay](https://www.pexels.com/photo/letter-blocks-247819/)
