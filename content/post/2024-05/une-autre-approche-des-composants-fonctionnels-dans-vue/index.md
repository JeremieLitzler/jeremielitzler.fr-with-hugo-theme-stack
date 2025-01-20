---
title: "Une autre approche des composants fonctionnels dans Vue"
description: "J’ai écrit un article qui introduisait les composants fonctionnels il y a quelque temps et j’ai découvert par la suite que vous pouviez l’écrire d’une autre manière."
image: images/2024-05-17-a-kid-building-something-with-lego-blocks.jpg
imageAlt: "Un enfant construit quelque chose avec des blocs LEGO."
date: 2024-05-31
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Vue.js
---

## Introduction

Je vais vous montrer ici comment construire un composant fonctionnel en utilisant `defineComponent`.

Je vais partager un exemple rencontré [dans la série des défis Vue.js](https://vuejs-challenges.netlify.app/questions/218-h-render-function/README.html), où j’ai appris à utiliser cette fonctionnalité.

Lisez bien tous les commentaires dans le code ci-dessous.

## Exemple de code

```tsx
// On utilise TypeScrit ci-dessous
import { h } from "vue";
import { defineComponent } from "vue";

const MyButton = defineComponent(
  // ci-dessous, il s'agit de la méthode ``setup` où l'on déstructure le contexte
  // pour extraire les emit et les slots
  (props, { emit, slots }) => {
    // cette fonction flèchée est similaire à la fonction `return {}` que vous utilisez dans la fonction setup d'un composant SFC
    return () => {
      // appeler la fonction créant les noeuds virtuels de la DOM
      return h(
        // ajouter un élément de type bouton
        "button",
        {
          // ... avec l'attribut disabled assigné
          // à la valeur de l'attribut disabled
          disabled: props.disabled,
          // bind a click event to custom-click emit
          onClick: () => emit("custom-click"),
        },
        // transmet le contenu du slot à l'élément
        slots.default?.(),
      );
    };
  },
  // des options supplémentaires, par exemple déclarer des `props` et des `emits`
  {
    // nom du composant
    name: "MyButton",
    // définition des `props`
    props: {
      disabled: { type: Boolean, default: false },
    },
    // définition des `emits`
    emits: ["custom-click"],
  },
);
export default MyButton;
```

Maintenant, vous comprenez Vue.js un peu plus en profondeur.

En ce qui concerne la `template`, l'utilisation reste inchangée par rapport à un composant SFC classique.

```html
<script setup lang="ts">
  import { ref } from "vue";
  import MyButton from "./MyButton";

  const disabled = ref(false);
  const onClick = () => {
    disabled.value = !disabled.value;
  };
</script>

<template>
  <!-- 
	  `:disabled` est éauivalent à `:disabled="disabled"` depuis Vue 3.4+
	  lire https://vuejs.org/guide/essentials/template-syntax.html#same-name-shorthand
  -->
  <MyButton :disabled @custom-click="onClick"> my button </MyButton>
</template>
```

N’hésitez pas à me contacter si vous voyez des erreurs ou si vous voulez simplement [dire merci](../../../page/soutenez-moi/index.md).

Crédit: Photo par [Kelly Sikkema](https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/toddlers-playing-building-block-toys-JRVxgAkzIsM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
