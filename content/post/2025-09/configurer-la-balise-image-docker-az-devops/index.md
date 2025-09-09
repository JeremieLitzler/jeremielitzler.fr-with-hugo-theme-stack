---
title: "Configurer la balise d’image Docker dans Azure DevOps"
description: "En général, nous disposons d’un environnement d’assurance qualité avant de passer à la production. Voyons comment gérer le balisage des images Docker dans le registre de conteneur avec Azure DevOps."
image: 2025-08-11-a-man-jumping-on-a-container.jpg
imageAlt: Un homme sautant sur un conteneur
date: 2025-09-02
categories:
  - Développement logiciel
tags:
  - DevOps
  - Microsoft Azure
  - Docker
  - Conteneurisation
---

Supposons que vous disposiez :

- d’une API REST Python et que vous utilisiez Docker pour la conteneuriser.
- de deux environnements (production et assurance qualité) sur le Cloud Azure.
- un pipeline Azure DevOps qui génère et pousse l’image Docker de votre application vers un registre de conteneurs sur Azure et marque la dernière image avec la balise `latest`.

Ensuite, vous mettez en place une politique de branche sur Azure DevOps pour déclencher une génération d’image sur un déclencheur `Individual CI`, lorsque quelque chose est poussé vers `main` ou `develop` (via une requête de tirage, par exemple).

Avec ce qui précède, Azure DevOps crée une image marquée `latest` sur les deux déclencheurs.

Ne serait-il pas préférable de distinguer les deux images Docker créées et de pouvoir tester l’application générée à partir de la branche `develop` sur l’environnement d’assurance qualité ?

Oui, ce serait préférable.

Voici comment modifier le pipeline.

## Modifier le pipeline

Pour commencer, définissons le besoin :

- sur une demande de fusion ou une CI individuelle vers `develop`, nous voulons pousser une image taguée `ready-for-qa`.
- sur une demande de fusion ou une CI individuelle sur `main`, nous voulons pousser une image taguée `latest`.

### Le déclencheur

Tout d’abord, vous devez définir le déclencheur dans le fichier `azure-pipelines.yml` :

```yaml
trigger:
  branches:
    include:
      - main
      - develop
```

### Évaluer la balise d’image

Ensuite, évaluons la balise d’image. Vous l’utiliserez dans le script `bash`.

Sous l’étape `Build and push` (générer et pousser), ajoutez une tâche `Build` et une étape `bash` dans laquelle vous évaluez la balise du conteneur :

```yaml
- task: Bash@3
  displayName: Set image tags
  inputs:
    targetType: "inline"
    script: |
      if [ "$(Build.SourceBranch)" = "refs/heads/develop" ]; then
        echo "##vso[task.setvariable variable=imageTags]ready-qa"
      elif [ "$(Build.SourceBranch)" = "refs/heads/main" ]; then
        echo "##vso[task.setvariable variable=imageTags]$(Build.BuildId),latest"
      else
        echo "##vso[task.setvariable variable=imageTags]$(Build.BuildId)"
      fi

  name: setImageTagsStep
```

On utilise la variable `$(Build.SourceBranch)` pour déterminer la balise de l’image selon les conditions énumérées ci-dessus.

### Générer et pousser vers le registre de conteneurs

Modifions ensuite les étapes suivantes pour générer et envoyer l’image vers le registre de conteneurs avec la balise d’image évaluée :

```yaml
- task: Docker@2
  displayName: Build image
  inputs:
    command: build
    repository: $(imageRepository)
    dockerfile: $(dockerfilePath)
    buildContext: $(projectPath)
    containerRegistry: $(dockerRegistryServiceConnection)
    tags: |
      $(imageTags)

- task: Docker@2
  displayName: Push image to container registry
  inputs:
    command: push
    repository: $(imageRepository)
    containerRegistry: $(dockerRegistryServiceConnection)
    tags: |
      $(imageTags)
```

Je sépare les commandes `build` et `push` car, si vous créez un conteneur et lui transmettez un numéro de version d’application, la phase de création prendra en compte un argument avec la version calculée. L’étape `buildAndPush` fournie par Azure n’autorise pas les arguments.

Je vous démontrerai cela dans un prochain article.

## Conclusion

Cette approche peut varier selon vos besoins. Pour moi, elle me plaît et je la préfère à celle décrite [dans ce précédent article](../strategie-de-balisage-des-images-docker-pr-vs-ci/index.md).

Si vous avez aimé mon article…

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Kaique Rocha](https://www.pexels.com/photo/man-jumping-on-intermodal-container-379964/).
