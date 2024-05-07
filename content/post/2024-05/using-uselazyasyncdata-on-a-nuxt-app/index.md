---
title: "Utiliser `useLazyAsyncData` dans une application Nuxt"
description: "En mars 2024, je me suis initié à Nuxt en préparant ma certification Vue. Voici ce que j'ai appris sur une fonctionnalité particulière."
image: images/2024-05-10-a-black-dog-resting-on-a-bench.jpg
imageAlt: "Un chien noir se reposant sur un banc."
date: 2024-05-10
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Nuxt
---

C’est un autre scénario qui m’a aidé à comprendre comment les opérations asynchrones fonctionnent et à implémenter mon code autour d’elles.

Alors que je suivais le cours « Nuxt 3 Fundamentals » sur [Vueschool.io](https://vueschool.io/courses/nuxt-js-3-fundamentals) en mars 2023, et dans une leçon, on nous a présentés `useAsyncData`. Il fournit une option pour travailler dans un mode `lazy`.

Dans les docs de Nuxt, j’ai trouvé cet exemple que je n’ai pas suivi jusqu’au bout, dommage, mais qui m’a permis de comprendre le mécanisme.

Prenons l’exemple du projet de la formation que j’ai codé :

```tsx
import { ref } from "vue";
const nuxtApp = useNuxtApp();

/**
 * Contains a Search property
 */
import type ApiSearchResponse from "@@/types/ApiSearchResponse";
import type Movie from "@@/types/Movie";

const pending = ref(false);
const query = ref("Steel");
const page = ref(1);
const movies = ref<Movie[]>([]);

const search = async () => {
  const { pending: fetchIsPending, data: apiSearchResponse } =
    await useLazyAsyncData<ApiSearchResponse>(
      `/movies-search/${query.value}`,
      (): Promise<ApiSearchResponse> => {
        return $fetch(
          `${import.meta.env.VITE_OMDBAPI_URL}&page=${page.value}&s=${
            query.value
          }`
        );
      },
      {
        default: () => null,
        getCachedData(key) {
          const data = nuxtApp.static.data[key] || nuxtApp.payload.data[key];
          if (!data || data === undefined) {
            return;
          }
          return data;
        },
      }
    );
  pending.value = !fetchIsPending.value;
  movies.value = [...(apiSearchResponse.value?.Search || [])];
};
```

Je l’ai utilisé sur une page de recherche de films et à chaque fois que j’y accédais directement, cela fonctionnait, me chargeant les films et leurs informations.

Si je naviguais d’abord sur la page d’accueil, par exemple, puis sur la page de recherche, j’obtenais une page blanche…

Pourquoi ?

Le problème se situe à la dernière ligne de la méthode `search`.

Si vous tracez dans la console `fetchIsPending` et `apiSearchResponse`, la valeur de la première variable est égale à `true` et la seconde est égale à `undefined`.

C’est logique puisqu’il s’agit d’un chargement `lazy` des données demandées.

Quand `fetchIsPending` deviendra une valeur vraie, `apiSearchResponse` contiendra une instance de `ApiSearchResponse`.

Comment _surveiller_ le moment de ce changement ?

De la manière suivante :

```tsx
watch(apiSearchResponse, (finalResponse) => {
  movies.value = [...(finalResponse?.Search || [])];
});
```

Cependant, vous avez peut-être remarqué l’option `getCachedData` utilisée sur `useLazyAsyncData`.

Si vous vous arrêtez en ajoutant le `watch`, que vous naviguez vers une autre page et que vous revenez sur la page de recherche, celle-ci sera vide à nouveau.

En fait, Nuxt retourne la réponse en cache, mais le code n’utilise pas cette valeur en cache.

Il faut donc ajouter une vérification :

```tsx
if (!fetchIsPending.value) {
  movies.value = [...(apiSearchResponse.value?.Search || [])];
}
```

Voilà : vous traitez à la fois la première demande et la demande mise en cache et l’utilisateur est heureux d’utiliser votre application !

Crédit : Photo par [Priscilla Du Preez](https://unsplash.com/@priscilladupreez?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/black-pug-puppy-on-brown-wooden-chair-dOnEFhQ7ojs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
