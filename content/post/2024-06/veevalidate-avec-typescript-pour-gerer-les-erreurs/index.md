---
title: "VeeValidate avec TypeScript pour gérer les erreurs"
description: "TypeScript demande de l’adaptation. Pourtant, je souhaite partager une astuce sur l’utilisation de la bibliothèque avec TypeScript."
image: images/2024-06-18-veevalidate-homepage-and-slogan.jpg
imageAlt: "Page d’accueil et slogan de VeeValidate"
date: 2024-06-18
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Vue
---

Dans [l’ancienne version de la masterclass de VueSchool.io](https://vueschool.io/courses/the-vuejs-3-options-api-master-class), j’ai utilisé le `@invalid-submit` dans le template pour gérer les erreurs remontées par VeeValidate.

Dans la fonction personnalisée `handleErrors`, j’avais besoin de typer l’argument d’entrée.

## Comment trouver ce qu’il fallait mettre ?

J’ai survolé l’_emit_ sur le composant VeeForm :

![Exemple de code avec infobulle](images/code-example-with-tooltip.png)

Bien que le type exact soit `InvalidSubmissionHandler<GenericObject> | undefined`, j’ai enlevé le `undefined` pour pouvoir déstructurer l’objet :

```ts
const handleErrors = ({
  erreurs,
  résultats,
}: InvalidSubmissionContext<GenericObject>) => {
  console.log("UserRegister>handleErrors>errors", errors);
  console.log("UserRegister>handleErrors>results", results);
};
```

De cette façon, je peux utiliser les variables `errors` et `results` dans la méthode.

Bien sûr, vérifiez qu’il n’y a pas de valeur `undefined` avant d’y accéder.

L’utilisation du type exact empêche l’intellisense, mais vous devrez renoncer à la déstructuration si vous voulez absolument la sécurité du type.

Crédit : La photo d’en-tête est la page d’accueil du site web de VeeValidate par [VeeValidate Team](https://vee-validate.logaretm.com/v4/).
