---
title: "Bonnes pratiques DevOps : un exemple d'optimisation avec Azure DevOps"
description: "Un guide étape par étape des bonnes pratiques DevOps pour l'automatisation des déclencheurs de pipeline et des workflows avec un exemple."
image: 2025-12-22-devops-best-practices-a-example-with-azure-devops.svg
imageAlt: "Bonnes pratiques DevOps : un exemple d'optimisation avec Azure DevOps"
date: 2025-12-23
categories:
  - Développement logiciel
tags:
  - Azure DevOps
---

En février dernier, j’ai rencontré un problème. J’ai remarqué que le temps d’exécution de mon pipeline *Pull Request (PR) Validation* avait considérablement augmenté, atteignant près de dix minutes.

De plus, il m’est arrivé que la création de l’image Docker ne tienne pas compte des dernières dépendances et, par conséquent, les tests associés au nouveau code échouaient.

J’ai remarqué que l’étape *Installer les dépendances* était la coupable.

Voyons comment j’ai résolu le problème avec l’aide d’un collègue expert en DevOps.

## La cause

Je n’ai pas trouvé la cause profonde dans mon pipeline *Pull Request (PR) Validation*, mais plutôt là où je construisais l’image Docker.

L’étape en cause dans le deuxième pipeline consistait au script suivant :

```yaml
  - script: |
      python -m pip install --upgrade pip
      pip install -r requirements.txt
    displayName: 'Install dependencies'
```

On n’exécutait pas cette étape sur le pipeline *Pull Request (PR) Validation*, mais qu’une fois que j’avais fusionné le code dans `develop`, lorsque le pipeline créant la nouvelle image Docker s’exécutait.

Un autre problème existait dans la version python de mon pipeline *Pull Request (PR) Validation* :

```yaml
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '>=3.11'
      addToPath: true
```

Ainsi, si nous disposions de Python `3.13`, la compilation pouvait s'exécuter sur une version différente de Python au fil du temps, toujours égale ou supérieure à `3.11`.

Dans le pipeline *Build Image For Deployment*, nous avons strictement utilisé Python 3.11 afin d'éviter tout problème d'incompatibilité entre mon code et les dépendances.

Cela m'amène aux bonnes pratiques DevOps.

## Mais quelles bonnes pratiques ?

Pour garantir un comportement cohérent sur les environnements de développement (votre PC, le mien, un VDI, etc.), les environnements de validation (par exemple, la machine virtuelle sur laquelle Azure DevOps exécute son agent pour exécuter les tests unitaires, qui est le cas d'utilisation présent dans cet article) ou dans les environnements de déploiement (par exemple, QA, production), nous avons besoin d'une base de référence cohérente.

Tout d'abord, dans les étapes problématiques ci-dessus, le pipeline *PR Validation* et le pipeline *Build Image For Deployment* pouvaient utiliser une version différente de Python, ce qui causait des maux de tête en cas de problème, en particulier lors des tests.

De plus, chaque fois que j'ajoutais et utilisais dans le code un nouveau package, le pipeline *PR Validation* échouait car le nouveau code faisait référence au nouveau package et générait une erreur d'exécution. En fait, l'image Docker utilisée dans ce pipeline ne contenait pas encore le nouveau package.

Normalisons donc les images Docker.

## Création du pipeline « Build Image For CI Purposes » (Créer une image à des fins d'intégration continue)

L'objectif était d'exécuter le pipeline sur des déclencheurs qui tiendraient compte des modifications de fichiers indiquant que nous avions besoin d'une nouvelle image Docker.

### Le fichier `Dockerfile`

Tout d'abord, nous avions besoin d'un fichier `Dockerfile` distinct du fichier `Dockerfile` utilisé pour créer l'image de l'application. Ceci afin d'éviter de perturber le pipeline existant. Cependant, nous avons conservé presque tout le contenu.

```yaml
# Ce fichier Docker est utilisé pour optimiser le processus d'intégration continue (CI).
# Il utilise la base que nous utilisons dans le pipeline « Créer une image pour le déploiement ».

# Cela rend Python cohérent.
FROM python:3.11-slim

# Installez d'abord les données relatives au fuseau horaire.
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*

# Ensuite, définissez le fuseau horaire.
ENV TZ=Europe/Zurich
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Définir le répertoire de travail dès le début afin que les chemins restants puissent être relatifs
WORKDIR /project-container

# Ajout du fichier d'exigences au répertoire actuel, par exemple /app.
# Seulement ce fichier dans un premier temps afin de mettre en cache l'étape d'installation pip lorsque le code change.
COPY requirements.txt .

# Installer les dépendances
RUN pip install -r requirements.txt
```

Si vous avez lu [mon article initial sur le déploiement d'une application Python](../../2024-08/deployer-une-api-rest-python-sur-microsoft-azure/index.md), vous remarquerez que j'ai simplement supprimé tout le code spécifique à l'application que nous déployons.

### Créer le nouveau pipeline

Nous ajoutons ensuite la nouvelle définition du pipeline dans le dossier `.azure-pipelines`. Je vais vous expliquer étape par étape les ajouts que j’ai apportés au code YAML. Je suis parti de la section *Build Image For Deployment* (créer une image pour le déploiement). Pour le reste, veuillez vous reporter à mon article cité ci-dessus.

L’objectif était de créer une image non seulement pour l’assurance qualité ou la production, mais aussi lorsque nous avions des changements de dépendances dans l’application afin de pouvoir exécuter de nouveaux tests unitaires avec les dernières dépendances.

Voici les détails.

Tout d’abord, nous ne déclenchons le pipeline que si le fichier `requirements.txt`, `/docker/Dockerfile.ci` ou `/.azure-pipelines/ap-build-ci-container.yml` est modifié. En fait, l’image ne change que lorsque j’ajoute une dépendance ou que je modifie le pipeline ou le fichier `Dockerfile`.

```yaml
name: Build_Image_For_CI_Purposes
trigger:
  paths:
    include:
      # Voici les chemins absolus vers les fichiers
      # à la racine du projet
      - 'requirements.txt'
      - '/docker/Dockerfile.ci'
      - '/.azure-pipelines/ap-build-ci-container.yml'
```

Ensuite, mettons à jour la variable `imageRepository` avec un nom distinct des images pour le déploiement. C’est là que nous stockerons les images utilisées à des fins d’intégration continue **uniquement**.

```yaml
variables
  - name: imageRepository
    value: 'myapp-ci'
```

Ensuite, nous devons spécifier qu’on utilise le nouveau fichier `Dockerfile`.

```yaml
variables:
  - name: dockerfilePath
    value: '$(Build.SourcesDirectory)/docker/Dockerfile.ci'
```

J’ai supprimé la variable `semantic-version`, car nous n’en avons pas besoin dans l’image Docker que nous configurons.

C’est dans l’étape *Build and push* que nous trouvons les changements les plus importants.

Tout d’abord, nous supprimons la version sémantique, qui n’est pas nécessaire ici, mais nous la conservons pour l’autre pipeline qui se charge de créer l’image que nous déployons en QA ou en production. 

Par conséquent, la tâche *Set version and image tags* est renommée *Set image tags* et le code exécuté devient :

```yaml
            displayName: Set image tags
            inputs:
              targetType: 'inline'
              script: |
                if [ "$(Build.SourceBranch)" = "refs/heads/develop" ]; then
                  # Update build number for develop branch
                  echo "##vso[task.setvariable variable=build;isOutput=true]$(Build.BuildId)"
                  echo "##vso[task.setvariable variable=imageTags]ready-qa"
                  echo "imageTag is <ready-qa>"
                elif [ "$(Build.SourceBranch)" = "refs/heads/main" ]; then
                  echo "##vso[task.setvariable variable=imageTags]$(Build.BuildId),latest"
                  echo "imageTag is <latest>"
                else
                  echo "Build.SourceBranchName = <$(Build.SourceBranchName)>"
                  echo "Build.SourceBranch = <$(Build.SourceBranch)>"
                  # IMPORTANT:
                  # If branch naming convention changes, make sure to update ap-validate-pr-with-custom-image.yml too
                  echo "##vso[task.setvariable variable=imageTags]branch-$(echo "$(Build.SourceBranch)" | tr '/#' '-')"
                  echo "imageTag is <branch-$(Build.SourceBranch)>" 
                fi
            name: setImageTagsStep
```

En gros,

- Si `$(Build.SourceBranch)` est `develop`, alors la balise d’image est `ready-qa`.
- Si `$(Build.SourceBranch)` est `main`, alors la balise d’image est `latest`.
- Sinon, nous sommes sur une branche de développement et la balise d’image est donc `branch-[nom de la branche]`.

Rappel : le pipeline s’exécute **UNIQUEMENT** si le déclencheur trouve une modification sur les fichiers listés dans le déclencheur. Une nouvelle fonctionnalité, qui ne déclenche pas le pipeline lorsque vous poussez la branche associée vers le référentiel distant, ne déclenchera pas de mise à jour de l’image lorsque vous fusionnerez la fonctionnalité vers `develop` ou `main`.

La dernière modification apparaît dans la tâche de génération, où nous supprimons les arguments passés à la commande de génération contenant la valeur de version sémantique.

```yaml
              arguments: --build-arg VERSION=$(setVersionStep.fullVersion)
```

Enfin, nous conservons la tâche *Push image to container registry* telle quelle.

## Tester le nouveau pipeline

Tout d’abord, vous devrez peut-être fusionner dans `develop` et `main` pour ajouter le pipeline à Azure DevOps. Et, si Azure DevOps le détecte pas automatiquement, suivez ces étapes :

- Sélectionnez deux fois l’onglet « Pipelines » et cliquez sur « Nouveau pipeline ».
- Sélectionnez *Azure Repos Git*.
- Sélectionnez le référentiel qui contient votre fichier YAML.
- Sélectionnez *Fichier YAML Azure Pipelines existant*.
- Sélectionnez le fichier dans la branche « develop ».
- Enregistrez pour terminer.

{{< blockcontainer jli-notice-note "">}}

J’écris cet article un an après les faits, et même si j’ai pris beaucoup de notes, j’ai un doute sur le point ci-dessus.

{{< /blockcontainer >}}

Ensuite, pour le tester, vous devez pousser une nouvelle branche vers le référentiel avec une modification dans `requirements.txt` (un espace supplémentaire ou un commentaire suffira). Cela devrait déclencher le nouveau pipeline.

Une fois la compilation terminée, vous devriez voir un nouveau référentiel `myapp-ci` dans le *Azure Container Registry (ACR)* avec une image taguée `branch-[nom de votre branche]`.

## Mettre à jour le pipeline *PR Validation*

Maintenant que nous disposons d’une image Docker, nous pouvons mettre à jour le pipeline *PR Validation* afin d’utiliser l’image appropriée du référentiel ACR `myapp-ci`.

Je vous explique tout en détail dans ce qui suit.

### Nouvelles variables

Commencez par ajouter de nouvelles variables qui permettent d’extraire l’image cible :

```yaml
  - name: dockerRegistryServiceConnection
    value: '[uid of dockerRegistryServiceConnection in DevOps]'
```

devient :

```yaml
  # ARM = Azure Resource Manager type of service connection
  - name: armAppRegistration
    # Azure DevOps identifier, not a Azure Resource identifier
    value: '[app registration Id]' 
```

Cela est nécessaire dans la première étape du pipeline de mise à jour *PR Validation*. En effet, une étape supplémentaire est nécessaire pour lire le registre d’image via l’interface CLI Azure.

### Nouvelle étape

Nous avons besoin d’une nouvelle étape contenant une étape de type *script `AzureCLI`* qui nous aidera à assigner la variable contenant la balise d’image à utiliser.

Le script est simplement un script `bash` qui analyse la sortie de la requête de l’interface CLI Azure.

```yaml
stages:
  - stage: PreTestsSteps
    displayName: Pre-Tests Steps
    jobs:
      - job: SetContainerTag
        displayName: Set the container tag to use in unit tests
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: '$(armAppRegistration)'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                #!/bin/bash
                echo "System.PullRequest.SourceBranch = <$(System.PullRequest.SourceBranch)>"
                echo "Normalize the TAG_NAME..."
                # IMPORTANT:
                # If branch naming convention changes, make sure to update ap-build-ci-container.yml as well
                TAG_NAME="branch-$(echo "$(System.PullRequest.SourceBranch)" | tr '/#' '-')"
                echo $TAG_NAME
                REGISTRY_NAME="$(containerRegistry)"
                REPOSITORY_NAME="$(imageRepository)"
                
                if az acr repository show-tags --name $REGISTRY_NAME --repository $REPOSITORY_NAME --output tsv | grep -q "^$TAG_NAME$"; then
                  echo "Tag $TAG_NAME exists in repository $REPOSITORY_NAME"
                  echo "##vso[task.setvariable variable=imageTag;isOutput=true]$TAG_NAME"
                else
                  echo "Tag $TAG_NAME does not exist in repository $REPOSITORY_NAME"
                  echo "##vso[task.setvariable variable=imageTag;isOutput=true]ready-qa"              
                fi
            name: setImageTag
            displayName: 'Set image tag'
            condition: always() # Continue even if it fails
```

Ensuite, nous utilisons la variable `imageTag` dans l’étape suivante :

```yaml
    jobs:
      - job: ExecuteUnitTests
        displayName: Execute Unit Tests
        pool:
          vmImage: 'ubuntu-latest'
        # Initialiser le conteneur à utiliser dans la tâche à partir de l'étape précédente.
        container:
          image: "$(containerRegistry)/$(imageRepository):$(imageTag)"
          endpoint: mycontainerregistry.azurecr.io
        # Exécutez ensuite les étapes du travail (rien ne change à partir de ce stade).
        steps:
        # ...
```

## Tester le pipeline mis à jour

Pour tester, vous devrez peut-être d’abord fusionner avec `develop` et vérifier que l’image appropriée est correctement extraite et que les tests unitaires s’exécutent sans problème.

Essayez avec et sans modification des trois fichiers marqués comme déclencheurs pour valider l’ensemble du processus.

## Conclusion

Désormais, votre processus de requêtes de tirage gère à la fois les développements qui modifient les dépendances ou la CI, et ceux qui ne le font pas.

Grâce à cela, vous n’avez plus à vous soucier d’exécuter des tests unitaires sur une image Docker obsolète ni à penser à préparer l’image avant cela.

En prime, vous ne créez de nouvelles images Docker à jour que lorsque *cela est nécessaire*. La prochaine étape logique serait de [mettre à jour le compte d’automatisation](../../2025-03/retention-personnalisee-d-images-docker-sur-azure//index.md) qui nettoie le référentiel des images obsolètes. En êtes-vous capable ? J’en suis sûr !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}