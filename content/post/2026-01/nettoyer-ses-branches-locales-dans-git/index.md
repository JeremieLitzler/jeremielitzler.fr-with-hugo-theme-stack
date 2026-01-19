---
title: "Nettoyer ses branches locales avec Git"
description: "Si vous complétez de nombreuses fonctionnalités d'une application ou résolvez de nombreuses anomalies, votre dépôt local peut devenir encombré de branches Git locales."
image: 2026-01-19-flowers-of-a-magnolia-tree.jpg
imageAlt: Fleurs d'un magnolia
date: 2026-01-23
categories:
  - Outils
tags:
  - Git
  - Bash
---

Alors que je travaillais sur [mon projet Vue et Supabase Boilerplate](https://github.com/JeremieLitzler/VueSupabaseBoilerplate), j’ai ajouté de nombreuses fonctionnalités.

J’ai eu besoin à un moment d’un script pour supprimer toute branche locale qui ne s’appelait pas « `main` » ou « `develop` », qui n’était pas une branche précédemment fusionnée ou qui n’avait pas d’équivalent distant.

Oui, ce qui suit supprimera toutes les branches que vous avez créées et qui n’ont pas encore été poussées sur le référentiel distant ⚠️. Soyez donc prudent et lancez toujours le script sans l’option `-D`.

Voyons comment accélérer le processus de nettoyage.

## Le script Bash

J’adore les scripts `bash` pour effectuer de petites tâches comme celle-ci. Grâce à eux, vous pouvez accomplir beaucoup de choses sans avoir besoin d’un nouveau logiciel ou service.

À l’aide de Git Bash, fourni par défaut avec Git, vous pouvez exécuter la commande suivante :

```sh
#!/bin/bash

# Par défault, DRY_RUN est false, donc rien n'est supprimé.
DRY_RUN=true

echo "Parse command line arguments"
while [[ "$#" -gt 0 ]]; do
    case $1 in
        # Le paramètre « -D » assigne `false` à la variable DRY_RUN.
        -D) DRY_RUN=false ;;
        # Sinon, tout autre valeur tombe en erreur
        *) echo "Unknown parameter: $1. Use `-D` to execute actual branch clean up"; exit 1 ;;
    esac
    shift
done

# On met à jour le référentiel local
echo "Fetch all remotes to ensure we have latest information"
git fetch --all

# On lit les branches sur le référentiel distant
echo "Get list of remote branches (strip refs/remotes/origin/ prefix)"
REMOTE_BRANCHES=$(git branch -r | sed 's/origin\///' | tr -d ' ')
echo $REMOTE_BRANCHES
echo ""

echo "Now, process each local branch"
# La variable `branch` provient de la dernière ligne de la boucle
# et représente l'itération actuelle de la sortie `git branch`.
while read -r branch; do
    # Nom de branche propre (supprimer les espaces et l'astérisque en début de nom)
    branch_name=$(echo "$branch" | sed 's/^* //;s/^ *//')
    # Définit is_current si le nom de la branche contient « * », ce qui signifie qu'il s'agit de la branche de checkout.
    is_current=$(echo "$branch" | grep -q "^\*" && echo true || echo false)

    [[ -z "$branch_name" ]] && echo "Skip branch because is empty" && continue

    [[ "$branch_name" == "develop" || "$branch_name" == "main" ]] && echo "Skip branch because is develop or main" && continue

    echo "Check if <$branch_name> exists on remote"
    if ! echo "$REMOTE_BRANCHES" | grep -q "^${branch_name}$"; then
        if [ "$DRY_RUN" = true ]; then
            echo "Would delete branch: <$branch_name>"
        else
            if [ "$is_current" = true ]; then
                echo "Skipping current branch: <$branch_name>"
            else
                echo "Deleting branch: <$branch_name>"
                git branch -D "$branch_name"
            fi
        fi
    else
        echo "Remote branch exists for <$branch_name>. Skip delete."
    fi
# Exécute la commande `git branch` pour lister toutes les branches locales.
done < <(git branch)
```

## Petite mise en garde concernant les anciennes branches distantes

Si vous exécutez le script et que vous avez supprimé des branches distantes, par exemple après la finalisation d’une PR, vous remarquerez peut-être que certaines branches sont signalées comme « Branche distante existante pour `a-branch` », alors qu’elles n’existent plus.

Que se passe-t-il ?

### Fonctionnement des références distantes

Les branches avec un suivi de leur équivalent distant sont des références locales qui représentent l’état des branches dans votre référentiel distant. Elles agissent comme des signets pour se souvenir de l’emplacement des branches distantes lors de votre dernière synchronisation (voir la [documentation Git](https://git-scm.com/book/pt-pt/v2/Ramifica%C3%A7%C3%A3o-do-Git-Remote-Branches)).

Lorsque quelqu’un supprime une branche sur le serveur distant, votre référentiel local ne supprime pas automatiquement sa référence à cette branche tant que vous ne l’avez pas explicitement supprimée (pour en savoir plus sur la suppression de branches, consultez [cet article](https://hswolff.com/blog/prune-remote-git-branches/) ou [ce qui suit](#mise-a-jour-des-références-distantes)).

Git stocke ces références localement dans votre répertoire `.git/refs/remotes/` (ou dans le fichier `.git/packed-refs` pour un stockage optimisé), tandis que vos paramètres de configuration à distance sont conservés dans `.git/config`. Ils sont gérés séparément de l’état réel du référentiel distant.

C’est en raison de cette séparation que vous devez explicitement demander à Git de nettoyer ces références lorsqu’elles deviennent obsolètes.

### Mise à jour des références distantes

Il existe plusieurs façons de mettre à jour ces références obsolètes :

- Avec `git fetch avec prune`

  ```bash
  git fetch --prune
  # Version abrégée
  git fetch -p
  ```

  Cette commande récupère les mises à jour du dépôt distant et supprime toutes les références de suivi distant qui n’existent plus sur le dépôt distant.

- Avec `git remote prune`

  ```bash
  git remote prune origin
  ```

  Cette commande supprime spécifiquement les branches de suivi à distance obsolètes sans récupérer les nouvelles mises à jour.

- Activation de l’élagage automatique

  ```bash
  git config --global fetch.prune true
  ```

  Ce paramètre garantit que vos références de branches distantes restent propres sans intervention manuelle.

## Conclusion

Il ne vous reste plus qu’à créer un fichier `clean-git-local-branches.sh` à la racine de votre dépôt et à l’exécuter.

```sh
sh ./clean-git-local-branches.sh
```

Ensuite, une fois que vous êtes satisfait du test, exécutez le script avec `-D` pour supprimer réellement les branches locales.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Francesco Ungaro](https://www.pexels.com/photo/branches-of-tree-with-magnolia-flowers-7492107/).
