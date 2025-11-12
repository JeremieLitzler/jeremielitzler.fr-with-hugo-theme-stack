---
title: "SQL Server - Cast et Convert"
description: "Comment utiliser les fonctions Cast and Convert avec un exemple"
image: /astuces/images/sql-server.webp
imageAlt: Logo de Microsoft SQL Server
date: 2025-10-31
categories:
  - Développement Web
tags:
  - SQL Server
---

Avec SQL Server, vous pouvez convertir un type vers un autre, par exemple un `INT` en `VARCHAR`, à l’aide de la fonction `CAST` ou `CONVERT`. Voici un exemple pour chaque fonction :

## En utilisant `CAST`

```c#
SELECT CAST(123 AS VARCHAR(10)) AS ConvertedValue;
```

## En utilisant `CONVERT`

```c#
SELECT CONVERT(VARCHAR(10), 123) AS ConvertedValue;
```

## Points clés

Spécifiez toujours la longueur pour VARCHAR (par exemple, VARCHAR(10)), sinon SQL Server utilise une longueur par défaut de 30.

Si vous omettez la longueur, cela peut entraîner une troncature sur vos valeurs excédant les 30 caractères.

## Documentation

Référence : [Microsoft Learn](https://learn.microsoft.com/fr-fr/sql/t-sql/functions/cast-and-convert-transact-sql?view=sql-server-ver17).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédits : Image de [Microsoft Server](https://www.microsoft.com/en-us/sql-server)
