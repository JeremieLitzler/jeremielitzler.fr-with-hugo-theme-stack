---
title: "SQL Server - Résoudre le conflit de collation"
description: "Les collations dans le moteur de base de données SQL Server fournissent des règles de tri, de la casse et des propriétés de sensibilité aux accents pour vos données."
image: /quick-tips/images/sql-server.webp
imageAlt: Logo de Microsoft SQL Server
date: 2025-12-04
categories:
  - Développement Web
tags:
  - SQL Server
---

Cette erreur SQL Server se produit lorsque vous comparez des colonnes provenant de différentes tables qui ont une collation différente.

## Comprendre les collations

Passons rapidement en revue la signification de ce qu’est une collation.

Par exemple :

- `Latin1_General_100_CI_AI` est une collation moderne avec les règles de tri de la version 100 avec une insensitivité à la casse et les accents.
- `SQL_Latin1_General_CP1_CI_AS` est une collation héritée de SQL Server avec une insensitivité à la casse, mais les accents.

où :

- `CI` signifie Insensible à la casse
- `AI` signifie Insensible aux Accents
- `AS` signifie sensible aux accents

Choisissez la solution selon ce que vous avez besoin (utiliser COLLATE dans la requête) ou que vous voulez standardiser votre base de données (modifier la collation des colonnes).

Voici les solutions pour résoudre le problème.

## Utilisez COLLATE dans votre requête

Ajoutez COLLATE DATABASE_DEFAULT à l’une des colonnes de votre comparaison :

```sql
-- Option 1 : appliquer à une colonne
SELECT *
FROM Table1 t1
JOIN Table2 t2 ON t1.Column1 = t2.Column2 COLLATE DATABASE_DEFAULT

-- Option 2 : appliquer aux deux colonnes
SELECT *
FROM Table1 t1
JOIN Table2 t2 ON t1.Column1 COLLATE DATABASE_DEFAULT = t2.Column2 COLLATE DATABASE_DEFAULT

-- Option 3 : Forcer une collation spécifique
SELECT *
FROM Table1 t1
JOIN Table2 t2 ON t1.Column1 = t2.Column2 COLLATE Latin1_General_100_CI_AI
Permanent Fix - Change Column Collation
```

Si vous souhaitez aligner les collations de manière permanente :

```sql
-- Vérifier les collations actuelles
SELECT
TABLE_NAME,
COLUMN_NAME,
COLLATION_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME IN ('YourColumn1', 'YourColumn2')
AND TABLE_NAME = 'Table1'

-- Modifier la collation des colonnes
ALTER TABLE Table2
ALTER COLUMN Column2 VARCHAR(100) COLLATE Latin1_General_100_CI_AI
```

## Table existante et table temporaire

Lorsque vous ne pouvez pas modifier une table existante, mais que vous pouvez contrôler la définition de la table temporaire, vous devez faire correspondre la collation de la table temporaire à celle de la table existante.

Voici comment définir votre table temporaire :

```sql
-- Option 1 : Faire correspondre explicitement la collation de la table ExistingTable
CREATE TABLE #TmpTable (
    [Code] NVARCHAR(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
)

-- Option 2 : utiliser DATABASE_DEFAULT (si ExistingTable utilise la base de données par défaut)
CREATE TABLE #TmpTable(
    [Code] NVARCHAR(50) COLLATE DATABASE_DEFAULT NOT NULL
)
```

### Pour trouver la collation exacte de la table

Si vous n’êtes pas sûr de la collation utilisée sur une `ExistingTable` et la colonne `Code`, exécutez ceci :

```sql
SELECT
    COLUMN_NAME,
    COLLATION_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ExistingTable'
    AND COLUMN_NAME = 'Code'
```

Utilisez ensuite la collation exacte dans la définition de votre table temporaire.

## Alternative : Correction au moment de la jointure

Si vous préférez ne pas changer la définition de la table temporaire, vous pouvez toujours corriger le problème dans votre requête.

Dans mon cas, j’ai découvert le problème avec la clause `join` :

```sql
SELECT c.*
FROM ExistingTable c
INNER JOIN #TmpCodesNeeded t
    ON c.Code = t.Code COLLATE SQL_Latin1_General_CP1_CI_AS
```

Mais définir la table temporaire avec la collation correcte dès le départ est plus propre et évite d’avoir à utiliser des clauses COLLATE tout au long de vos requêtes.

## Documentation

Référence : [Microsoft Learn](https://learn.microsoft.com/en-us/sql/relational-databases/collations/collation-and-unicode-support).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Microsoft Server](https://www.microsoft.com/en-us/sql-server)
