---
title: "Différences entre les types de variables en JavaScript"
description: "La compréhension du concept suivant vous évitera bien des maux de tête et est considérée comme la clé d'un développement réussi."
image: images/2024-03-06-list-of-variable-types.png
imageAlt: "Liste des types de variable"
date: 2024-03-06
categories:
  - Développement Web
tags:
  - Astuce du jour
---

Je prendrai l’exemple du langage de programmation JavaScript dans cet article, mais il en va de même dans de nombreux langages de programmation, comme C#.

Fondamentalement, il existe deux familles de types de variables : les primitives et les objets.

Dans chacune d’entre elles, on trouve les types bien connus énumérés dans l’image du haut.

Ce qu’il est important de comprendre, c’est que vous pouvez copier des primitives **par valeur** ou des objets **par référence**.

## Types de valeur

Par exemple :

```javascript
const greeting = "Bonjour";
let newGreeting = gretting;

newGreeting = "Bonjour";
```

L’affectation `newGreeting = "Bonjour" ;` ne change pas la valeur de la variable `gretting`.

Les types de valeur stockent la valeur réelle en mémoire. Et le code ci-dessus montre qu’une copie distincte de la valeur `gretting` est créée pour initialiser `newGreeting`.

**Vous n’avez aucun lien entre les deux variables.**

## Types de référence

Lorsque vous créez un objet, il est stocké en mémoire et le JavaScript utilise une référence ou _son adresse en mémoire_ pour trouver la valeur.

Cette référence est utilisée pour manipuler l’objet.

Par exemple :

```javascript
const greeting = { message: "Hello" };
let newGreeting = gretting;
newGreeting.message = "Bonjour";
```

L’affectation `newGreeting.message = "Bonjour" ;` change la valeur de la propriété, `gretting.message` car les deux **variables partagent la même référence en mémoire** !

Pour éviter cela, vous devez créer une vraie copie de `greeting`.

Cela peut être facilement réalisé avec l’opérateur `spread` (pour un objet _plat_ uniquement, les objets imbriqués nécessitent plus de code…) :

```javascript
const greeting = { message: "Hello" };
let newGreeting = { ...greeting };
newGreeting.message = "Bonjour";
```

Avec `{...greeting}`, nous assignons un nouvel objet et le moteur JavaScript crée donc une nouvelle référence pour stocker `newGreeting`.

Par conséquent, `newGreeting.message = 'Bonjour';` n’affectera pas la valeur de `greeting.message`.
