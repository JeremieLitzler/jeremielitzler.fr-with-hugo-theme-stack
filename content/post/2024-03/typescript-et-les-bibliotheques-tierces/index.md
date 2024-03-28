---
title: "TypeScript et les bibliothèques tierces"
description: "Je souhaite partager cette astuce sur la technique à utiliser lorsque vous voulez typer les paramètres des méthodes qui dépendent de bibliothèques tierces. C’est parti !"
image: images/2024-03-29-code-example.png
imageAlt: "Exemple de code"
date: 2024-03-29
categories:
  - Développement Web
tags:
  - TypeScript
  - Astuce du jour
---

OK, je dois le répéter : TypeScript n'est pas facile, mais il est très utile et cela vaut le coup d'apprendre à l'utiliser.

Je voudrais partager une astuce sur l'utilisation de la bibliothèque VeeValidate avec TypeScript.

Dans la [Masterclass de VueSchool.io](https://vueschool.io/courses/the-vuejs-3-master-class), j'ai utilisé `@invalid-submit` et dans la signature de la fonction personnalisée, j'avais besoin de typer l'argument d'entrée.

Comment ai-je trouvé ce qu'il fallait mettre dans le type du paramètre ?

J'ai survolé l'_emit_ sur le composant `VeeForm` et j'ai obtenu ceci :

![Survol sur `@invalid-submit`](images/2024-03-29-code-example.png)

Le code de ma méthode alors ceci :

```tsx
const handleErrors = (
  context: InvalidSubmissionContext<GenericObject> | undefined
) => {
  if (context === undefined) return;

  const { erreurs, résultats } =
    context as InvalidSubmissionContext<GenericObject>;
  console.log("UserRegister>handleErrors>errors", errors);
  console.log("UserRegister>handleErrors>results", results);
};
```

Voici comment vous pouvez typer votre méthode qui dépend d'une bibliothèque tierce.
