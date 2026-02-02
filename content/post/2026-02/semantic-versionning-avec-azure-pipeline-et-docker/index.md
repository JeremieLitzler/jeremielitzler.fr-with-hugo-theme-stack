---
title: "Versionnage sémantique avec Azure Pipelines et Docker"
description: "Il s'agit d'une solution, pas de LA solution. Et elle fonctionne très bien comme première étape vers l'automatisation du versionnage sémantique.."
image: 2024-07-24-logos-ms-azure-and-python.jpeg
imageAlt: "Logos de Microsoft Azure et Python"
date: 2026-02-06
categories:
  - Développement logiciel
tags:
  - Azure DevOps
  - Docker
---

Il existe plusieurs façons de gérer les versions d’une application. [JetBrains nomme ses versions logicielles](https://blog.jetbrains.com/blog/2016/03/09/jetbrains-toolbox-release-and-versioning-changes/) `yyyy.r.n.m`, ce qui donne par exemple `2024.1.6.30`.

J’ai moi-même davantage utilisé le [style de version sémantique](https://semver.org/) qu’un style de versionnage.

Dans le cadre d’un projet utilisant Azure Pipelines pour la compilation et Docker pour la création du conteneur déployé, j’ai dû faire face à cette question.

Voici comment j’ai procédé pour versionner mon application.

## Point de départ

Je disposais de ce contrôleur `version` :

```python
from flask import Blueprint, jsonify

version = Blueprint("version", __name__)

version_value = '1.2.6'

@version.route("/", methods=["GET"])
def get_version():
    response = {
        "version": version_value
    }
    return jsonify(response)
```

C’était simple, mais manuel.

J’avais besoin que la version inclue automatiquement la valeur `build` (la quatrième valeur dans la version : `{major}.{minor}.{patch}.{buildId}`) à partir de la compilation exécutée sur le pipeline Azure.

Les valeurs majeures, mineures ou de correctif seraient mises à jour manuellement, conformément aux règles de versionnement sémantique.

La mise à jour de la version a lieu au moment l’on exécute le pipeline création de l’image Docker sur la branche `develop`.

Elle ne devrait pas se produire lorsque la version s’exécute par rapport à la branche `main` ou `release`.

La question :

- où stocker les valeurs majeures, mineures ou de correctif ?
- comment indiquer au contrôleur où obtenir la version complète ?

## Mise à jour du code

J’ai d’abord dû mettre à jour le code Python cité ci-dessus.

Mon idée était d’utiliser un fichier texte dans le même répertoire que le contrôleur.

Le fichier pouvait être vide, mais dans mon cas, j’en ai profité pour l’utiliser comme documentation.

Le contrôleur lirait simplement le contenu et le frontend appelerait le contrôleur pour obtenir la valeur et l’afficher.

Le code a été modifié comme suit :

```python
import os

from flask import Blueprint, jsonify

version = Blueprint("version", __name__)

def get_version_from_file():
    version_file = os.path.join(os.path.dirname(__file__), 'version.txt')
    with open(version_file, 'r') as file:
        return file.read().strip()

@version.route("/", methods=["GET"])
def get_version():
    response = {
        "version": get_version_from_file()
    }
    return jsonify(response)
```

Localement, vous pouvez toujours voir la version affichée avec la valeur écrite dans le fichier.

## Mise à jour du pipeline

Ensuite, quel pipeline mettre à jour ? Pourquoi "quel pipeline" ?

J’ai appris qu’il est préférable de séparer le pipeline de validation des requêtes de tirage (qui exécute les tests unitaires par exemple) du pipeline de compilation d’applications (qui publie l’image Docker compilée dans un registre de conteneurs).

Cela permet d’appliquer le principe de séparation des responsabilités, même si la tâche relève davantage du DevOps que du logiciel.

Le pipeline cible dans cette étape est le pipeline de compilation d’applications.

Dans mon exemple, le pipeline contenait :

- une étape pour définir le nom de l’image Docker, qui est différente selon que je construis sur `develop` ou sur `main` (les détails de cette étape ne sont pas abordés ici)
- une étape pour construire et pousser l’image Docker

Je peux vous dire que nous avons besoin de deux étapes entre les étapes d'origine :

- une étape pour obtenir le numéro de version suivante
- une étape pour mettre à jour la version suivante afin qu'elle soit conservée quelque part.

Pourquoi ? Parce que vous voulez que la valeur de la version soit la même.

Dans le fichier YAML, nous devons séparer les étapes de compilation et de publication. J’ai appris à mes dépens que l’étape intégrée « _Build and Publish_ » ne tenait absolument pas compte des paramètres transmis et ignorait donc toute valeur sans rien signaler.

Dans ce qui suit, je vous partage comment gérer le numéro de version dans Azure DevOps, construire l’image en passant le numéro de version et la publication de l’image.

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
    arguments: --build-arg VERSION=$(setVersionStep.fullVersion)

- task: Docker@2
  displayName: Push image to container registry
  inputs:
    command: push
    repository: $(imageRepository)
    containerRegistry: $(dockerRegistryServiceConnection)
    tags: |
      $(imageTags)
```

Bien sûr, vous pouvez nommer le paramètre comme vous le souhaitez, mais assurez-vous que le nom dans `arguments: --build-arg VERSION=$(setVersionStep.fullVersion)` correspond au nom de la variable dans le `Dockerfile`, dans mon cas `VERSION`.

## Mise à jour du Dockerfile

### Au-delà des bases

Maintenant, le versionnement sémantique dit :

> - La version du correctif Z (x.y.Z | x > 0) DOIT être incrémentée si seules des corrections de bogues rétrocompatibles sont introduites. Une correction de bogue est définie comme une modification interne qui corrige un comportement incorrect.
> - La version mineure Y (x.Y.z | x > 0) DOIT être incrémentée si une nouvelle fonctionnalité rétrocompatible est introduite dans l’API publique. Elle DOIT être incrémentée si une fonctionnalité de l’API publique est marquée comme obsolète. Elle PEUT être incrémentée si de nouvelles fonctionnalités ou améliorations substantielles sont introduites dans le code privé. Elle PEUT inclure des modifications au niveau du patch. La version patch DOIT être réinitialisée à 0 lorsque la version mineure est incrémentée.
> - La version majeure X (X.y.z | X > 0) DOIT être incrémentée si des modifications incompatibles avec les versions antérieures sont introduites dans l’API publique. Elle PEUT également inclure des modifications mineures et des correctifs. Les versions mineures et les correctifs DOIVENT être réinitialisés à 0 lorsque la version majeure est incrémentée.

Nous pouvons donc aller plus loin et dire que :

- si ma branche est nommée `bug/docker-image-not-building`, et contient donc le préfixe `bug`, alors j’augmente la version `patch`.
- si ma branche est nommée `feature/add-awesome-ai-chatbot`, et contient donc le préfixe `feature`, alors j’augmente la version `mineure`.
- si ma branche est nommée `next/generation-api-v2`, et contient donc le préfixe `next`, alors j’augmente la version `major`.

Je suis sûr que c’est possible, mais cela impliquerait de le faire sur le pipeline de Pull Request, car vous avez accès à la branche source.

Une autre option proposée par un de mes collègues consiste à examiner les messages de commit depuis la dernière version :

- si au moins un commit contient `fix`, `refactor`, `chore` ou `style`, je passe à la version `patch`.
- si au moins un commit contient `feat`, je passe à la version `minor`.
- si au moins un commit contient `BREAKING CHANGE`, alors je passe à la version `major`.
- sinon, la version est augmentée (pour une nouvelle documentation, des modifications CI).

Je ne vais pas approfondir ce sujet dans cet article, car je ne l’ai pas encore fait pour le projet d’exemple pour cet article. Dans un prochain article, je vous montrerai comment je m’y suis pris avec un projet Vue, quelques paquets pratiques et GitHub Actions.

### Qu’est-ce qui a changé dans mon fichier Dockerfile ?

J’ai ajouté ce qui suit :

```dockerfile
# After setting timezone...
# Accept VERSION as a build argument
ARG VERSION

# ...

# After getting all sources into the project container...
# Update the version file
RUN echo "Version is <$VERSION>"
RUN echo $VERSION > /project-container/app/modules/version/version.txt
```

où `$VERSION` est un argument transmis à la commande `docker build`.

## Conclusion

Avez-vous appris quelque chose ? Y a-t-il quelque chose qui n’est pas clair ou avez-vous remarqué une faute de frappe ? [Faites-le-moi savoir](https://iamjeremie.me/page/contact-me/) !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
