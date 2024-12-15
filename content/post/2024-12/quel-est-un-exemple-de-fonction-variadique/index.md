---
title: "Un exemple de fonction variadique ?"
description: "La fonction variadique permettent de passer un nombre variable d'arguments à une méthode."
image: 2024-12-02-exemple-de-code-pour-une-fonction-variadique.jpg
imageAlt: Exemple de code pour une fonction variadique
date: 2024-12-13
categories:
  - Développement Web
---

Ce mot-clé est utilisé avant le type de paramètre dans la signature de la méthode. Voici un exemple illustrant le fonctionnement des paramètres variables en C# :

## Exemple de fonction variadique en C#

```csharp
using System;

public class VariadicExample
{
    // Méthode acceptant un nombre variable de paramètres entiers
    public static int Sum(params int[] numbers)
    {
        int total = 0;
        foreach (int number in numbers)
        {
            total += number;
        }
        return total;
    }

    public static void Main(string[] args)
    {
        // Appel de la méthode avec différents nombres de paramètres
        Console.WriteLine(Sum(1, 2, 3));       // Retourne : 6
        Console.WriteLine(Sum(1, 2, 3, 4, 5)); // Retourne : 15
        Console.WriteLine(Sum(10, 20));        // Retourne : 30
        Console.WriteLine(Sum());              // Retourne : 0
    }
}
```

## Explication

Nous commençons par la **Déclaration de méthode** :

```csharp
public static int Sum(params int[] numbers)
```

Le mot-clé `params` permet à la méthode d’accepter un nombre variable d’arguments entiers. Ces arguments sont traités comme un tableau dans la méthode.

Ensuite, nous utilisons le paramètre comme ceci :

```csharp
int total = 0;
foreach (int number in numbers)
{
    total += number;
}
return total;

```

La méthode itère à travers le tableau `numbers`, en additionnant toutes les valeurs.

Prenons des exemples d’utilisation :

```csharp
  Console.WriteLine(Sum(1, 2, 3));
  Console.WriteLine(Sum(1, 2, 3, 4, 5));
  Console.WriteLine(Sum(10, 20));
  Console.WriteLine(Sum());
```

La méthode `Sum` est appelée avec différents nombres d’arguments. Le mot-clé `params` permet à la méthode de gérer ces appels avec élégance.

## Vérification du type

Naturellement, les paramètres doivent tous correspondre au type du paramètre de la fonction variable. Du moins, en C#, c’est le cas.

Cependant, ce n’est pas vrai pour tous les langages : par exemple, si vous utilisez du JavaScript, vous pouvez utiliser des paramètres variadiques à travers l’opérateur _spread_ (`...numbers`) si vous utilisez du JavaScript moderne.

```javascript
function sumOfNumbers(...numbers) {
  return numbers.reduce((total, current) => total + current, 0);
}

console.log(sumOfNumbers(1, 2, 3, 4)); // Output: 10
```

Elle remplace l’utilisation de la variable implicite `arguments`.

Par conséquent, si vous aviez le code suivant :

```javascript
function SumOfNum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log("Sum is ", SumOfNum(1, 2, 3, "4"));
```

Vous obtiendrez le résultat suivant :

```plaintext
Résultat de la somme : 64
```

Pour résoudre ce problème (à moins que vous n’ayez vraiment besoin de ce comportement), l’utilisation du typage statique de TypeScript apporte la force de C# :

```ts
function sumNumbers(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// TypeScript génère une erreur de compilation.
console.log("Sum is ", SumOfNum(1, 2, 3, "4"));
```

## Pourquoi utiliser une fonction variadique

Elle simplifie la signature de la méthode. Elle rend le code plus flexible et plus facile à maintenir et permet d'éviter la prolifération de la signature de la méthode pour un différent nombre de paramètres.

L’avez-vous déjà utilisé ? Peut-être trouverez-vous aujourd’hui un code dans lequel vous pourrez appliquer cette méthode de programmation.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
