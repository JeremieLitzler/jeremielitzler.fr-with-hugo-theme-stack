---
title: "Equivalent de Find() and FindIndex() de JavaScript sur Python"
description: "Python n'est pas JavaScript. Cette fois-ci, je vais vous montrer, à l'aide d'exemples, comment programmer avec Python les fonctions équivalentes Find et FindIndex que l'on utilise sur JavaScript."
image: /images/2024-08-23-a-real-python.jpg
imageAlt: A real python
date: 2026-04-06
categories:
  - Développement web
tags:
  - Python
---

Aujourd’hui, on va se concentrer sur les méthodes équivalentes aux méthodes `find` et `findIndex` de JavaScript.

Les exemples que je propose traitent aussi bien des valeurs primitives que des objets.

## Équivalent Python de la méthode `find()` de JavaScript

En Python, vous pouvez utiliser la fonction `next()` avec une _expression générateur_ pour trouver le premier élément d’une liste qui satisfait une condition.

### Exemple avec des valeurs primitives pour l’équivalent de `find()`

```python
# Find the first odd number in the list
numbers = [2, 4, 6, 7, 8]
result = next(
    (x for x in numbers if x % 2 != 0), # iterator
    None # default value to return
)
print(result)  # Output: 7
```

Dans ce code, `None` est la **valeur par défaut** retournée par `next()`.

`next()` prend deux arguments :

1. Un itérateur (ici, une expression génératrice qui renvoie des nombres impairs)
2. Une valeur par défaut à renvoyer **si l’itérateur est épuisé** (c’est-à-dire s’il n’y a plus d’éléments correspondants)

Ainsi, si la liste ne contenait aucun nombre impair — par exemple `[2, 4, 6, 8]` —, au lieu de lever une exception `StopIteration`, `next()` renverrait simplement `None`, ou toute autre valeur que vous lui fourniriez.

Avec cette liste `[2, 4, 6, 7, 8]`, un nombre impair _est_ trouvé (7), donc `None` n’est jamais utilisé.

{{< blockcontainer jli-notice-warning "">}}

Si vous en oubliez, cela peut entraîner une exception `StopIteration`.

{{< /blockcontainer >}}

### Exemple d’objet équivalent à `find()`

```python
# Rechercher le premier objet ayant une valeur d'attribut spécifique
people = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}, {"name": “Charlie”, "age": 35}]
result = next((person for person in people if person["age"] > 30), None)
print(result)  # Résultat : {“name”: “Charlie”, “age”: 35}
```

Je tiens à mentionner quelques mises en garde importantes :

- La valeur par défaut `None` peut prêter à confusion. Si `None` est une valeur _légitime_ dans votre liste, vous ne pouvez pas distinguer « introuvable » de « `None` trouvé ». Une pratique courante consiste à utiliser une sentinelle :

  ```python
  _NOT_FOUND = object()
  result = next((p for p in people if p["age"] > 100), _NOT_FOUND)
  if result is _NOT_FOUND:
      print("Aucune correspondance")
  ```

- Les clés manquantes lèvent une exception `KeyError`. Si un `dict` de la liste ne contient pas la clé `"age"`, vous obtenez une erreur, et non un saut. Protégez-vous avec `.get()` :

  ```python
  result = next((p for p in people if p.get("age", 0) > 30), None)
  ```

- Seule la _première_ correspondance est renvoyée. C’est voulu, mais facile à oublier. Si vous avez besoin de toutes les correspondances, utilisez plutôt une compréhension de liste :

  ```python
  results = [p for p in people if p["age"] > 30]
  ```

## Équivalent Python de la fonction `findIndex` en JavaScript

Pour trouver l’index du premier élément répondant à une condition, utilisez `next()` avec `enumerate()`.

### Exemple simple d’équivalent de `findIndex()`

```python
# Trouver l'index du premier nombre impair de la liste
numbers = [2, 4, 6, 7, 8]
result = next(
    (
        i for i,
        x in enumerate(numbers) if x % 2 != 0
    ), -1)
print(result)  # Résultat : 3 (index de la valeur 7)
```

### Object Example for `findIndex()` Equivalent

```python
# Trouver l'index du premier objet ayant une valeur d'attribut spécifique
people = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}, {"name": "Charlie", "age": 35}]
result = next((i for i, person in enumerate(people) if person["age"] > 30), -1)
print(result)  # Output: 2
```

## Considérations relatives aux performances

### Efficacité des expressions génératrices

Les expressions génératrices (par exemple `(x for x in numbers if x % 2 != 0)`) sont économes en mémoire, car elles produisent des valeurs à la demande plutôt que de créer une nouvelle liste en mémoire, comme ce serait le cas avec les compréhensions de liste.

Cela s’avère particulièrement avantageux lors du traitement de grands ensembles de données.

Pour les ensembles de données de petite à moyenne taille, la différence de performances entre les expressions génératrices et d’autres méthodes (par exemple, les compréhensions de liste) peut être négligeable.

### Retourner une valeur le plus tôt possible

Les équivalents de `find` et `findIndex` cessent de parcourir la liste dès qu’une correspondance est trouvée.

Cela les rend efficaces pour trouver le premier élément correspondant, car ils ne traitent pas inutilement la liste entière.

### Complexité algorithmique

La complexité est de `O(n)` dans le pire des cas, où `n` est la longueur de la liste. Cela se produit lorsqu’aucune correspondance n’est trouvée, ce qui nécessite de parcourir l’intégralité de la liste.

### Profilage des goulots d’étranglement

Si les performances sont critiques, utilisez des outils de profilage tels que `cProfile` ou `perf` pour identifier les goulots d’étranglement.

### **Quand optimiser**

- N’optimisez que si le profilage indique que ces fonctions constituent un goulot d’étranglement.
- Pour les recherches ponctuelles ou les petits ensembles de données, privilégiez la lisibilité du code plutôt que les micro-optimisations.
- Utilisez des générateurs pour les grands ensembles de données où l’efficacité de la mémoire est critique.

## Autres mises en garde

En raison de la nature de Python, soyez prudent avec les objets mutables, comme les dictionnaires dans les listes, et assurez-vous que les modifications apportées à ces objets n’affectent pas de manière inattendue les itérations suivantes.

Si vous devez fréquemment rechercher des éléments ou des indices dans de grands ensembles de données, envisagez d’utiliser des structures de données plus avancées, telles que des dictionnaires ou des tables indexées, pour accélérer les recherches.

Par exemple,

- `set` a une complexité moyenne de `O(1)` car il effectue ses tests via des tables de hachage. Utilisez-le lorsque vous avez uniquement besoin de vérifier l’existence d’un élément, et non de stocker des valeurs associées.

- `dict` a également une recherche de clé moyenne de `O(1)`. Pourquoi ? Les `dict` Python sont classés par ordre d’insertion (depuis la version 3.7+) et hautement optimisés. Pour les recherches inversées (valeur→clé), maintenez un `dict` inversé.

- `collections.defaultdict` a la même recherche `O(1)` mais auto-initialise les clés manquantes. Il devient utile pour le regroupement/l’indexation : `defaultdict(list)` construit un index des éléments par une certaine clé en un seul passage.

- `sortedcontainers.SortedList` / `SortedDict` est un module tiers, mais c’est la référence absolue pour maintenir un ordre trié avec une complexité de `O(log n)` pour l’insertion, la suppression et la recherche. Il prend en charge le découpage, l’indexation et les requêtes par plage. Il est beaucoup plus ergonomique que l’utilisation manuelle de `bisect`, un autre module tiers.

Alors, comment choisir la bonne méthode ?

- Besoin de savoir « X est-il présent ? » Privilégiez `set`
- Besoin de connaître « la valeur de X ? » Privilégiez `dict`
- Besoin de savoir « quel est l’élément le plus proche de X ? » ou pour des requêtes sur une plage ? Privilégiez `SortedList`
- Besoin d’une recherche multi-attributs ? Privilégiez des index inversés avec `defaultdict`

Le gain le plus important consiste généralement à passer de `x in my_list` (O[n]) à `x in my_set` (O[1]). Effectuez un profilage avant de vous tourner vers des solutions plus sophistiquées.

Laissez-moi vous montrer avec un exemple avec `set` :

```python
import time

data = list(range(1_000_000))
lookup_targets = [999_999, 500_000, 42, -1]  # mélange de résultats trouvés et non trouvés

# Lent : O(n) par consultation
start = time.perf_counter()
for target in lookup_targets:
    _ = target in data
print(f"list: {time.perf_counter() - start:.4f}s")

# Rapide : coût de conversion unique de l'ordre de O(n), puis O(1) par consultation
data_set = set(data)

start = time.perf_counter()
for target in lookup_targets:
    _ = target in data_set
print(f"set:  {time.perf_counter() - start:.8f}s")
```

Sur mon ordinateur portable (Intel i3, 20 Go de RAM, disque SSD), j’ai obtenu le résultat suivant :

```plaintext
list: 0.0184s
set:  0.00000690s
```

Notez que la conversion `set` elle-même est de complexité `O(n)`, elle n’est donc rentable que lorsque vous effectuez plusieurs recherches sur les mêmes données. Si vous ne vérifiez qu’une seule fois, le balayage de la liste peut suffire.

Mais si vous vérifiez l’appartenance à l’intérieur d’une boucle, la différence est considérable :

```python
# anti-pattern
blacklist = ["spam", "scam", "phish", ...]  # 100 éléements

for msg in millions_of_messages:
    if msg.sender in blacklist:  # O(n) * millions = lent
        flag(msg)

# Correction : une ligne
blacklist = set(blacklist)
# Désormais, chaque vérification « in » est de complexité O(1)
```

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de Pixabay sur Pexels.
