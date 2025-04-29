---
title: "Améliorer l'expérience de développement avec les alias Bash"
description: "Vous avez plusieurs CLI dans votre projet ? Activons l'autocomplétion des commandes."
image: 2025-05-02-example-of-autocomplete.jpg
imageAlt: Exemple d'autocomplétion
date: 2025-07-16
categories:
  - Développement logiciel
tags:
  - Bash
---

Vous utilisez souvent les mêmes commandes, mais elles sont longues ou vous ne vous souvenez pas de leur syntaxe ? J’ai une solution pour vous !

## Bash Aliases

C’est appelé _bash aliases_ pour faire la même chose que ce que vous pouvez faire avec les scripts npm, mais avec une meilleure DX (_Developer Experience_ ou expérience de développement) :

- Créez un `.bashrc` à la racine du repository.
- Définissez vos alias, par exemple :

```bash
alias sp-init='supabase init'
alias sp-login='supabase login'
alias sp-link-env='source .env && echo "linking to $SUPABASE_PROJECT_ID ... using password=$SUPABASE_PROJECT_PASSWORD" && supabase link --project-ref $SUPABASE_PROJECT_ID'
alias sp-gen-types='source .env && supabase gen types --lang=typescript --project-id "$SUPABASE_PROJECT_ID" --schema public > src/types/database.types.ts'
alias sp-db-migrate-new='supabase migration new "$1"'
alias sp-dbreset='supabase db reset --linked'
alias sp-dbseed='node --env-file=.env database/sedding.js'
alias sp-dbrs='sp-dbreset && node --env-file=.env database/sedding.js'
```

## Usage

Exécutez `source .bashrc` depuis le terminal à la racine du dépôt Git.

Ensuite, lancez n’importe quel alias avec son nom et utilisez `TAB` pour les lister si vous ne vous souvenez pas exactement d’un alias.

Pour vérifier que les alias sont chargés, lancez `alias` dans le terminal.

PS : vous aurez aussi beaucoup d’autres alias prédéfinis dans votre environnement.

Pour recharger les alias après un changement, lancez `source .bashrc` à chaque fois.

J’ai testé cela avec Git bash pour Windows. Sur MacOS ou Linux, ça fonctionnera aussi très bien.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
