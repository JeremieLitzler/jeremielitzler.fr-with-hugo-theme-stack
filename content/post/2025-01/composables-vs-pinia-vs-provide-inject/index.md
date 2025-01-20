---
title: "Composables vs Pinia vs Provide/Inject"
description: "Permettez-moi de présenter les principales différences et les cas d'utilisation de chaque approche de la gestion des états dans Vue 3."
image: 2025-01-13-sea-current-stone-pile.jpg
imageAlt: Une pile de pierre devant lal mer
date: 2025-01-15
categories:
  - Développement Web
tags:
  - Vue.js
---

Avec Vue.js, les composables, les magasins Pinia et la fonctionnalité `provide/inject` jouent chacun un rôle dans des cas d’utilisation spécifiques.

Je vais partager dans cet article ce que j’ai appris à leur sujet en travaillant sur plusieurs projets Vue.js.

## Les différences

### Composables

Ils s'avèrent idéals pour :

- La logique d’état réutilisable spécifique à une fonctionnalité ou à un composant.
- La gestion des états locaux où vous avez besoin de plusieurs instances du même état (par exemple, plusieurs widgets d’actualités avec différentes catégories).
- Les fonctionnalités critiques en termes de performances, car les composables semblent environ 1,5 fois plus rapides que Pinia pour les changements réactifs et 20 fois plus rapides pour les changements réflexifs.
- La gestion d’état simple sans dépendances externes.

Lire [davantage sur le sujet ici](https://vue-faq.org/en/development/stores.html) et [là](https://github.com/vuesence/pinia-vs-reactive).

### Les magasins Pinia

Vous les utiliserez dans les cas suivants :

- L’état global d’une application que l'on souhaite accessible à partir de plusieurs composants. C’est également vrai pour les composables. Nous allons voir plus loin comment choisir entre les deux.
- La gestion d’état complexe nécessitant l’intégration de DevTools pour le débogage.
- Les applications de rendu côté serveur (SSR) avec état global.

### La fonctionnalité `Provide/Inject`

Enfin, cette fonctionnalité native de Vue vous permet :

- De transmettre des données à travers plusieurs couches de composants sans avoir recours au « _prop drilling_ ».
- D’éviter de rendre l’état globalement accessible à des composants non liés.

### Exemples concrets

Commençons par un exemple composable :

```ts
// Cet état est accessible globalement dans l'application.
const menuOpen = ref(false);

export const useMenu = () => {
  // Cet état serait valable pour une seule instance
  // const menuOpen = ref(false)
  const toggleMenu = () => (menuOpen.value = !menuOpen.value);

  return {
    menuOpen,
    toggleMenu,
  };
};
```

Dans un composant, en appelant `toggleMenu()`, vous modifiez la valeur de `menuOpen` de `true` 0 `false`, par exemple, et cette nouvelle valeur est persisté dans le reste de l’application.

Voyons maintenant un exemple de Pinia :

```ts
// État global du titre de la page à l'aide d'une approche `script setup`
export const usePageStore = defineStore("page-store", () => {
  const pageData = ref({
    title: "",
  });

  return {
    pageData,
  };
});

// Activer le HMR sur le magasin
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot));
}
```

Cela ressemble beaucoup à un _composable,_ vous me direz, et vous n’avez pas complètement tord.

Enfin, qu’en est-il de l’utilisation de `Provide/Inject` ?

Cela semble plus complexe à première vue, mais relisez les cas d’utilisation ci-dessus pour comprendre quand utiliser cette fonctionnalité :

- tout d’abord, nous créons le fichier contenant les clés d’injection :

```typescript
import type { InjectionKey } from "vue";
import User from "@/types/User";

//créer une `InjectionKey` unique puisque provide l'exige.
// L'utilisation d'un symbole garantit l'unicité. Voir https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
export const userInjectionKey = Symbol() as InjectionKey<User>;
```

- Ensuite, nous fournissons la valeur dans `App.vue` :

```typescript
import { provide } from "vue";
import { userInjectionKey } from "@/injectKeys";

provide(userInjectionKey, user);
```

- et nous l’utilisons dans n’importe quel composant de l’application à un niveau très différent du composant où `provide` est utilisé :

```typescript
import { inject } from "vue";
import { userInjectionKey } from "@/injectKeys";

const user = inject(userInjectionKey);
```

N.B. : par défaut, TypeScript sait que l’objet injecté peut être nul. Ainsi, lorsque vous utilisez la valeur dans le modèle du composant, pensez-y avec le `?` sur l’objet `user`.

```htm
<span>{{ user?.username || "Anonymous" }}</span>
```

## Bonne pratique entre Pinia et composables pour les demandes d’API

Il n’y a pas de solution unique, mais voici une répartition pratique pour traiter la consommation d’API :

### Composables pour la consommation d’API

Les composables sont souvent le meilleur choix pour les demandes d’API dans les cas suivants :

- Vous avez besoin de plusieurs instances indépendantes de la même logique d’API
- Les données sont limitées à une fonctionnalité spécifique ou à une arborescence de composants.
- Les performances se révèlent essentielles pour votre application.

### Quand utiliser Pinia à la place

Pinia s'utilise pour la consommation d’API lorsque :

- Les données doivent être partagées entre plusieurs composants non liés.
- Vous avez besoin d’outils DevTools intégrés pour déboguer les appels d’API.
- Les données représentent l’état global de l’application.

### Approche hybride

Pour les applications plus importantes, envisagez :

- L’utilisation de composables pour les appels API spécifiques aux fonctionnalités et la gestion des données.
- L’utilisation de Pinia pour l’état global qui doit persister dans l’application et que l’on accède depuis des composants non liés.
- La séparation des appels d’API dans des couches de service dédiées.
- L’utilisation des composables dans les magasins Pinia lorsque cela est nécessaire. Je n’ai pas pratiqué ce cas d’utilisation, mais j’ai lu quelque chose à ce sujet [dans la documentation de Pinia](https://pinia.vuejs.org/cookbook/composables.html).

La clé est d’éviter de dupliquer les appels d’API à travers plusieurs composants et de garder la logique de récupération des données organisée et maintenable.

Si vous construisez une application de petite ou moyenne taille, les composants peuvent être suffisants.

Pour les applications plus importantes avec des besoins de gestion d’état complexes, la combinaison des deux approches donne souvent les meilleurs résultats.

## Conclusion

Merci d’avoir lu cet article ! Avez-vous appris quelque chose ? Si oui, partagez-le !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : photo de [Pixabay](https://www.pexels.com/photo/cairn-stones-and-body-of-water-in-distance-235990/)
