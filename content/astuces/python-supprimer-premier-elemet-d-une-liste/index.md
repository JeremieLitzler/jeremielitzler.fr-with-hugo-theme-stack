---
title: "Python - Supprimer le premier élément d'une liste"
description: "Vous pouvez supprimer le premier élément de trois façons différentes."
imageAlt: /astuces/images/a-real-python.jpg
image: Un python vert
date: 2025-11-14
categories:
  - Développement Web
tags:
  - Python
---

Pour supprimer le premier élément d'une liste en Python, vous pouvez utiliser l'une des méthodes suivantes :

## Utiliser la méthode `pop()`

```python
my_list = [1, 2, 3, 4, 5]
first_item = my_list.pop(0)
```

## Utiliser la méthode de `slicing`

```python
my_list = [1, 2, 3, 4, 5]
my_list = my_list[1:]
```

## Utiliser le mot clé `del`

```python
my_list = [1, 2, 3, 4, 5]
del my_list[0]
```

## Documentation

- [function pop](https://python-reference.readthedocs.io/en/latest/docs/list/pop.html)
- [slicing](https://python-reference.readthedocs.io/en/latest/docs/brackets/slicing.html)
- [del keyword](https://www.w3schools.com/python/ref_keyword_del.asp)

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de [Pixabay](https://www.pexels.com/photo/green-snake-45246/).
