---
title: "Vérifier None dans une requête SQLAlchemy"
description: "Voici un petit conseil pour tous ceux qui apprennent à utiliser SQLAlchemy."
image: 2025-03-26-an-empty-subway.jpg
imageAlt: Une rame de métro vide
date: 2025-05-14
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Python
  - SQL Alchemy
---

Vérifier pour `None` a lieu assez souvent pour que vous ayez besoin de connaître cette petite astuce.

## Le SQL

L’objectif est de générer cette requête SQL à partir de SQLAlchemy :

```sql
SELECT * FROM event
WHERE confirmed_at IS NULL
```

## Pas comment l’écrire

Vous ne devriez pas déclarer votre requête SQLAlchemy comme suit :

```python
query = session.query(EventEntity).filter(
    EventEntity.confirmed_at is None,
)
```

Cela semble naturel si vous avez déjà écrit du code Python, mais cela ne fonctionnera pas.

## Syntaxe correcte

À la place, utilisez SQLAlchemy comme ceci, en utilisant l’opérateur `==` :

```python
query = session.query(EventEntity).filter(
    EventEntity.confirmed_at == None,
)
```

## Pourquoi

Parce que _SQLAlchemy_ utilise des _méthodes magiques (ou surcharges d’opérateur)_ pour créer les constructions `SQL`, il ne peut gérer que des opérateurs tels que `!=` ou `==`, et il n’est pas capable de travailler avec `is` (qui est une construction Python tout à fait valide).

Source : [Stackoverflow](https://stackoverflow.com/a/5632224/3910066)

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pixabay](https://www.pexels.com/photo/empty-subway-train-302428/)
