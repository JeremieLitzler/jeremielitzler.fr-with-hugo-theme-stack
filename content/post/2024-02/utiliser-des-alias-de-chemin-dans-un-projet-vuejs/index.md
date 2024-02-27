---
title: "Utiliser des alias de chemin dans un projet Vue.js"
description: "L’expérience des développeurs sur les projets Vue.js peut être grandement améliorée en utilisant une simple configuration. Voici comment vous assurer que vos importations ne sont pas relativement déclarées."
image: images/2024-02-19-vite.config.ts-contents.jpg
imageAlt: 'Contenu du fichier "vite.config.ts"'
date: 2024-02-19
categories:
  - Développement Web
tags:
  - TypeScript
  - JavaScript
  - Astuce du jour
---

Je trouve cette astuce très pratique une fois que vous l’avez mise en place.

## Dans les projets JavaScript

Ajoutez l’alias dans `jsconfig.json` pour avoir les super pouvoirs d’intellisense et l’avantage des chemins absolus :

```json
{
  "compilerOptions" : {
     ...
     "paths" : {
      "@/*" : ["./src/*"]
    }
    ...
}
```

## Dans les projets TypeScript

1. Installer le paquet `@types/node` comme dépendance dev.
2. Ajouter les imports suivants dans `vite.config.ts` :

```typescript
import { fileURLToPath, URL } from "node:url";
```

3. Ajoutez l’option `resolve` dans le même fichier :

```typescript
   resolve : {
       alias : {
         "@" : fileURLToPath(new URL("./src", import.meta.url)),
       },
     },
```

4. Ajoutez l’alias à `tsconfig.json` pour éviter les erreurs d’ESLint et avoir les super pouvoirs d’intellisense :

```json
{
"compilerOptions" : {
  ...
  "paths" : {
    "@/*" : ["./src/*"]
  }
  ...
}
```

Vous êtes prêts pour code plus efficacement !
