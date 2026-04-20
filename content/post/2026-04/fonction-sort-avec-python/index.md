---
title: "Fonction Sort() en Python"
description: "Python n'est pas JavaScript. Je vais vous montrer, à l'aide d'un exemple, l'usage en Python de la fonction `sort` et les différences avec JavaScript."
image: /images/2024-08-23-a-real-python.jpg
imageAlt: A real python
date: 2026-04-15
categories:
  - Développement web
tags:
  - Python
---

Aujourd’hui, nous allons nous intéresser à l’équivalent de la fonction `sort` en JavaScript.

Les exemples que je vous propose traitent à la fois les valeurs primitives et les objets.

## Équivalent Python de la fonction `sort()` en JavaScript

Les équivalents en Python sont `list.sort()` (modifie la liste en mémoire) et `sorted()` (renvoie une nouvelle liste).

## Tri des valeurs numériques primitives

Contrairement au JavaScript (qui trie par défaut comme des chaînes de caractères, chaque élément d’une liste — `[1, 2, 10].sort()` devient `[1, 10, 2]`), Python trie numériquement par défaut.

```python
nums = [3, 1, 4, 1, 5, 10, 2, 6]

# modifie l'original
nums.sort()
# résultat : [1, 1, 2, 3, 4, 5, 6, 10]

# renvoie une nouvelle liste, la liste d'origine reste inchangée
sorted(nums)
# décroissant
sorted(nums, reverse=True)
```

## Chaîne de caractères

### Comportement par défaut

Python trie les chaînes de caractères en fonction de leur code Unicode, ce qui donne des résultats surprenants :

```python
words = ["banana", "Apple", "cherry", "apple"]
sorted(words)
# ['Apple', 'apple', 'banana', 'cherry']
```

Dans la table Unicode, toutes les lettres majuscules précèdent toutes les lettres minuscules (A-Z = 65-90, a-z = 97-122). Du coup, l’ordre obtenu est logique.

Avec des chaînes contenant des caractères accentués et un tri par défaut (c’est-à-dire sans deuxième argument), on obtient le résultat suivant :

```python
fruits = ["éclair", "apple", "banana", "zebra"]
sorted(fruits)
# ['apple', 'banana', 'zebra', 'éclair']
```

Le « é » (qui correspond à `U+00E9 = 233` dans la table Unicode) est classé **APRÈS** le « z » (qui correspond à 122 dans la table Unicode), ce qui fait que les caractères accentués se retrouvent à la fin.

### Insensibilité à la casse

Pour résoudre les exemples précédents afin d’obtenir un résultat plus cohérent à ce qu’on s’attendrait, nous devons fournir un deuxième paramètre à `sorted`.

Avec des majuscules :

```python
sorted(words, key=str.lower)
# ['Apple', 'apple', 'banana', 'cherry']
```

Vous vous demandez peut-être : pourquoi `Apple` reste en première position dans la liste d’origine `['banana', 'Apple', 'cherry', 'apple']`? `key=str.lower` transforme les mots en `['banana', 'apple', 'cherry', 'apple']`, le tri ne modifie pas l’ordre des mots contenant « pomme ».

Si vous aviez `['banana', 'apple', 'cherry', 'Apple']`, le mot « apple » en minuscules viendrait en premier.

Si vous souhaitez trier en priorité les valeurs en minuscules en cas d’égalité, vous devez ajouter une clé secondaire qui tranche en faveur des minuscules :

```python
words = ["banana", "Apple", "cherry", "apple"]

print(sorted(words, key=lambda s: (s.lower(), s.swapcase())))
# ['apple', 'Apple', 'banana', 'cherry']
```

Comment le `swapcase` fonctionne-t-il ?

- Avec « apple », la clé est `key ("apple", "APPLE")`
- Avec « Apple », la clé est `key ("apple", "aPPLE")`

En cas d’égalité entre les clés primaires, Python compare la valeur secondaire de la clé : `"APPLE" < "aPPLE"`, car `'A' (65) < 'a' (97)"`. Ainsi, `apple` remporte la bataille.

Une approche plus explicite, mais moins souple, serait la suivante :

```python
sorted(words, key=lambda s: (s.lower(), not s.islower()))
# ('apple', False) < ('apple', True)  → lowercase wins
```

L’approche est plus claire, mais elle ne fait la distinction qu’entre « tout en minuscules » et « pas tout en minuscules ». La version qui inverse la casse gère de manière cohérente les cas de casse mixte arbitraires (par exemple, « aPpLe » par opposition à « ApPlE »).

Qu’en est-il des lettres spéciales que l’on trouve en allemand, en grec ou en turc, pour n’en citer que quelques-unes ?

```python
sorted(words, key=str.casefold)
```

`str.casefold` prend mieux en charge l’Unicode complet (prend en charge le ß, le sigma grec, le « i » turc ponctué, etc.)

La fonction `casefold()` est plus stricte que `lower()` — elle a été spécialement conçue pour permettre des comparaisons sans distinction de casse entre les scripts.

### Prise en compte des accents (paramètres régionaux)

Aucune des astuces ci-dessus ne tient compte des paramètres régionaux — la comparaison en cas d’égalité reste une simple comparaison de points de code. Si vous devez également gérer les accents, combinez cette méthode avec la normalisation :

```python
import locale
locale.setlocale(locale.LC_COLLATE, "fr_FR.UTF-8")

fruits = ["éclair", "apple", "banana", "zebra", "Être"]
sorted(fruits, key=locale.strxfrm)
# ['apple', 'banana', 'éclair', 'Être', 'zebra']
```

Le caractère `é` est désormais classé à côté du `e`, comme s’y attend un francophone.

### Prise en charge des accents (sans dépendance vis-à-vis des paramètres régionaux)

Les paramètres régionaux sont globaux au niveau du processus et dépendent de ce qui est installé sur le système d’exploitation. Cela peut poser problème sur les serveurs ou dans les conteneurs.

L’approche via `pyuco` ou la bibliothèque standard `unicodedata` est plus portable :

```python
import unicodedata

def strip_accents(s):
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()

sorted(fruits, key=lambda s: (strip_accents(s).lower(), s))
# Output = ["éclair", "apple", "banana", "zebra", "Être"]
```

Les règles ci-dessus déterminent le classement principal, tout en conservant les valeurs d’origine pour les cas de départage.

Pour une prise en charge correcte de l’algorithme de classement Unicode (UCA), utilisez la bibliothèque `pyuca` (`pip install pyuca`). Elle met en œuvre la norme Unicode actuelle.

### Résumé concernant les listes de chaînes

- Le tri par point de code n’est pas alphabétique. Par exemple : « Z » < « a » < « é ». Ce n’est presque jamais ce que les utilisateurs souhaitent pour l’affichage.
- `locale.setlocale` est une variable globale au niveau du processus et n’est pas _thread-safe_ — sa configuration affecte l’ensemble du programme. Il faut l’éviter sur les serveurs web traitant des requêtes simultanées ; utilisez plutôt `pyuca`.
- La disponibilité des locales varie : `fr_FR.UTF-8` peut ne pas exister sur les images Docker minimales. Générez-la (`locale-gen`) ou installez le paquet `locales`.
- La normalisation est importante : « café » peut être encodé de deux façons — `café` (un seul `é`, NFC) ou `cafe` + accent combiné (NFD). Ils sont considérés comme différents. Veillez à normaliser au préalable : `unicodedata.normalize("NFC", s)`.
- Le ß allemand, le I turc et le sigma final grec obéissent à des règles spécifiques à la locale que la simple fonction `.lower()` ne gère pas correctement. `casefold()` gère la plupart des cas ; pour une exactitude totale, ICU est nécessaire (`pip install PyICU`).
- Les nombres dans les chaînes de caractères ne se classent pas « naturellement ». Par exemple, `["file2", "file10"]` > `["file10", "file2"]`. Utilisez la bibliothèque `natsort` pour un tri naturel.
- Le tri des caractères chinois/japonais/coréens par point de code ne correspondra pas à l’ordre pinyin/par trait/par radical auquel s’attendent les utilisateurs — cela nécessite ICU ou des bibliothèques spécifiques à la langue.

### Guide de décision rapide

Pour l'anglais uniquement avec des majuscules et minuscules mélangées, utilisez `key=str.casefold`.

Pour les langues européennes dans un environnement contrôlé, utilisez `locale.strxfrm`.

Pour du code portable ou multithread avec une prise en charge Unicode appropriée, utilisez `pyuca` ou `PyICU`.

Pour les noms de fichiers contenant des chiffres, utilisez `natsort`.

## Liste d'objets

En utilisant l'argument `key`, la méthode suivante est plus efficace et plus propre que la fonction de comparaison du JavaScript :

```python
users = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
    {"name": "Carol", "age": 35},
]

# classés par âge (croissant)
sorted(users, key=lambda u: u["age"])

# classement par clés multiples (tuple)
sorted(users, key=lambda u: (u["age"], u["name"]))

# Pour les instances de classe, utilisez l'opérateur attrgetter (qui est plus rapide que lambda)
from operator import itemgetter, attrgetter
sorted(users, key=itemgetter("age"))
```

## Considérations relatives aux performances

La complexité est de `O(n log n)` dans le pire des cas, et de `O(n)` sur des données déjà triées ou presque triées. Depuis 2018, Python utilise le même algorithme que les moteurs JavaScript tels que V8 pour `Array.prototype.sort`.

En comparant `sort()` et `sorted()`, on note que `sort()` est légèrement plus rapide et utilise moins de mémoire, car aucune nouvelle liste n'est allouée. Utilisez-le lorsque vous n'avez pas besoin de l'ordre d'origine.

Et, comme mentionné ci-dessus, **`attrgetter`/`itemgetter`** sont implémentés en C et sont nettement plus rapides que les lambdas équivalents sur les grandes listes.

### À propos de `key` par rapport au comparateur

La différence fondamentale entre les deux est la suivante :

- `key` transforme chaque élément en une valeur de tri une seule fois. Python compare ensuite ces valeurs précalculées.
- Le comparateur est une fonction qui prend deux éléments et renvoie une valeur négative, nulle ou positive. Python appelle cette fonction chaque fois que l’algorithme de tri doit comparer une paire.

Pour `n` éléments, le tri avec le comparateur effectue `n log n` comparaisons, mais seulement `n` transformations de clé.

Prenons l’exemple du tri de chaînes de caractères par longueur :

```python
words = ["kiwi", "fig", "banana", "apple", "date"]
```

Avec `key`, le code serait :

```python
call_count = 0

def length_key(s):
    global call_count
    call_count += 1
    return len(s)

sorted(words, key=length_key)
print(call_count)  # 5  — appelée une fois par élément
```

Avec le comparateur via `cmp_to_key`, vous obtiendriez :

```python
from functools import cmp_to_key

call_count = 0

def length_cmp(a, b):
    global call_count
    call_count += 1
    return len(a) - len(b)

sorted(words, key=cmp_to_key(length_cmp))
print(call_count)  # 7  — appelé une fois par comparaison (varie en fonction de l'entrée)
```

5 éléments génèrent 5 appels de fonction clé contre environ 7 appels au comparateur. Avec 1 000 éléments : 1 000 contre environ 10 000. Avec 1 000 000 : 1 million contre environ 20 millions.

Alors, quand a-t-on _réellement_ besoin d’un comparateur ?

Lorsque l’ordre de tri dépend d’une **relation entre deux éléments**, qui ne peut être réduite à une seule valeur par élément.

Prenons un exemple courant où nous devons trier une liste de nombres pour obtenir le plus grand nombre de la liste.

Ainsi, pour cette liste `[3, 30, 34, 5, 9]`, le résultat du tri serait `[9, 5, 34, 3, 30]` pour obtenir ce plus grand nombre : `"9534330"`.

On ne peut pas attribuer une seule clé de tri pour comparer `3` et `30` isolément — cela dépend de l’élément avec lequel on les compare :

- La comparaison `3` vs `30` donnerait la paire `330 > 303`. On peut dire que `3` vient en premier.
- `3` et `34` donneraient cette comparaison de paires : `334 < 343`. Cette fois, `34` vient en premier.

Codons cela :

```python
from functools import cmp_to_key

nums = [3, 30, 34, 5, 9]

def compare(a, b):
    # Si « ab » > « ba », « a » doit venir en premier, donc la valeur renvoyée est négative
    if str(a) + str(b) > str(b) + str(a):
        return -1
    elif str(a) + str(b) < str(b) + str(a):
        return 1
    return 0

result = sorted(nums, key=cmp_to_key(compare))
print("".join(map(str, result)))  # "9534330"
```

Aucune fonction `key` à valeur unique ne peut exprimer cela — l’ordre est intrinsèquement défini par paires.

Pour choisir entre `key` et un comparateur, suivez donc cette règle empirique :

- Vous souhaitez trier en fonction de la valeur X de chaque élément ? Utilisez `key`.
- Vous souhaitez trier en fonction de la relation entre deux éléments ? Utilisez `cmp_to_key`.
- Si vous pouvez l’exprimer sous forme de `key`, privilégiez toujours cette option : elle nécessite moins d’appels et les valeurs transformées sont mises en cache en interne.

## Derniers points à prendre en compte

`list.sort()` renvoie `None`, et non la liste triée. Utilisez `sorted()` pour l’enchaînement ou l’affectation.

N’oubliez pas que les éléments égaux (voir l’exemple de la pomme ci-dessus) conservent leur ordre d’origine (comme dans le JavaScript moderne).

Si vous utilisez **des types mixtes**, Python lèvera une exception `TypeError` et `sorted([1, « a »])` échouera. JavaScript effectuerait silencieusement une conversion en chaînes de caractères.

Les valeurs `None` ne peuvent pas être comparées à des nombres — fournissez une `key` qui les gère : `key=lambda x: (x is None, x)`.

Enfin, n’oubliez pas que les chaînes de caractères sont triées lexicalement par point de code Unicode, donc `Z < a`. Référez-vous à l’arbre de décision proposé plus haut.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de Pixabay sur Pexels.
