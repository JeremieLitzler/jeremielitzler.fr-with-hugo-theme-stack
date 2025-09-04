---
title: "Stratégie de balisage des images Docker (requêtes de tirage  vs. intégration continue individuelle)"
description: "En général, nous disposons d’un environnement de QA (assurance qualité) avant de déployer une mise à jour d’application en production. Voyons comment gérer la création d’une image Docker pour chaque environnement dans Azure DevOps."
image: 2025-08-18-a-container-ship-going-towards-the-sunrise.jpg
imageAlt: Un porte-conteneurs naviguant vers le lever du soleil.
date: 2025-09-01
categories:
  - Développement logiciel
tags:
  - DevOps
  - Microsoft Azure
  - Docker
  - Conteneurisation
---

Supposons que vous disposiez :

- d’une API REST Python et que vous utilisiez Docker pour la conteneuriser.
- de deux environnements (production et assurance qualité) sur le nuage Azure Services.
- d’un pipeline DevOps qui crée et transfère l’image Docker vers un registre de conteneurs sur Azure et marque la dernière image avec la balise _latest_.

Ensuite, vous disposez d’une politique de branche DevOps pour déclencher un pipeline de création d’images sur :

- un déclencheur sur _CI individuel_ lorsque quelque chose est poussé vers `main`.
- un déclencheur _Requête de tirage_ (PR dans la suite de l’article pour _Pull Request_) lorsque vous souhaitez fusionner une branche vers `main`.

Avec ce qui précède, DevOps crée une image taguée `latest` sur les deux déclencheurs.

Ne serait-il pas préférable de distinguer les deux builds et de pouvoir tester l’image générée suite au _déclencheur PR_ sur l’environnement QA ?

Oui, ce serait préférable.

Voici comment modifier le pipeline.

## Modifier le pipeline

Pour commencer, définissons le besoin :

- sur un déclencheur de type _PR_, nous voulons pousser une image taguée « ready-for-qa ».
- sur une CI individuelle sur `main` (ce qui a lieu quand on complète une _PR_), nous voulons pousser une image taguée `latest`.

Pour cela, vous devez définir une variable dans le fichier `azure-pipelines.yml` :

```yaml
variables:
  # Variable personnalisée pour identifier un déclencheur de type PR
  isPullRequest: $[eq(variables['Build.Reason'], 'PullRequest')]
```

Vous l’utiliserez dans le script bash qui permet de définir dans quel scénario s’inscrit la génération de l’image.

Dans la section _stages > jobs > steps_, vous devriez avoir une étape :

```yaml
- task: Docker@2
  displayName: Build and push an image to container registry
  inputs:
    command: buildAndPush
    repository: $(imageRepository)
    dockerfile: $(dockerfilePath)
    buildContext: $(projectPath)
    containerRegistry: $(dockerRegistryServiceConnection)
    tags: |
      $(tag)
      latest
```

Modifions cela en trois étapes :

1. Définir la balise de l’image.
2. Créer et pousser une image vers le registre de conteneurs avec la balise `ready-for-qa`.
3. Pousser la balise `latest` pour les builds non-PR.

### Définir la variable de balise d’image

Sous les étapes, ajoutez une nouvelle étape de type `bash` :

```yaml
- task: Bash@3
  displayName: Set image tag
  inputs:
    targetType: "inline"
    script: |
      if [ "$(isPullRequest)" = "True" ]; then
        echo "##vso[task.setvariable variable=imageTag]ready-qa"
      else
        echo "##vso[task.setvariable variable=imageTag]latest,$(Build.BuildId)"
      fi
```

Le script vérifie la variable `isPullRequest`.

Si elle est vraie, il crée et définit une variable `imageTag` sur `ready-for-qa`.

Sinon, il définit la variable sur l’identifiant de build et la balise `latest`.

### Créer et pousser une image vers le registre de conteneurs avec la balise `ready-for-qa`

Cette étape est en fait identique à l’étape d’origine, à l’exception des balises.

Ainsi, au lieu de :

```yaml
tags: |
  $(tag)
  latest
```

We have:

```yaml
tags: |
  $(imageTag)
```

### Créer et pousser la dernière balise pour les builds non-PR

Enfin, voici la dernière étape.

Vous voyez qu’elle est presque identique à l’étape unique d’origine, mais nous avons ajouté une condition pour décider de l’exécuter ou non :

```yaml
condition: and(succeeded(), ne(variables['Build.Reason'], 'PullRequest'))
```

En gros, si la compilation réussit et que `Build.Reason` n’est pas `PullRequest`, alors elle s’exécutera.

Sinon, le pipeline l’ignore.

## Modifier la ressource Container App

Une fois que la balise `ready-for-qa` apparaît dans le registre de conteneurs, il vous suffit de créer une révision de la configuration de votre application conteneurisée dans l’environnement QA.

Dans la section `Image`, sélectionnez l’image et choisissez la balise `ready-to-qa`.

Veillez à cliquer sur _Save_ (Enregistrer) et _Create_ (Créer).

Après quelques minutes, vérifiez le volet _Revisions and replicas_ (Révisions et répliques) sous le volet _Application_ (Application). Si tout est vert, vous pouvez tester votre application.

## Une autre alternative

Bien que cela fonctionne, j’ai mis en place un autre workflow qui s’appuie sur une branche `main` pour les builds de production et `develop` pour les builds d’assurance qualité. Ainsi, nous ne dépendons pas du type de CI (par exemple, `CI individuelle` ou `Pull Request`), mais du nom de la branche.

Vous pouvez lire [cet article décrivant les étapes à suivre pour configurer le pipeline de cette manière](../configure-docker-image-in-azure-devops/index.md).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pixabay](https://www.pexels.com/photo/boat-in-body-of-water-262353/).
