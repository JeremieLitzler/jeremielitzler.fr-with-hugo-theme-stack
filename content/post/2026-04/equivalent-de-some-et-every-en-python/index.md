---
title: "Equivalent de Some() et Every() avec Python"
description: "Python n'est pas JavaScript. Cette fois-ci, je vais vous montrer un exemple de l'équivalent en Python des fonctions Some et Every de JavaScript."
image: /images/2024-08-23-a-real-python.jpg
imageAlt: Un vrai python
date: 2026-04-22
categories:
  - Web Development
tags:
  - Python
---

Python n’est pas JavaScript. Cette fois-ci, je vais vous montrer un exemple de l’équivalent en Python des fonctions `some()` et `every()` de JavaScript.

Les exemples que je donne traitent à la fois des valeurs primitives et des objets.

## L’équivalent en Python de la fonction `some()` de JavaScript

L’équivalent en Python de la fonction `some()` de JavaScript est `any()`.

```python
# avec des primitives
nums = [1, 3, 5, 8, 9]
any(n % 2 == 0 for n in nums)  # True (8 est pair)

# avec des objets
users = [{"name": "Alice", "active": False}, {"name": "Bob", "active": True}]
any(u["active"] for u in users)  # True
```

## L’équivalent en Python de la fonction `every()` de JavaScript

L’équivalent en Python de la fonction `every()` de JavaScript est `all()`.

```python
# avec des primitives
nums = [2, 4, 6, 8]
all(n % 2 == 0 for n in nums)  # True

# avec des objects
users = [{"name": "Alice", "active": True}, {"name": "Bob", "active": True}]
all(u["active"] for u in users)  # True
```

## Considérations relatives aux performances

Ces deux fonctions s’arrêtent prématurément, tout comme leurs équivalents en JavaScript :

- `any()` s’arrête au premier résultat vrai,
- `all()` s’arrête au premier résultat faux.

Je vous recommande d’utiliser des expressions génératrices (entre parenthèses) plutôt que des compréhensions de liste (entre crochets) pour bénéficier de l’arrêt prématuré.

`all(x > 0 for x in data)` s’évalue de manière paresseuse.
`all([x > 0 for x in data])` construit d’abord la liste entière, gaspillant ainsi de la mémoire et du temps.

## Quelques mises en garde à connaître

- Avec des itérables vides, retenez ce qui suit : `any([])` renvoie `False`, `all([])` renvoie `True`. Cela correspond au comportement de JavaScript mais prend les gens au dépourvu — le fait que `all([])` soit `True` est une vérité vide de sens.
- Il n’y a pas d’accès par index en Python, contrairement à ses homologues JavaScript. Si vous avez besoin de l’index, utilisez `enumerate()`, comme nous l’avons vu dans de nombreux articles précédents de cette série : `any(val > 10 for i, val in enumerate(data))`.
- Il n’existe pas de paramètre de prédicat intégré, vous avez donc toujours besoin d’une expression de générateur.
- Il existe des différences de vérité entre Python et JavaScript, car ces deux langages de programmation utilisent des valeurs fausses différentes. `0`, `« »`, `None`, `[]`, `{}` sont tous faux en Python. En JS, `[]` et `{}` sont vrais. Cela a de l’importance si vous utilisez simplement `any(items)` sans condition explicite.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de Pixabay sur Pexels.
