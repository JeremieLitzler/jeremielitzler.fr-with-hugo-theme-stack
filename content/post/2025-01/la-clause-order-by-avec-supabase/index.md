---
title: "La clause “Order By” avec Supabase"
description: "Avec Supabase, l’ordonnancement d’une liste d’enregistrements est simple et intuitif. Mais il y a un point à connaître."
image: 2025-01-27-objects-ordered-by-size.jpg
imageAlt: Objets classés par taille
date: 2025-01-29
categories:
  - Développement Web
tags:
  - Supabase
---

J’écris cette petite astuce du jour pour décrire le comportement lorsque vous ordonnez le résultat d’une requête et que des valeurs nulles existent sur une colonne cible.

## Le cas d’utilisation

Disons que nous avons une table `entities` avec une colonne `created_at` et une autre nommée `in_progress_at`.

La première colonne ne vaut jamais `null` alors que la seconde peut-être égale à `null` jusqu’à ce qu’on mette à jour l’enregistrement.

Maintenant, la logique métier veut classer les enregistrements par ordre décroissant, en commençant par les derniers enregistrements mis à jour et en terminant par les autres.

Si vous ordonnez par ordre décroissant sur `in_progress_at` d’abord et ensuite sur `created_at` également par ordre décroissant, que se passera-t-il si vous avez un enregistrement sans `in_progress_at` défini et un autre sans valeur sur `in_progress_at` ?

Tout simplement, l’enregistrement dont la valeur de `in_progress_at` est nulle sera listée en premier.

Et si vous ajoutez un nouvel enregistrement et mettez à jour un enregistrement existant ? Eh bien, le nouvel enregistrement restera en tête…

Qu’en est-il de l’ordre croissant ? C’est l’inverse : l’enregistrement avec une valeur nulle arrive en deuxième position.

## Tester avec l’éditeur SQL de Supabase

C’est simple :

- Créez un [compte Supabase] (https://supabase.com/) et un projet.
- Créer une table `entities` avec les deux colonnes de dates décrites ci-dessus.
- Insérer quelques enregistrements.
- Naviguer sur l’éditeur SQL pour tester les requêtes suivantes :

```sql
select * from entities order by updated_at desc, created_at desc
```

La requête ci-dessus donnera le résultat suivant :

![Requête ordonnée décroissante](query-ordered-descending.jpg)

```sql
select * from entities order by updated_at asc, created_at asc
```

La requête ci-dessus donnera le résultat suivant :

![Requête ordonnée ascendante](query-ordered-ascending.jpg)

Aucun des deux ne donne le résultat escompté. L’entité 12 devrait arriver en deuxième position et l’entité 5 en premier.

## Solution en SQL

La solution SQL est simple :

```sql
select * from entities
-- ordonner par `updated_at` si non null, ou `created_at`
order by COALESCE( updated_at, created_at) desc;
```

Nous obtenons le bon résultat :

![Résultat correct de la requête](correct-query-result.jpg)

## Problème lié à l’utilisation de l’API publique de Supabase

Mais comment s’y prendre avec le client JavaScript de Supabase ?

Clairement pas de la façon suivante !

```ts
export const allEntitiesQuery = supabase
  .from("entities")
  .select()
  .order("coalesce(updated_at, created_at)", {
    ascending: false,
  });
```

Pour le code ci-dessus, vous obtenez une erreur :

```plaintext
failed to parse order (coalesce(updated_at, created_at).desc)" (line 1, column 9) ;

Details: unexpected '(' expecting letter, digit, "-", "->>", "->", delimiter (.), "," or end of input" with the following code: PGRST100
```

Comment résoudre ce problème ?

## Solution utilisant l’API publique de Supabase

La réponse : Les fonctions Postgres !

Dans notre cas, cela se présente comme suit. On déclare tout d’abord une fonction Postgres :

```sql
CREATE OR REPLACE FUNCTION coalesce_updated_at_or_created_at_sort(
    target_table text,
    selected_columns text DEFAULT '*',
    sort_direction text DEFAULT 'DESC',
) RETURNS SETOF json AS $$
BEGIN
    IF sort_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'sort_direction must be either ASC or DESC';
    END IF;

    RETURN QUERY EXECUTE format(
        'SELECT row_to_json(t) FROM (SELECT %s FROM %I ORDER BY COALESCE(updated_at, created_at) %s) t',
        selected_columns,
        target_table,
        sort_direction
    );
END;
$$
 LANGUAGE plpgsql SECURITY DEFINER;
```

Pour l’utiliser, exécutez le code SQL ci-dessus sur l’éditeur SQL de Supabase, générez vos types TypeScript à l’aide de la _CLI_ de Supabase et mettez à jour le code TypScript :

```ts
export const allEntitiesQuery = supabase.rpc(
  "coalesce_updated_at_or_created_at_sort",
  {
    target_table: "entities",
    selected_columns: "*",
    sort_direction: "DESC",
  },
);
```

Je pourrais l’améliorer, mais il résout la logique métier à réaliser.

Pour en savoir plus, consultez la documentation officielle de Supabase :

- [Ordonner les enregistrements](https://supabase.com/docs/reference/javascript/order)
- [Fonctions Postgres](https://supabase.com/docs/guides/database/functions)
- [Fonction `RPC`](https://supabase.com/docs/reference/javascript/rpc)

## Conclusion

C’était un sujet délicat, car je ne connaissais pas les fonctions Postgres. J’avais écrit un brouillon de cet article et en le complétant, j’ai réalisé que j’étais loin du but !

Avez-vous appris quelque chose aujourd’hui ? Ce fut clairement mon cas !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pavel Danilyuk](https://www.pexels.com/photo/fashion-creative-girl-pattern-6461495/).
