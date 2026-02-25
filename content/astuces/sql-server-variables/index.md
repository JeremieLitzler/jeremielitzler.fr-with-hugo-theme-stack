---
title: "SQL Server - Variables"
description: "Utilisation d’une variable simple avec un exemple"
image: /actuces/images/sql-server.webp
imageAlt: Logo de Microsoft SQL Server
date: 2025-12-04
categories:
  - Développement Web
tags:
  - SQL Server
---

## Scénario

Si vous souhaitez stocker la valeur d’une colonne d’une table, une variable fera l’affaire.

## Code

```sql
-- Vous déclarez la variable avec le préfixe `@` et son type.
DECLARE @Total INT ;

--En option, vous pouvez définir une valeur par défaut
SET @Total = 0 ;
GO

-- Vous stockez la valeur dont vous avez besoin dans la variable
SELECT @Total = COUNT(*)
FROM dbo.Orders
WHERE OrderDate >= '2025-01-01' ;
```

## Documentation

Référence : [Microsoft Learn](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/variables-transact-sql).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Phot de [Microsoft Server](https://www.microsoft.com/en-us/sql-server)
