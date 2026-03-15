---
title: "SQL Server — Collation, accents et contraintes d’unicité"
description: "Les collations permettent de gérer la sensibilité à la casse et de définir diverses contraintes."
image: /quick-tips/images/sql-server.webp
imageAlt: Logo de Microsoft SQL Server
date: 2026-03-18
categories:
  - Développement web
tags:
  - SQL Server
---

Imaginons que nous enregistrions des informations dans une colonne `NVARCHAR` et que nous ne voulions pas avoir à nous soucier des accents ou de la casse des caractères pour garantir l’unicité.

Que faut-il faire ?

## L’exemple

Prenons l’exemple d’une table `Person` comportant une colonne `Name`.

Je voudrais m’assurer que la saisie de l’utilisateur ne pose pas de problème d’unicité dans les enregistrements, que la saisie soit « Jeremie Litzler » ou « Jérémie Litzler ».

## Vérification du classement actuel

Tout d’abord, vérifions le classement actuel de la colonne :

```sql
SELECT  COLUMN_NAME,  COLLATION_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = Person' AND COLUMN_NAME = 'Name';
```

## Interprétation du paramètre COLLATION

Supposons que le paramètre de collation soit `Latin1_General_100_CI_AI`. Qu’est-ce que cela signifie ?

- Latin1_General_100 : collation moderne avec les règles de tri de la version 100
- CI = insensible à la casse
- AI = insensible aux accents

## La solution

Ainsi, si je souhaite éviter que les entrées « Jeremie Litzler » et « Jérémie Litzler » soient tous deux insérés, je dois modifier la collation en `Latin1_General_100_CI_AS` :

- AS = sensible aux accents

De cette façon, l’exécution de `SELECT * FROM Person WHERE NAME = 'Jeremie Litzler'` renverrait la même entrée que `SELECT * FROM Person WHERE NAME = 'Jérémie Litzler'`.

## Aller plus loin

La meilleure solution consiste à ajouter une contrainte d’unicité :

```sql
ALTER TABLE Person
    ADD CONSTRAINT IX_Person_Name UNIQUE
        ([Name])
```

Veillez toutefois à ce que votre colonne, si elle est de type `NVARCHAR`, n’utilise pas la précision `MAX`. Vous devez limiter la taille de la colonne pour créer la contrainte d’unicité.

## Documentation

Référence : [Microsoft Learn](https://learn.microsoft.com/en-us/sql/relational-databases/collations/collation-and-unicode-support).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédits: Image de [Microsoft Server](https://www.microsoft.com/en-us/sql-server)
