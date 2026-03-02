---
title: "Fonctions d’ordre supérieur en JavaScript"
description: "En tant que développeur web, vous devez toujours vous efforcer d’apprendre de nouvelles techniques et de découvrir des moyens de travailler plus intelligemment avec JavaScript."
image: 2026-03-04-poupees-russe.jpg
imageAlt: Poupées russe
date: 2026-02-04
categories:
  - Développement Web
tags:
  - JavaScript
---

L’une des approches pour apprendre de nouvelles techniques et découvrir des moyens de travailler plus intelligemment avec JavaScript consiste à utiliser des fonctions d’ordre supérieur (_HOF_ pour _High Order Functions_ en anglais).

Dans cet article, nous verrons ce qu’est une fonction d’ordre supérieur, les avantages qu’elle présente et comment l’utiliser dans des applications pratiques.

## Qu’est-ce qu’une fonction d’ordre supérieur ?

Une fonction d’ordre supérieur est une fonction qui prend une ou plusieurs fonctions comme arguments, ou qui renvoie une fonction comme résultat.

Il existe plusieurs types de fonctions d’ordre supérieur, comme `map` et `reduce`. Nous les aborderons plus tard dans ce tutoriel. Mais avant cela, nous allons d’abord nous plonger dans ce que sont les fonctions d’ordre supérieur.

```javascript
// La fonction callback, passée en tant que paramètre dans la fonction d'ordre supérieur
function callbackFunction() {
  console.log("I am  a callback function");
}

function higherOrderFunction(func) {
  console.log("I am higher order function");
  func();
}

higherOrderFunction(callbackFunction);
```

Dans le code ci-dessus, `higherOrderFunction()` est une _HOF_ car nous lui passons une fonction de rappel en paramètre.

L’exemple ci-dessus est assez simple, n’est-ce pas ? Développons-le davantage et voyons comment vous pouvez utiliser les _HOF_ pour écrire un code plus concis et plus modulaire.

## Fonctionnement des fonctions d’ordre supérieur

Supposons que je veuille écrire une fonction qui calcule l’aire et le diamètre d’un cercle. En tant que débutant, la première solution qui nous vient à l’esprit est d’écrire chaque fonction séparément pour calculer la surface ou le diamètre.

```javascript
const radius = [1, 2, 3];
// fonction permettant de calculer l'aire du cercle
const calculateArea = function (radius) {
  const output = [];
  for (let i = 0; i < radius.length; i++) {
    output.push(Math.PI * radius[i] * radius[i]);
  }
  return output;
};
// fonction permettant de calculer le diamètre du cercle
const calculateDiameter = function (radius) {
  const output = [];
  for (let i = 0; i < radius.length; i++) {
    output.push(2 * radius[i]);
  }
  return output;
};

console.log(calculateArea(radius));
console.log(calculateDiameter(radius));
```

Mais avez-vous remarqué le problème que pose le code ci-dessus ? N’écrivons-nous pas presque la même fonction avec une logique légèrement différente ? De plus, les fonctions que nous avons écrites ne sont pas réutilisables, n’est-ce pas ?

Voyons donc comment nous pouvons écrire le même code en utilisant les *HOF* :

```javascript
const radius = [1, 2, 3];
// logique pour calculer la surface
const area = function (radius) {
  return Math.PI * radius * radius;
};
// logique de calcul du diamètre
const diameter = function (radius) {
  return 2 * radius;
};
// une fonction réutilisable pour calculer la surface, le diamètre, etc.
const calculate = function (radius, logic) {
  const output = [];
  for (let i = 0; i < radius.length; i++) {
    output.push(logic(radius[i]));
  }
  return output;
};
console.log(calculate(radius, area));
console.log(calculate(radius, diameter));
```

Comme vous pouvez le voir dans le code ci-dessus, nous n’avons écrit qu’une seule fonction, `calculate()`, pour calculer la surface et le diamètre du cercle. Il nous suffit d’écrire la logique et de la passer à `calculate()` pour que la fonction fasse le travail.

Le code que nous avons écrit à l’aide des _HOF_ est concis et modulaire. Chaque fonction fait son propre travail et nous ne répétons rien ici.

Supposons qu’à l’avenir, nous voulions écrire un programme pour calculer la circonférence du cercle. Nous pouvons simplement écrire la logique pour calculer la circonférence et la passer à la fonction `calculate()`.

```javascript
const circumeference = function (radius) {
  return 2 * Math.PI * radius;
};
console.log(calculate(radius, circumeference));
```

## Comment utiliser les fonctions d’ordre supérieur

Les fonctions d’ordre supérieur peuvent être utilisées de différentes manières.

Lorsque vous travaillez avec des tableaux, vous pouvez utiliser les fonctions `map()`, `reduce()`, `filter()` et `sort()` pour manipuler et transformer les données d’un tableau.

Lorsque vous travaillez avec des objets, vous pouvez utiliser la fonction `Object.entries()` pour créer un nouveau tableau à partir d’un objet.

Lorsque vous travaillez avec des fonctions, vous pouvez utiliser la fonction `compose()` pour créer des fonctions complexes à partir de fonctions plus simples.

### Exemples concrets

Voici un exemple complet de chacune de ces méthodes JavaScript :

```javascript
const products = [
  { name: "Laptop", price: 1200, inStock: true },
  { name: "Mouse", price: 25, inStock: false },
  { name: "Keyboard", price: 80, inStock: true },
  { name: "Monitor", price: 400, inStock: true },
];

// --- avec map(), filter(), reduce() ---

const discountedPrices = products
  // garde les produits en stock
  .filter((p) => p.inStock)
  // applique -10%
  .map((p) => ({ ...p, price: p.price * 0.9 }))
  // calcule le total
  .reduce((acc, p) => acc + p.price, 0);

console.log(discountedPrices); // 1512

// --- Object.entries() ---

const stats = { total: 4, inStock: 3, outOfStock: 1 };

const formattedStats = Object.entries(stats)
  .map(([key, value]) => `${key}: ${value}`)
  .join(" | ");

console.log(formattedStats);
// "total: 4 | inStock: 3 | outOfStock: 1"

// --- compose() ---

const compose =
  (...functions) =>
  (originalPrice) =>
    // On applique les fonctions fournies à `compose`
    // de droite à gauche pour être cohérent.
    // Pour utiliser `reduce` au lieu `reduceRight`,
    // il faut aussi inverser l'ordre des fonctions
    // fournies à `compose`,
    // e.g., `compose(addTax, round, formatEUR)`
    functions.reduceRight(
      (acc, nextFunction) => nextFunction(acc),
      originalPrice,
    );

const addTax = (price) => price * 1.2;
const round = (price) => Math.round(price);
const formatEUR = (price) => `${price} €`;

const finalPrice = compose(formatEUR, round, addTax);

console.log(finalPrice(80)); // "96 €"
```

## Conclusion

L’utilisation de fonctions d’ordre supérieur présente des avantages importants pour les développeurs web.

Tout d’abord, les fonctions d’ordre supérieur peuvent contribuer à améliorer la lisibilité de votre code en le rendant plus concis et plus facile à comprendre. Cela permet d’accélérer le processus de développement et de faciliter le débogage du code.

Toutefois, il faut comprendre leur fonctionnement. Passer une fonction à une autre peut avoir l’effet inverse en termes de lisibilité.

Deuxièmement, les fonctions d’ordre supérieur permettent d’organiser votre code en plus petits morceaux, ce qui facilite sa maintenance et son extension.

Je pense qu’il faut garder une approche équilibrée en se posant la question : est-ce que mon futur moi ou mes futurs collègues comprendront le code ?

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : cet article est une traduction partielle de [cet article](https://www.freecodecamp.org/news/higher-order-functions-in-javascript-explained/), écrit par [Sobit Prasad](https://www.freecodecamp.org/news/author/sobitprasad/) et originallement publié sur le blog de [Freecodecamp.org](https://www.freecodecamp.org/news/). [Cet exemple de code](#exemples-concrets) sur la fin est ma contribution.

Photo de _cottonbro studio_ sur _Pexels.com_ (`https://www.pexels.com/photo/2-blue-and-yellow-ceramic-owl-figurines-4966171/`).
