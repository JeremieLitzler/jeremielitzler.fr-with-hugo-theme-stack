---
title: "Gérer un argument inutilisé avec TypeScript et ESLint"
description: "Je poursuis mon apprentissage de TypeScript et de la vérification ESLint. Aujourd'hui, je voulais parler des arguments inutilisés dans une méthode."
image: images/2024-02-16-typescript-code-sample.png
imageAlt: Exemple de code TypeScript
date: 2024-02-16
categories:
  - Web Development
tags:
  - TypeScript
  - Astuce du jour
---

Je suis encore assez novice en TypeScript, mais je progresse grâce au [curriculum VueSchool.io](https://vueschool.io/courses).

J’aime ce que TypeScript apporte au code et comment il vous fait réfléchir davantage sur la façon d’écrire votre code.

En progressant, je me suis posé une question : comment résoudre l’erreur de linting TypeScript lorsqu’on n’utilise pas un argument dans une méthode alors qu'il est obligatoire ?

Je suis rapidement tombé sur ce cas d’utilisation.

![Exemple de code non conforme à ESLint et TypeScript](images/code-example.png)

Dans le cas ci-dessus, je n’avais pas le choix. Le garde de navigation `beforeEnter` dans `vue-router` exige de fournir le second argument `from`, même si je ne l’utilise pas…

Comment ai-je résolu le problème ? C’est simple : prêtez attention à ce que ESLint vous indique. Parfois, il fournit une solution rapide.

Dans mon cas, il m’a suggéré de marquer l’argument non utilisé avec un underscore (\_\_\_) et voilà, ESLint est devenu heureux.
