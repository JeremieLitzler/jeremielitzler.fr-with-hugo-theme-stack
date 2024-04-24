---
title: "Valider des props avec Vue.js"
description: "La déclaration des « props » avec Vue.js peut inclure plus que la simple définition des données transmises du composant parent au composant enfant. Voyons comment une validation plus complexe est déclarée."
image: images/2024-04-26-hands-ready-to-receive.jpg
imageAlt: "Une paire de mains prête à recevoir"
date: 2024-04-24
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Vue
---

Lorsque j’ai écrit sur [la fonctionnalité Vue concernant les _props_ avec TypeScript](../../2024-03/definir-ses-props-avec-vue-3-et-typescript/index.md), je n’ai présenté qu’un exemple simple où les _props_ étaient des primitives.

Mais qu’en est-il des types de référence ? Et qu’en est-il de la validation des *props* ? Et l’utilisation de la syntaxe TypeScript dans ce contexte ?

{{< blockcontainer jli-notice-note "Dans les exemples ci-dessous, je n'utilise que l'API Composition.">}}

{{< /blockcontainer >}}

Avec JavaScript, cela ressemblerait à ceci :

```jsx
defineProps({
  type: {
    // vous définissez d'abord votre règle de validation,
    // ci-dessous, les `validValues` sont représentées par un tableau de chaînes de caractères.
    // voir https://vuejs.org/guide/components/props.html#prop-validation
    validator(value) {
      const validValues = [
        "primary",
        "ghost",
        "dashed",
        "link",
        "text",
        "default",
      ];
      // si la valeur fournie existe dans le tableau des valeurs valides,
      // alors la prop est acceptée.
      return validValues.includes(value);
    },
    // omettre ce qui suit si la prop est obligatoire et n'a pas de valeur par défaut.
    default() {
      return "default";
    },
  },
});
```

With TypeScript, it’d look like this:

```tsx
import { PropType } from "vue";

defineProps({
  type: {
    // PropType est utilisé pour annoter une propriété avec des
    // types plus avancés lors de la déclaration de props à
    // l'exécution.
    type: String as PropType<
      "primary" | "ghost" | "dashed" | "link" | "text" | "default"
    >,
    default: "default",
    validator: (prop: string) =>
      ["primary", "ghost", "dashed", "link", "text", "default"].includes(prop),
  },
});
```

Crédits à :

- **[@webfansplz](https://github.com/webfansplz)** qui a construit le site web [Vue.js challenges app](https://vuejs-challenges.netlify.app/) et m’a mis au défi de trouver la solution sur la validation des _props_.
- [Orbis](https://stackoverflow.com/users/17603999/orbis) sur [cette réponse Stackoverflow](https://stackoverflow.com/a/70565332)
- Photo par [Andrew Moca](https://unsplash.com/@mocaandrew?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/persons-hand-forming-heart-olmY3NkTY_M?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
