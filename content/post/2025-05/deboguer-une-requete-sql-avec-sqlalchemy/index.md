---
title: "Déboguer une requête SQL avec SQLAlchemy"
description: "SQLAlchemy permet d'interroger n'importe quelle base de données à la manière d'un ORM. Mais vérifier quel est le code SQL final exécuté peut nous aider."
image: 2025-03-19-a-green-weevil-bug.jpg
imageAlt: Un charançon vert
date: 2025-05-07
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Python
---

Pour analyser le SQL exécuté par SQLAlchemy, vous devez importer le pilote de votre type de base données de `sqlalchemy.dialects`.

Le code final est le suivant :

```python
# Pour SQLite
from sqlalchemy.dialects import sqlite

query = session.query(Entity).filter(
    and_(
        Entity.status.in_(target_statuses),
        Entity.confirmed_at == None,
        Entity.created_at <= cutoff_datetime
    )
).order_by(func.coalesce(
    Entity.in_progress_at,
    Entity.created_at)
)

# Cela permet d'imprimer le code SQL généré et exécuté par SQLAlchemy

print(query.statement.compile(dialect=sqlite.dialect()))
```

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pixabay](https://www.pexels.com/photo/green-black-and-brown-insect-40875/).
