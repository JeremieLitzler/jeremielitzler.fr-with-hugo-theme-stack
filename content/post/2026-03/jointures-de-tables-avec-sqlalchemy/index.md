---
title: "Jointures de tables avec SQLAlchemy"
description: "Il existe plusieurs façons de joindre des tables, mais voici celle qui a fonctionné pour moi."
image: 2026-03-02-chemistry-set-with-4-tubes-erlenmeyer-flask-and-a-beaker.jpg
imageAlt: Set de chimie avec 4 tubes, un erlenmeyer et un bécher
date: 2026-03-06
categories:
  - Développement Web
tags:
  - Python
  - SQL Alchemy
---

Lors du développement d’une application Python, j’ai eu besoin de récupérer des données réparties dans deux tables liées en une seule requête. C’est ce qu’on appelle réaliser une jointure en SQL.

Voici ce que j’ai appris sur les jointures avec SQLAlchemy.

## Le SQL

Je connaissais le code SQL que je devais exécuter.

```sql
SELECT * FROM event
JOIN event_journal ON event.event_id = event_journal.event_id
```

Mais comment cela se matérialise-t-il avec SQLAlchemy ?

## La requête écrite en Python

L’instruction SQLAlchemy s’écrit de la manière suivante :

```python
from sqlalchemy.orm import Session

session = Session()
results = session.query(EventEntity, EventJournalEntity).join(
    EventJournalEntity,
    EventEntity.event_id == EventJournalEntity.event_id
).all()

# Traiter les résultats : contient des tuples de (EventEntity, EventJournalEntity)
for event, journal in results:
    print(f"Event: {event.id}, Journal: {journal.id}")
```

J’aimerais ajouter quelques commentaires :

- `session.query(EventEntity, EventJournalEntity)` indique à SQLAlchemy que vous voulez des colonnes des deux tables — le résultat sera une liste de tuples plutôt qu’une liste plate d’une entité.
- `.join(EventJournalEntity, EventEntity.event_id == EventJournalEntity.event_id)` spécifie la table cible et la condition `ON` explicitement, ce qui évite toute ambiguïté lorsque la relation n’est pas préconfigurée dans le modèle.
- Vous pouvez enchaîner `all()`, `.filter()`, `.order_by()`, et d’autres clauses après `.join()` comme vous le feriez normalement pour une requête sur une seule entité.

J’aborderai probablement d’autres scénarios plus complexes lorsque je les rencontrerai.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Kindel Media](https://www.pexels.com/photo/colorful-liquids-in-laboratory-glasswares-8325715/).
