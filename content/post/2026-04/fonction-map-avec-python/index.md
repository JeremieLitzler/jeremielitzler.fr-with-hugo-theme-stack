---
title: "Fonction Map() avec Python"
description: "Python n'est pas JavaScript. Je vais vous le montrer à l'aide d'exemples illustrant la fonction `map` en Python."
image: /images/2024-08-23-a-real-python.jpg
imageAlt: Un vrai python
date: 2026-04-02
categories:
  - Développement web
tags:
  - Python
---

L’année dernière, j’ai obtenu ma certification JavaScript de niveau intermédiaire et, en parallèle, j’ai travaillé sur un projet en Python.

À un moment donné, j’ai eu besoin de filtrer une liste et je me suis rendu compte que je ne maîtrisais pas aussi bien la gestion des listes en Python qu’en JavaScript.

Voici donc le premier volet d’une série d’articles consacrés aux méthodes de gestion des listes en Python, en commençant par la fonction `map()`.

## La fonction `map()` en Python

La fonction `map()` en Python applique une fonction donnée, ou `lambda`, à chaque élément d’un itérable (par exemple, une liste) et renvoie un objet map (itérateur).

La syntaxe est la suivante : `map(function, iterable)`

## Exemple avec des types primitifs

Commençons par un exemple simple avec un tableau de types primitifs :

```python
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # Résultat : [1, 4, 9, 16, 25]

# Utilisation de map() avec une fonction définie
def cube(x):
    return x**3

cubed = list(map(cube, numbers))
print(cubed)  # Résultat : [1, 8, 27, 64, 125]
```

## Exemple d’objets

Avec les objets, la logique n’est pas beaucoup plus complexe :

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

people = [
    Person("Alice", 30),
    Person("Bob", 25),
    Person("Charlie", 35)
]

# Extraire les noms à l'aide de la fonction map()
names = list(map(lambda p: p.name, people))
print(names)  # Résultat : ['Alice', 'Bob', 'Charlie']

# Augmenter l'âge d'un an à l'aide de la fonction map()
def increase_age(person):
    person.age += 1
    return person

updated_people = list(map(increase_age, people))
for person in updated_people:
    print(f"{person.name}: {person.age}")
# Résultat :
# Alice: 31
# Bob: 26
# Charlie: 36
```

## À propos des performances

Notez qu’en Python, il est souvent nécessaire de convertir l’objet `map` en liste (ou en un autre type de séquence) pour consulter les résultats immédiatement.

Si vous n’avez pas besoin de tous les résultats en une seule fois, vous pouvez parcourir directement l’itérateur retourné par `map`, ce qui s’avère plus économe en mémoire pour les grands jeux de données.

### Démonstration par un exemple

Lorsque vous utilisez `map()` en Python, la fonction **renvoie un itérateur**, et non une liste. Il s’agit là d’une différence majeure par rapport à la fonction `map()` de JavaScript, qui renvoie immédiatement un nouveau tableau.

```python
numbers = range(1, 1000000)  # Une large gamme de chiffres
squared_map = map(lambda x: x**2, numbers)

# Traiter les éléments un par un sans stocker l'intégralité du résultat en mémoire
for squared in squared_map:
    if squared % 1000000 == 0:
        print(f"Found milestone: {squared}")
```

Dans cet exemple, une seule valeur au carré est présente en mémoire à un moment donné, et non pas l’ensemble du million de valeurs.

Ce qui suit finirait par solliciter fortement la mémoire, car on chargerait le million de valeurs en mémoire :

```python
numbers = range(1, 1000000)

# Consumme beaucoup de mémoire
squared_list = list(map(lambda x: x**2, numbers))
```

### Exemples d’utilisation concrète

```python
# Traitement d'un fichier volumineux ligne par ligne
with open("large_file.txt", "r") as file:
    # Appliquer une transformation sans charger l'intégralité du fichier en mémoire
    processed_lines = map(lambda line: line.strip().upper(), file)

    for line in processed_lines:
        # Traiter chaque ligne individuellement
        # Afficher les 10 premiers caractères de chaque ligne
        print(line[:10])
```

## Considérations importantes

Vous devez comprendre quelques aspects importants de la fonction `map()` :

1. Les objets `map` sont des itérateurs à usage unique. C’est normal. C’est le comportement attendu en Python : `map()` renvoie un itérateur _paresseux_ (« lazy » en anglais) qui est traversé après un seul parcours complet. La deuxième boucle ne produit aucune sortie, **sans toutefois renvoyer de message d’erreur**.

   ```python
   numbers = [1, 2, 3, 4, 5]
   squared_map = map(lambda x: x**2, numbers)

   for num in squared_map:
       print(num)  # Affiche 1, 4, 9, 16, 25

   # L'itérateur est désormais traversé
   for num in squared_map:
       print(num)  # Rien ne s'affiche
   ```

2. Vous pouvez combiner `map` avec d’autres itérateurs pour un traitement efficace des données :

   ```python
   from itertools import islice

   numbers = range(10000000)  # Très grande plage de chiffres
   squared_map = map(lambda x: x**2, numbers)

   # Récupérer uniquement les 5 premiers résultats sans traiter tous les éléments
   first_five = list(islice(squared_map, 5))
   print(first_five)  # Résultat : [0, 1, 4, 9, 16]
   ```

   Cette approche d’évaluation _paresseuse_ est particulièrement utile lorsque l’on travaille avec des ensembles de données trop volumineux pour tenir en mémoire, car elle permet de traiter les données en continu.

## Références de documentation

Vous souhaitez aller plus loin ? Voici quelques articles de documentation à conserver comme référence (ils sont en anglais) :

1. [https://www.w3schools.com/python/ref_func_map.asp](https://www.w3schools.com/python/ref_func_map.asp)
2. [https://www.digitalocean.com/community/tutorials/python-map-function](https://www.digitalocean.com/community/tutorials/python-map-function)
3. [https://docs.python.org/3/library/functions.html](https://docs.python.org/3/library/functions.html)
4. [https://www.freecodecamp.org/news/python-map-explained-with-examples/](https://www.freecodecamp.org/news/python-map-explained-with-examples/)

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit: Photo de Pixabay sur Pexels.
