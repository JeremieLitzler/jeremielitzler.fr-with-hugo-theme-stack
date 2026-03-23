---
title: "Fonction Filter() avec Python"
description: "Python n'est pas JavaScript. Je vais vous le montrer à l'aide d'exemples illustrant la fonction `filter` en Python."
image: /images/2024-08-23-a-real-python.jpg
imageAlt: A real python
date: 2026-04-03
categories:
  - Web Development
tags:
  - Python
---

La semaine dernière, nous avons lancé une nouvelle série consacrée aux fonctions, telles que [`map()`](../../2026-03/fonction-map-avec-python/index.md), qui permettent de manipuler des tableaux ou des listes en Python.

Aujourd’hui, nous allons nous intéresser à la fonction `filter()` à travers quelques exemples.

## Aide-mémoire sur la fonction `filter()` en Python

La fonction `filter()` en Python crée un itérateur à partir des éléments d’un itérable pour lesquels une fonction renvoie vrai. Elle est équivalente à la méthode `array.filter()` de JavaScript.

## Syntaxe de base

```python
filter(function, iterable)
```

La fonction prend deux paramètres :

- `function` : une fonction, souvent appelée `lambda`, qui vérifie si les éléments d’un itérable renvoient vrai ou faux
- `iterable` : l’itérable à filtrer

## Filtrage des valeurs primitives

### Filtrage sur des nombres

```python
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # Résultat : [2, 4, 6]
```

Vous pouvez également utiliser une fonction nommée à la place de la lambda pour plus de clarté :

```python
def is_even(num):
    return num % 2 == 0

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
nombres_pairs = list(filter(is_even, nombres))
print(nombres_pairs)  # Résultat : [2, 4, 6, 8]
```

### Filtrage de chaînes de caractères

```python
texte = "HeLLo ReadER!"
lettres_majuscules = list(filter(lambda lettre: lettre.isupper(), texte))
print(capital_letters)  # Résultat : [“H”, “L”, “L”, “R”, “E”, “R”]
```

Les chaînes de caractères sont itérables en Python, donc `filter()` (tout comme `map()`, les boucles `for`, etc.) les parcourt automatiquement, caractère par caractère.

Le code :

1. `filter()` parcourt chaque caractère de `« HeLLo ReadER! »` un par un
2. La fonction lambda ne conserve que les caractères pour lesquels `.isupper()` renvoie `True`
3. `list()` rassemble les résultats → `[“H”, “L”, “L”, “R”, “E”, “R”]`

Aucun découpage explicite n’est nécessaire !

### Filtrer les valeurs fausses

Partons de cet exemple :

```python
mixed_values = [0, 1, [], 4, 5, « », None, 8]
truthy_values = list(filter(None, mixed_values))
print(truthy_values)  # Résultat : [1, 4, 5, 8]
```

Lorsque vous passez `None` comme fonction de filtrage, Python utilise la valeur de vérité propre à chaque élément pour décider s’il doit le conserver.

Cela équivaut donc à :

```python
filter(lambda x: bool(x), mixed_values)
```

Les valeurs fausses qui sont supprimées :

- `0` est faux
- `[]` est une liste vide, donc faux
- `« »` est une chaîne vide, donc faux
- `None` est faux

Les autres (`1, 4, 5, 8`) sont vraies, nous les conservons donc.

Enfin, `filter(None, iterable)` est essentiellement un moyen rapide de supprimer toutes les valeurs fausses d'une liste.

## Filtrage sur des objets

### Filtrage de dictionnaires

```python
grades = {"stu1": "A", "stu2": "B", "stu3": "A", "stu4": "C"}

def has_a_grade(pair):
    key, value = pair # Destructuration de pair en deux variables
    return value == "A"

a_students = dict(filter(has_a_grade, grades.items()))
print(a_students)  # Sortie : {"stu1": "A", "stu3": "A"}
```

`grades.items()` renvoie les paires clé-valeur sous forme de tuples : `[('stu1', 'A'), ('stu2', 'B'), ...]`

`filter()` transmet chaque tuple à `has_a_grade`, qui :

1. Déstructure le tuple en `clé, valeur` — par exemple, `("stu1", "A")` devient `clé="stu1"` et `valeur="A"`
2. Renvoie `True` uniquement si `valeur == "A"`

L’élément clé à retenir est le `grades.items()` — sans cela, vous ne feriez que parcourir les clés. C’est `.items()` qui vous fournit les paires permettant de filtrer sur les valeurs.

### Filtrage de la liste des dictionnaires

Dans ce qui suit, les résultats filtrés sont des **objets entiers**, et non pas seulement des clés ou des valeurs — vous obtenez ainsi toutes les informations sur la créature, et pas seulement le champ correspondant.

```python
creatures = [
    {"name": "sammy", "species": "shark", "tank": 11, "type": "fish"},
    {"name": "ashley", "species": "crab", "tank": 25, "type": "shellfish"},
    {"name": "jo", "species": "guppy", "tank": 18, "type": "fish"},
    {"name": "jackie", "species": "lobster", "tank": 21, "type": "shellfish"},
    {"name": "charlie", "species": "clownfish", "tank": 12, "type": "fish"}
]

# Filtrer pour ne trouver que des poissons
fish_only = list(filter(lambda x: x["type"] == "fish", creatures))
print(fish_only)
# Résultat : [{"name": "sammy", "species": "shark", "tank": 11, "type": "fish"},
#          {"name": "jo", "species": "guppy", "tank": 18, "type": "fish"},
#          {"name": "charlie", "species": "clownfish", "tank": 12, "type": "fish"}]
```

### Filtrage plus complexe à l’aide d’une fonction personnalisée

```python
def filter_by_search(creatures, search_string):
    def iterator_func(creature):
        for value in creature.values():
            if str(search_string) in str(value):
                return True
        return False
    return filter(iterator_func, creatures)

# Trouver les créatures dont une valeur quelconque contient « 1 »
results = list(filter_by_search(creatures, '1'))
print(results)
# Le résultat inclura les créatures dont un champ quelconque contient « 1 »
```

N’oubliez pas que `filter()` renvoie un itérateur ; vous devez donc le convertir en liste, en tuple ou en un autre type de collection pour afficher tous les résultats en une seule fois.

La principale différence réside dans le fait que la fonction `filter` effectue désormais une recherche **sur l’ensemble des valeurs** de chaque dictionnaire, et non plus uniquement sur un champ spécifique.

`iterator_func` parcourt toutes les valeurs d’un dictionnaire de créatures (`name, species, tank, type`) et renvoie `True` dès qu’il trouve une correspondance, interrompant ainsi le reste du traitement.

Si l'on recherche `1`, les résultats seraient :

- `sammy` de l’aquarium `11`
- `jo` de l'aquarium `18`, car `'1'` existe dans `'18'`)
- `jackie` de l’aquarium `21`, car (`'1'` existe dans `'21'`)
- `charlie` de l’aquarium `12`, car (`'1'` existe dans `'12'`)

`str(value)` est le détail important : cela convertit les entiers (comme les numéros de réservoir) en chaînes de caractères afin que la comparaison `in` s’applique de manière uniforme à tous les éléments.

Contrairement à l’exemple précédent, qui était `x["type"] == "fish"` (correspondance exacte sur un seul champ), il s’agit ici d’une **recherche partielle de chaîne sur tous les champs** — bien plus flexible, à l’instar d’une barre de recherche.

## Considérations relatives aux performances

L’utilisation de la fonction `filter()` de Python, tout comme `map()`, soulève plusieurs considérations relatives aux performances.

### Avantages en termes d’efficacité

La fonction `filter()` offre certains avantages en termes de performances :

- Elle est implémentée en C et hautement optimisée, ce qui rend sa boucle interne potentiellement plus efficace que les boucles Python classiques en termes de temps d’exécution [^2].
- Elle renvoie un itérateur qui fournit des valeurs à la demande, favorisant ainsi l’évaluation paresseuse, ce qui est plus efficace en termes de mémoire que de créer de nouvelles collections entières en une seule fois. Cela est particulièrement avantageux lorsque l’on travaille avec des ensembles de données volumineux, car cela ne crée pas de nouvelle liste en mémoire, mais conserve plutôt une référence à l’itérable d’origine, à la fonction et à un index [^1].

### Comparaison des performances avec les générateurs

Des benchmarks récents suggèrent que les expressions de générateur pourraient être plus performantes que `filter()`, mais je n’ai pas pu vérifier les sources.

## Précautions à prendre lors de l’utilisation de `filter()`

Lorsque vous utilisez `filter()`, gardez à l’esprit les mises en garde suivantes :

- La fonction `filter()` renvoie un itérateur, et non une liste. Vous devez le convertir en liste, en tuple ou en un autre type de collection pour voir tous les résultats en une seule fois. Cela entraînera une baisse de performances, car vous devrez parcourir l’itérateur une fois, puis probablement une deuxième fois pour la liste dans laquelle il est utilisé.

  ```python
  # Recommander une syntaxe pour convertir un itérateur filter() en liste
  numbers = [1, 2, 3, 4, 5, 6]
  even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
  ```

- Tout comme `map()`, l’itérateur renvoyé est épuisé dès que vous le parcourez. Si vous avez besoin d’utiliser les résultats filtrés à plusieurs reprises, convertissez-les d’abord en liste.

- Sous Python 2, `filter()` renvoyait une liste, mais sous Python 3, il renvoie un itérateur, ce qui peut entraîner des problèmes de compatibilité dans les anciens codes [^2].

- Pour les opérations de filtrage complexes, définir une fonction classique peut s’avérer plus lisible que d’utiliser des fonctions lambda avec `filter()` [^1].

Pour des performances optimales, choisissez entre `filter()` et les expressions de générateur en fonction de votre cas d’utilisation spécifique et de la version de Python, les expressions de générateur pouvant constituer le meilleur choix dans les versions récentes de Python.

Nous aborderons les générateurs dans un prochain article.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de Pixabay sur Pexels.

[^1]: [https://www.digitalocean.com/community/tutorials/how-to-use-the-python-filter-function](https://www.digitalocean.com/community/tutorials/how-to-use-the-python-filter-function)

[^2]: [https://realpython.com/python-filter-function/](https://realpython.com/python-filter-function/)
