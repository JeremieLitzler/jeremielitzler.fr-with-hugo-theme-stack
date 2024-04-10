---
title: "Utiliser Pinia dans un intercepteur de navigation"
description: "Les intercepteurs de navigation permettent d'exécuter du code à certaines étapes de la navigation. L'utilisation de Pinia sur ces intercepteurs nécessite une petite astuce d'implémentation. Voyons cela de plus près."
image: images/2024-03-01-pinia-image-from.jpg
imageAlt: "Image du logo de Pinia issue de VueSchool.io"
date: 2024-03-04
categories:
  - Développement Web
tags:
  - Pinia
  - Astuce du jour
---

Si vous construisez une application de taille moyenne, vous finirez par utiliser des gardes de navigation pour parcourir les différentes pages de votre application.

Le cas d’utilisation classique : vous souhaitez vérifier qu’un objet existe bien avant de charger ses détails (par exemple sur l’intercepteur `beforeEnter`).

Maintenant, si vous construisez l’application avec Vue 3 et Pinia, c’est en interrogeant un magasin que vous lisez cet objet.

Cependant, l’application ne charge pas Pinia avant l’appel `mount` et vous chargez le routeur avant cela…

Par conséquent, Pinia lancera une erreur _« getActivePinia() » a été appelé mais il n’y avait pas de Pinia actif. Essayez-vous d’utiliser un magasin avant d’appeler « app.use(pinia) » ? Consultez https://pinia.vuejs.org/core-concepts/outside-component-usage.html pour obtenir de l’aide. Cela échouera en production._

Quelle est la solution ? J’ai suivi les étapes de [cette réponse Stackoverflow](https://stackoverflow.com/a/70714477).

1. Créez un fichier `pinia.ts` pour instancier Pinia. Placez-le dans le même endroit que vous avez mis vos magasins.
2. Importez-le et appelez `use` sur l’instance d’application dans `main.ts`
3. Importez-le aussi dans `src/router/index.ts` et fournissez-le à votre instance de magasin qui vous permet de lire l’objet cible : `const store = useStore( pinia )`

La signature du store `useStory` n’a pas besoin d’être modifiée. Fournir l’instance `pinia` à `useStore()` est suffisant pour que cela fonctionne.

Si vous voulez apprendre à utiliser Pinia, [VueSchool.io](https://vueschool.io/courses/) propose [un excellent cours](https://vueschool.io/courses/pinia-the-enjoyable-vue-store) sur le sujet ! Je vous le recommande.  

Crédit : image tirée du cours de VueSchool sur Pinia.
 
