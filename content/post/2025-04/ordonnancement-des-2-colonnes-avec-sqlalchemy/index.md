---
title: "Ordonnancement sur 2 colonnes avec SQLAlchemy"
description: "Il ne s’agit pas seulement de trier par ordre alphabétique ou chronologique."
image: 2025-04-07-boxes-sorting-stuff.jpg
imageAlt: Boîtes de triage
date: 2025-04-09
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Python
  - SQL Alchemy
---

Lorsque nous trions des données, nous devons prendre en compte les valeurs NULL. J’aimerais partager quelque chose que j’ai appris à travers un exemple pratique lors de la construction d’une application Python.

## SQL

Par exemple, pour construire cette requête SQL :

```sql
SELECT * FROM event
WHERE
status IN ('NEW', 'TODO') AND
confirmed_at IS NULL AND
created_at <= p_cutoff_datetime
ORDER BY
coalesce(in_progress_at, created_at) DESC NULLS LAST
```

## L’équivalent Python

Rédigez l’instruction SQLAlchemy de la manière suivante :

```python
            from sqlalchemy import select, update, func, and_, nullslast

            query = session.query(EventEntity).filter(
                and_(
                    EventEntity.status.in_(statuses),
                    EventEntity.confirmed_at == None,
                    EventEntity.created_at <= cutoff_datetime
                )
            ).order_by(
                nullslast(
                    func.coalesce(
                        EventEntity.in_progress_at,
                        EventEntity.created_at
                    ).desc()
                )
            )
```

Quelques commentaires :

- La fonction `coalesce` prend la première valeur si elle est fournie, sinon elle prend la seconde.
- La fonction `nullslast` assure que les valeurs nulles n’apparaissent pas en premier, ce qui correspond à la logique SQL par défaut.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo du [RDNE Stock project](https://www.pexels.com/photo/boxes-on-the-floor-8580732/)
