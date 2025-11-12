---
title: "SQL Server - Fonction Coalesce"
description: "Usage de la fonction Coalesce avec un exemple"
image: /astuces/images/sql-server.webp
imageAlt: Logo de Microsoft SQL Server
date: 2025-10-28
categories:
  - Développement Web
tags:
  - SQL Server
---

## Cas d’usage

Vous avez deux tables liées entre elles par une relation, par example une colonne `Id`.

Vous souhaitez sélectionner une colonne de la table A, mais si celle-ci vaut `NULL`, vous souhaitez lire une colonne de la table B.

Pour cela, vous devez utiliser la fonction intégrée `COALESCE` dans SQL Server.

## Code

```sql
SELECT
    COALESCE(a.ColumnName, b.ColumnName) AS PreferredColumn
FROM
    TableA a
JOIN
    TableB b ON a.ID = b.ID;
```

`COALESCE` renvoie la première valeur non nulle de la liste.

## Documentation

Reference: [Microsoft Learn](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/coalesce-transact-sql).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédits: Image de [Microsoft Server](https://www.microsoft.com/en-us/sql-server)
