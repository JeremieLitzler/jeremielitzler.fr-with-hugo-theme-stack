---
title: "Enregistrer globalement des composants dans Vue 3"
description: "En suivant les cours sur VueSchool.io, j'ai dû trouver comment enregistrer des composants disponibles globalement avec Vue 3 et TypeScript. Voici comment procéder."
image: images/preview-of-main.ts-file.jpg
imageAlt: "Capture d'écran du main.ts où les composants globaux sont enregistrés"
date: 2024-02-27
categories:
  - Tutoriels
tags:
  - Vue
  - TypeScript
#draft: true
---

Alors que le guide de style de Vue 2 donnait le code pour le faire, le guide de style de Vue 3 l’a supprimé.

Comment cela fonctionne-t-il sur Vue 3 et TypeScript

J’ai donc creusé et je suis tombé sur [cet article](https://zerotomastery.io/blog/how-to-auto-register-components-for-vue-with-vite/).

Le problème avec la solution proposée : la méthode `globEager` n’existe plus.

Pour faire la même chose, vous pouvez utiliser `.glob(regexString, {eager : true}`.

Cela vous retourne une liste d’objets de type `[string, unknown][]`.

En utilisant JavaScript, ESLint ne se plaindrait pas, mais avec TypeScript, vous rencontrerez un problème avec le `unknown`.

Le code qu’ESLint n’aime pas ressemble à ceci :

```typescript
//Inspiré par :
// - https://zerotomastery.io/blog/how-to-auto-register-components-for-vue-with-vite/
// - https://dev.to/jakedohm_34/auto-registering-all-your-components-in-vue-3-with-vite-4884

const componentFiles = import.meta.glob("@/components/App*.vue", {
  eager: true,
});
const componentFilesEntries = Object.entries(componentFiles);

for (const [componentPath, moduleImport] of componentFilesEntries) {
  const componentName: string | undefined = componentPath
    .split("/")
    .pop()
    ?.replace(".vue", "");

  if (!componentName) {
    console.warn(
      `Le nom du composant n'a pas pu être extrait du chemin > ${componentPath} `
    );
    continue;
  }
  app.component(componentName!, moduleImport.default);
  console.info(`Composant enregistré <${composantName!}> globalement.`);
}
```

Où se situe le problème ? Sur la ligne `app.component(componentName !, moduleImport.default) ;`, et plus particulièrement le `moduleImport.default`.

Pour le résoudre, vous devez le _typer_.

En utilisant quelques `console.log`, j’ai découvert que `moduleImport` est de type `Object` avec une propriété `default`, également de type `Object`.

La solution est donc de déclarer une interface de `moduleImport` :

```tsx
interface ModuleImportInterface {
  par défaut : Objet ;
}
```

Il n’est pas nécessaire d’être plus précis sur `default` dans ce cas d’utilisation.

Enfin, vous devez convertir le `moduleImport` de type `unknown` en `ModuleImportInterface` pour avoir accès à la propriété `default` :

```tsx
app.component(componentName!, (moduleImport as ModuleImportInterface).default);
```

ESLint ne remonte plus d'erreur et surtout, le code fonctionne toujours !

C’est un excellent cas d’utilisation pour couler une variable de type inconnu.

N’hésitez pas à partager !
