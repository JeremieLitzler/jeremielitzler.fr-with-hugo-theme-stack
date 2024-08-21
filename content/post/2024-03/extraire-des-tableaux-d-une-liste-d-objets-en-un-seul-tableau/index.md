---
title: "Extraire des tableaux d'une liste d'objets en un seul tableau"
description: "Avez-vous déjà eu besoin de mettre les tableaux d'une liste d'objets dans un seul tableau ? JavaScript fournit une API native pour le faire et c'est simple."
image: images/2024-03-13-shoes-sorted-into-trays.jpg
imageAlt: "Chaussures triées dans des cases"
date: 2024-03-13
categories:
  - Développement Web
tags:
  - JavaScript
  - Astuce du jour
---

C'est simple : utilisez la méthode `Array.prototype.flatMap()` en même temps que la décomposition de l'objet.

Par exemple, vous avez ce tableau d'objets. Chaque objet contient un tableau de valeurs primitives :

```json
"categories": [
    {
      "forums": [
        "-KpOx5Y4AqRr3sB4Ybwj",
        "-KsjO4_W3W9Q2Z2UmuPr"
      ],
      "name": "Feedback & Information",
      "slug": "feedback-and-information",
      "id": "-KpR7vRkiRPpbUd_TVAR"
    },
    {
      "forums": [
        "-KsjPat5MWCx-dkjNVg8",
        "-KsjPjasLh0TFtZmffEo",
        "-Kvd1Vg_ankLYgrxC50F",
        "-KvdCowY9mDvM0EH8Pvs",
        "-KvhkEl6F673igPtnbso"
      ],
      "name": "Discussions",
      "slug": "discussions",
      "id": "-KsjPKA6hDuHlQK_lJWO"
    },
    {
      "forums": [
        "-Kvclvu_Qd9QdS9ciqUl",
        "-KvcmOcppNYK8NCesmB9"
      ],
      "name": "Comedy",
      "slug": "comedy",
      "id": "-KvclpNRjpI5W-j0JQGU"
    }
  ],
```

Si vous voulez obtenir les valeurs de `forums`, l'utilisation de la décomposition d'objets et de `flatMap` vous fournira la solution :

```tsx
const forums = categories.flatMap(({ forums }) => forums);
```

Le résultat vous donnera :

```json
[
  "-KpOx5Y4AqRr3sB4Ybwj",
  "-KsjO4_W3W9Q2Z2UmuPr",
  "-KsjPat5MWCx-dkjNVg8",
  "-KsjPjasLh0TFtZmffEo",
  "-Kvd1Vg_ankLYgrxC50F",
  "-KvdCowY9mDvM0EH8Pvs",
  "-KvhkEl6F673igPtnbso",
  "-Kvclvu_Qd9QdS9ciqUl",
  "-KvcmOcppNYK8NCesmB9"
]
```

[Consultez la démo JSFiddle](https://jsfiddle.net/puzzlout/98w7h4xL/) pour vous en convaincre.

Bonne lecture !

Crédit : Photo par Alev Takil sur [Unsplash](https://unsplash.com/photos/assorted-color-sneakers-d-1FY75fh_s?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
