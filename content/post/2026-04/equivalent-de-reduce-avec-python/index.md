---
title: "Equivalent de Reduce() avec Python"
description: "Python n’est pas JavaScript.  Cette fois-ci, je vais vous montrer, à l’aide d’un exemple, l’équivalent en Python de la fonction `reduce` de JavaScript."
image: /images/2024-08-23-a-real-python.jpg
imageAlt: A real python
date: 2026-04-13
categories:
  - Développement web
tags:
  - Python
---

Aujourd’hui, nous allons nous intéresser à l’équivalent de la fonction `reduce` en JavaScript.

Les exemples que je vous propose traitent à la fois des valeurs primitives et des objets.

## L’équivalent Python de la fonction `reduce()` en JavaScript

### Historique

En Python, la fonction `reduce` a une histoire particulière. **Guido van Rossum, créateur de Python, déconseille fortement l'utilisation de `reduce`** — elle a été retirée des fonctions intégrées de Python 3 (et déplacée vers le module `functools`). La préférence pythonesque préfère les boucles explicites ou aux compréhensions pour tout ce qui n'est pas trivial, car elles sont plus lisibles et souvent plus rapides.

Dans Python 2, `reduce` était une fonction intégrée : on pouvait l'utiliser directement comme `sum()` ou `len()`. Dans Python 3, Guido l'a intentionnellement déplacée vers `functools` pour décourager son utilisation occasionnelle, car il estimait que la plupart des appels à `reduce` étaient plus difficiles à lire que les alternatives.

Son argument : « Quand on lit un `reduce`, il faut simuler mentalement la boucle pour comprendre ce qu’il fait ». Comparez les syntaxes suivantes :

```python
# réduire — il faut suivre le raisonnement
result = reduce(lambda acc, x: acc if acc > x else x, numbers)

# intégré — l'intention est immédiatement claire
result = max(numbers)
```

Pour les cas où il n'existe pas d'équivalent intégré, avec une liste de `dict` par exemple :

```python
# reduce
result = reduce(lambda acc, o: {**acc, o["product"]: acc.get(o["product"], 0) + o["amount"]}, orders, {})

# boucle explicite — même logique, plus facile à suivre
result = {}
for o in orders:
    result[o["product"]] = result.get(o["product"], 0) + o["amount"]
```

La version avec boucle est plus longue à écrire, mais on peut la lire de haut en bas sans avoir à faire de contorsions mentales. Elle est également plus rapide (pas de surcoût lié à l'appel de fonction à chaque itération, pas de copie du `dict`).

Ainsi, `reduce` n’est ni obsolète, ni « mauvais » — il ne s’agit simplement pas d’un usage idiomatique de Python, contrairement à ce qu’il est en JS. Utilisez-le pour des réductions simples et évidentes (comme le chaînage d’opérations). Pour tout ce qui rend le lambda complexe, une boucle ou une compréhension est préférable dans la culture Python.

### L'équivalent en Python 3

Avec des primitives :

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Sum with initial value
total = reduce(lambda acc, x: acc + x, numbers, 0)  # 15

# JS equivalent: [1,2,3,4,5].reduce((acc, x) => acc + x, 0)
```

Avec des objects :

```python
orders = [
    {"product": "A", "amount": 50},
    {"product": "B", "amount": 30},
    {"product": "A", "amount": 20},
]

# Regrouper et calculer la somme par produit
result = reduce(
    lambda acc, o: {**acc, o["product"]: acc.get(o["product"], 0) + o["amount"]},
    orders,
    {}
)
# {'A': 70, 'B': 30}
```

### Performance considerations

Tout d'abord, notez que `{**acc, ...}` crée un nouveau `dict` à chaque itération, ce qui entraîne une complexité de `O(n²)` pour les grandes collections. Modifier l'accumulateur est plus rapide, mais moins « fonctionnel » :

```python
def merge(acc, o):
    acc[o["product"]] = acc.get(o["product"], 0) + o["amount"]
    return acc

result = reduce(merge, orders, {})  # O(n)
```

Ensuite, pour les opérations de réduction sur des données numériques, **les fonctions intégrées telles que `sum()`, `min()`, `max()` et `math.prod()` sont plus rapides** que `reduce` — elles sont implémentées en C.

Enfin, `reduce` ne dispose **d’aucun mécanisme de court-circuit**. Il traitera toujours chaque élément. Si vous avez besoin d’une interruption prématurée, utilisez une boucle.

## Quelques points à garder à l’esprit

Lorsque vous traitez un **itérable vide** et que vous n'avez **aucune valeur initiale**, vous obtiendrez une erreur `TypeError`. Par mesure de sécurité, passez toujours une valeur initiale (le troisième argument).

Contrairement à JS, **`reduce` ne fournit ni l'index ni le tableau d'origine** à la fonction de rappel. Si vous en avez besoin, utilisez plutôt `enumerate` à l'intérieur d'une boucle.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de Pixabay sur Pexels.
