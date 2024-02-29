---
title: "Utiliser le bon type sur une prop dans Vue.js"
description: "TypeScript vous permet d'apprendre chaque ligne de code que vous écrivez. Voici un autre conseil sur la saisie adéquate des props avec Vue 3."
image: images/2024-02-28-eslint-typescript-error-details.jpg
imageAlt: "Détails d'une erreur TypeScript détectée par ESLint"
date: 2024-02-28
categories:
  - Développement Web
tags:
  - TypeScript
  - Astuce du jour
---

Une fois de plus, il ne m'a pas fallu longtemps pour comprendre ce qu'il me manquait, car les erreurs d'ESLint sont souvent explicites.

J'ai découvert ceci lorsque je codais [la leçon 35](https://vueschool.io/lessons/introducing-categories-collections-of-forums) de la MasterClass sur Vue.js fournie par l'excellent équipe de VueSchool.io.

Lorsque vous typez une `prop`, n'utilisez pas `String` mais utilisez le type primitif `string`.

Le premier est un _wrapper object_, mais pour rendre ESLint heureux, vous devez utiliser la primitive.

Par exemple, vous devriez éviter cette déclaration :

```typescript
const props = defineProps<{ id?: String; edit?: boolean }>();

//eslint se plaindra de `props.id`
if (props.id) {
  return getUserById(props.id);
}
```

Il en va de même pour :

- `number` et `Number`.
- `boolean` et `Boolean`.
