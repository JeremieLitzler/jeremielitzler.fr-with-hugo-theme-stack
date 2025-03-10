---
title: "Politique de rétention personnalisée pour les images Docker sur les registres de conteneurs Azure"
description: "Sur Microsoft Azure, la gestion des coûts est un travail quotidien. Je vais prendre un exemple avec un registre de conteneurs et la politique de rétention qui consiste à ne conserver que les 10 dernières images."
image: 2025-03-10-lots-of-containers.jpg
imageAlt: Beaucoup de conteneurs en acier
date: 2025-03-14
categories:
  - Développement Web
tags:
  - Microsoft Azure
  - Docker
  - Registres de conteneurs
  - Python
---

Sur un projet [Python](../../../tags/python/_index.md) l’année dernière, j’avais mis en place un pipeline Azure DevOps avec la logique de construire une image Docker d’une application web Python suivant la logique suivante :

- Lorsqu’une fonctionnalité était développée, je tirais une branche de `develop` et effectuais les développements.
- Quand j’ai fini la fonctionnalité, je créais un PR (_Pull Request_ ou Requête de tirage en Français) pour fusionner cette fonctionnalité dans `develop`.
- Une fois la PR fusionnée, la politique de branche de `develop` déclencherait l’exécution du pipeline et la génération d’une image Docker taguée `ready-qa` à déployer dans l’environnement de test dans Azure.
- Après après tester l’application, je fusionnerais `develop` vers `main`, ce qui déclencherait un autre build et générait une nouvelle image Docker en lui assignant le tag `latest` et `$(buildId)`. Ce serait l’image à déployer dans l’environnement de production sur Azure.

Cela a créé beaucoup d’images Docker car, en plus de `ready-qa` ou `latest`, la pipeline créait aussi un tag `$(build_id)` pour chaque exécution sur la branche `main`.

En conséquence, le Container Registry coûtait le plus cher dans l’ensemble des ressources fournies à Azure. Et la liste des images Docker s’accumulait de plus en plus.

Comment pouvais-je améliorer la situation en purgeant les images Docker anciennes et inutiles ?

## Réflexion initiale

La première solution aurait consisté à mettre à niveau le _Container Registry_ vers un registre _premium_ afin de définir une politique de rétention.

Ce n’est pas ce que je voulais et je n’avais le budget pour.

Je savais que je voulais conserver tous les tags non numériques parce que je n’en avais qu’un seul de chaque.

Mais je pouvais supprimer toutes les images marquées numériquement, à l’exception des 10 dernières.

C’est alors que j’ai pensé à l’interface de commande Azure.

## Le script

Je demande à Claude AI de m’aider.

Tout d’abord, je me suis demandé comment lister les tags numériques que je voulais :

```bash
# Lire les dépôts d'images Docker
az acr repository list --name <registry-name> --output table

# Lister des tags pour un dépôt spécifique
az acr repository show-tags --name <registry-name> --repository <repository-name> --orderby time_asc --output table

# Supprimer une image Docker spécifique
az acr repository delete --name <registry-name> --image <repository-name>:<tag> --yes
```

Cela a bien fonctionné, mais comme j’avais des dizaines d’images à supprimer, j’ai voulu être efficace et automatiser un peu plus le processus.

Voici mes exigences :

- fournir le _Container Registry_ comme entrée obligatoire.
- fournir une option pour exécuter en mode « *dry run* » le script.

{{< blockcontainer jli-notice-note "A propos de 'dry run'">}}

Cela signifie que le script est testé sans réellement exécuter les commandes, souvent pour vérifier les erreurs ou les résultats potentiels sans modifier le système.

{{< /blockcontainer >}}

- fournir la possibilité de configurer le nombre de balises numériques à conserver.
- ignorer la suppression des balises non numériques.

La première suggestion consistait à utiliser un script Python. Mais il fallait être connecté à Azure. Cela demandait plus de travail.

Cependant, je savais que je pouvais exécuter un script Bash dans la console CLI d’Azure, voici le script qui réalise cela :

```bash
#!/bin/bash

# Fonction permettant de vérifier si une chaîne de caractères est numérique
is_numeric() {
    [[ $1 =~ ^[0-9]+$ ]]
}

# Fonction d'aide pour afficher l'utilisation du script
usage() {
    echo "Usage: $0 <registry_name> [--dry-run]"
    echo "  <registry_name>: The name of your Azure Container Registry"
    echo "  --dry-run: Optional. If set, no actual deletions will occur"
    exit 1
}

# Vérifier si le nom du registre est fourni
if [ $# -eq 0 ]; then
    echo "Error: Registry name is required."
    usage
fi

# Définir les variables
REGISTRY_NAME=""
echo "Retaining the last $RETENTION_COUNT tags... To change that, edit the constant RETENTION_COUNT in the script"
RETENTION_COUNT=10
DRY_RUN=0

# Analyse des arguments de la ligne de commande
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        *)
            if [ -z "$REGISTRY_NAME" ]; then
                REGISTRY_NAME="$1"
            fi
            shift
            ;;
    esac
done

# Vérifier si le nom du registre n'est pas nul ou vide
if [ -z "$REGISTRY_NAME" ]; then
    echo "Error: Registry name cannot be null or empty."
    usage
fi

# Vérifier si le registre existe
if ! az acr show --name "$REGISTRY_NAME" &>/dev/null; then
    echo "Error: Registry '$REGISTRY_NAME' not found or you don't have access to it."
    exit 1
fi

echo "Processing Azure Container Registry: $REGISTRY_NAME"
if [ $DRY_RUN -eq 1 ]; then
    echo "DRY RUN: No actual deletions will occur"
fi

# Obtenir la liste des dépôts à partir du registre
repositories=$(az acr repository list --name $REGISTRY_NAME --output tsv)

for repo in $repositories; do
    echo "Processing repository: $repo"

    # Obtenir tous les tags pour le référentiel
    tags=$(az acr repository show-tags --name $REGISTRY_NAME --repository $repo --orderby time_desc --output tsv)

    # Initialise le compteur de tags supprimés
    numeric_count=0

    # Supprimer les images...
    for tag in $tags; do
        if is_numeric "$tag"; then
            ((numeric_count++))

            if [ $numeric_count -gt $RETENTION_COUNT ]; then
                if [ $DRY_RUN -eq 1 ]; then
                    # Pas si dry run = true => on imprime juste un message
                    echo "Would delete tag: $repo:$tag"
                else
                    # Vraiment supprimer l'image
                    echo "Deleting tag: $repo:$tag"
                    az acr repository delete --name $REGISTRY_NAME --image "${repo}:${tag}" --yes
                fi
            fi
        else
            echo "Keeping non-numeric tag: $repo:$tag"
        fi
    done
done
```

L’IA a fait une erreur sur l’implémentation de `--dry-run` lors de sa vérification. En Bash, vous vérifiez un booléen avec :

```bash
if [ $MY_BOOLEAN -eq 1 ]; then
	# faire quelque chose
fi
```

Au début, il m’a dit ce qui suit, ce qui ne correspondait pas une syntaxe Bash correcte :

```bash
if [ "$DRY_RUN" = true ]; then
	# do something
fi
```

## Au-delà d’un script Bash

J’aimerais que cela fonctionne régulièrement sans que j’y pense. Le temps nécessaire pour construire cela vaut-il le coût ?

Le coût d’un registre de conteneurs Premium est-il plus élevé ?

Quelques semaines après ce script Bash initial, j’ai trouvé comment le faire. Je vous donne un indice : _Runbook_.

A suivre…

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Tom Fisk](https://www.pexels.com/photo/aerial-photography-of-container-van-lot-3063470/).
