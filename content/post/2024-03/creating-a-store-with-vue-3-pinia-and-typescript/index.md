---
title: "Créer un store avec Vue 3, Pinia et TypeScript"
description: "La gestion d’état vous permet d’exécuter une application plus rapidement. Depuis un certain temps, Pinia a remplacé Vuex dans les applications Vue. Avec Pinia, il est temps d’adopter l’API de composition, même au sein des magasins d’état."
image: images/2024-03-01-pinia-image-from.jpg
imageAlt: "Image du logo de Pinia issue de VueSchool.io"
date: 2024-03-01
categories:
  - Développement Web
tags:
  - TypeScript
  - Astuce du jour
---

Pinia est l’extension de gestion d’état recommandé pour les applications Vue.

Bien que vous puissiez l’utiliser avec la méthode « *Option API* », si vous utilisez TypeScript, optez pour la méthode « *Composition API* ».

Oui, même au sein des magasins d’états, vous pouvez utiliser le modèle `setup`.

Avec JavaScript, vous auriez, par exemple :

```jsx
import { ref } from 'vue' ;
import { defineStore } from 'pinia' ;
import useSampleData de '@/composables/useSampleData' ;

const { categoriesData } = useSampleData() ;

export const useCategoryStore = defineStore('CategoryStore', {
  state : {
    categories = ref(categoriesData) ;
  },
  getters : {
    getCategoryById = (categoryId) => {
      const match = this.categories.value.find(
        (category : Category) => category.id === categoryId
      ) ;
      if (match === undefined) return {} ;

      return match ;
    }
  }
}) ;
```

Avec TypeScript, cela devient :

```tsx
import { ref } from "vue" ;
import { defineStore } from "pinia" ;
import useSampleData de "@/composables/useSampleData" ;
import type Category from "@/types/Category" ;

const { categoriesData } = useSampleData() ;

export const useCategoryStore = defineStore("CategoryStore", () => {
  //ÉTAT
  const categories = ref(categoriesData) ;

  //GETTERS
  const getCategoryById = (categoryId : string | undefined) : Catégorie => {
    const match = categories.value.find(
      (category : Category) => category.id === categoryId
    ) ;
    if (match === undefined) return {} ;

    return match ;
  } ;

  return { categories, getCategoryById } ;
}) ;
```

La fonction fléchée que vous voyez après le nom du magasin utilise la définition de la fonction avec le modèle de configuration.

Remerciements à :

- [Cette discussion sur GitHub](https://github.com/vuejs/pinia/discussions/983#discussioncomment-2045733) pour m’avoir aidé à comprendre la technique.
- [VueSchool.io](https://vueschool.io/) pour [l’image](https://github.com/vueschool/pinia-the-enjoyable-vue-store).
