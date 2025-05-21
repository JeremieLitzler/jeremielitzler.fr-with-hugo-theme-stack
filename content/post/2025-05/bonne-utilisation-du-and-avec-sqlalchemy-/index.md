---
title: "Bonne utilisation du “And” avec SQLAlchemy"
description: "Voici une nouvelle petite astuce pour tous ceux qui apprennent à utiliser SQLAlchemy."
image: 2025-04-02-a-child-hand-on-an-adult-hand.jpg
imageAlt: Une main d'enfant sur celle d'un adulte
date: 2025-05-21
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Python
  - SQL Alchemy
---

## Objectif

Pour construire cette instruction SQL :

```sql
SELECT * FROM event
WHERE
status IN ('NEW', 'TODO') AND
confirmed_at IS NULL AND
created_at <= p_cutoff_datetime
```

## Comment ne pas écrire la requête SQLAlchemy

Vous ne devez pas déclarer votre requête SQLAlchemy de la façon suivante :

```python
            query = session.query(EventEntity).filter(
                    EventEntity.status.in_(statuses),
                    EventEntity.confirmed_at == None,
                    EventEntity.created_at <= cutoff_datetime
            )
```

Il produira l’instruction SQL suivante :

```sql
SELECT * FROM event
WHERE
0 != 1 -- 🤔
```

Le `0 != 1` est la façon dont SQLAlchemy crée une condition qui renvoie toujours faux, et donc aucun résultat.

## Bonne syntaxe

Au lieu de cela, utilisez SQLAlchemy comme ceci, en enveloppant vos conditions avec l’opérateur `and_` :

```python
            from sqlalchemy import and_

            query = session.query(EventEntity).filter(
                and_(
                    EventEntity.status.in_(statuses),
                    EventEntity.confirmed_at == None,
                    EventEntity.created_at <= cutoff_datetime
                )
            )
```

C’est tout pour cette fois !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Juan Pablo Serrano](https://www.pexels.com/photo/father-and-child-s-hands-together-1250452/)
