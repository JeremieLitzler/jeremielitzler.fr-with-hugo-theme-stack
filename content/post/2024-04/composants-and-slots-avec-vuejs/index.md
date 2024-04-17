---
title: "Composants et « slots » avec Vue.js"
description: "Il m’a fallu de nombreux exemples et beaucoup de pratique pour comprendre les « slots ». Qu’il s’agisse de « slots » simples, de « slots » nommés ou de « slots scopés », vous découvrirez qu’il s’agit d’une fonctionnalité puissante dans Vue. C’est parti !"
image: images/2024-04-22-a-red-slots-sign-on-the-dark.jpg
imageAlt: "Un panneau rouge indiquant « Slots » dans l’obscurité."
date: 2024-04-17
categories:
  - Développement Web
tags:
  - Astuce du jour
  - Vue
---

## Le défi

À la fin du mois dernier, j’ai essayé de résoudre un petit projet tout en apprenant les concepts de Vue.js.

Le projet consistait à construire un carrousel photo qui utilisait 2 composants enfants dans le composant `App.vue`. Le `SwiperSlide` ci-dessous se trouve dans un _slot scopé_.

Le _slot_ réside dans le composant `Swiper` comme vous le voyez avec `v-slot="{ item }"` ci-dessous.

```html
<!-- App.vue template -->
<template>
  <section>
    <Swiper
      :list="images"
      :index="index"
      v-slot="{ item }"
      @change="index = $event"
    >
      <SwiperSlide v-bind="item" />
    </Swiper>
  </section>
</template>
```

Le défi auquel j’ai dû faire face a été d’implémenter le code de manière à ce que :

- l’application `App.vue` fournisse le template sans modifier le code présenté ci-dessus).
- le code du composant enfant `SwiperSlide` fourni était le suivant et n’avait pas besoin de modification non plus :

```html
<!-- Composant SwiperSlide.vue -->
<template>
  <img :src="image" :alt="`Image ${title}`" width="400" height="200" />
</template>

<script setup>
  defineProps({
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  });
</script>
```

Je ne comprenais pas comment je devais coder le composant `Swiper` sans toucher à `App.vue` et au composant `SwiperSlide`.

J’ai lu plusieurs fois [cette section de la documentation](https://vuejs.org/guide/components/slots.html#scoped-slots) qui décrivait le cas d’utilisation.

## Comment m’y suis-je pris

Avec ce qui suit, j’ai réussi l’implémentation :

```html
<template>
  <section class="container">
    <Transition>
      <ul ref="ulElement">
        <li>
          <slot :item="{ ...currentImage }"></slot>
        </li>
      </ul>
    </Transition>
    <button v-show="showPrev" class="prev-slide" @click="prevImage"><</button>
    <button v-show="showNext" class="next-slide" @click="nextImage">></button>
  </section>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  const props = defineProps({
    list: { type: Array, required: true },
    index: { type: Number, required: true },
  });
  const emits = defineEmits(["@change"]);
  const currentImage = computed(() => props.list[props.index]);
  const currentImageIndex = computed(() => props.index + 1);

  const ulElement = ref(null);
  const translate = ref(null);

  const showPrev = computed(() => currentImageIndex.value > 1);
  const showNext = computed(() => currentImageIndex.value < props.list.length);
  const prevImage = () => {
    emits("@change", props.index - 1);
    translate.value = `-${ulElement.value.offsetWidth}px`;
  };
  const nextImage = () => {
    emits("@change", props.index + 1);
    translate.value = `${ulElement.value.offsetWidth}px`;
  };
</script>
```

Tout d’abord, le nom de la _prop_ sur l’élément `<slot>` est essentiel : il doit correspondre au nom que le parent fournit au _slot_, dans notre cas il s’agit de `v-slot="{ item }"` dans `App.vue`. La _prop_ doit donc être nommée `:item`.

Deuxièmement, l’objet `currentImage` doit être déstructuré. En effet, c’est grâce à ce mécanisme que l’on peut réaliser la correspondance de la définition des _props_ dans `SwiperSlide` pour qu’il les reçoive individuellement.

Si je me trompe quelque part, [dites-le-moi](../../../page/contactez-moi/index.md) pour que je puisse corriger, mais après l’avoir essayé, je suis sûr que j’ai maintenant compris comment fonctionnent les « slots scopés ».

Merci d’avoir lu cet article.

Crédit: Photo par [Aarón González](https://unsplash.com/@aarez?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/red-and-white-love-neon-light-signage-qyxcwb54yHk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
