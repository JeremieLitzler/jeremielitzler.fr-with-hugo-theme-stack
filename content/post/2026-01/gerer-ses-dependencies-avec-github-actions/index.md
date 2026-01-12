---
title: "Comment gérer les dépendances JavaScript avec GitHub Actions"
description: "La mise à jour des dépendances peut s'avérer difficile et fastidieuse sur un projet JavaScript. GitHub Actions peuvent vous aider à l'automatiser."
image: 2026-01-05-steel-cogs.jpg
imageAlt: Pignons en acier
date: 2026-01-09
categories:
  - DevOps
tags:
  - GitHub
  - Intégration Continue
---

En utilisant _Dependabot_ pour les mises à jour des paquets `npm`, vous pouvez automatiser la mise à jour de vos dépendances plus efficacement.

Pour cela, vous devez créer un fichier `dependabot.yml` dans un répertoire `.github` à la racine du projet dans votre référentiel de code. Voici comment le configurer.

## Créer le fichier

Pour commencer à utiliser les mises à jour de version des packages JavaScript avec _Dependabot_, vous devez spécifier l’écosystème de packages à mettre à jour et l’emplacement du manifeste dans votre projet.

Créez donc un fichier `.github/dependabot.yml` et définissez la configuration minimale :

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
```

Cette configuration :

- Utilise la version 2 de la syntaxe _Dependabot_
- Surveille les packages `npm` dans `package.json` situé dans le répertoire racine
- Vérifie quotidiennement les mises à jour et crée une PR sur votre référentiel de code si un package doit être mis à jour

Mais ce n’est pas ce que vous utiliseriez.

J’utilise une configuration personnalisée, alors regardons mon exemple de configurations avancées, qui fonctionne bien si vous avez suivi les [étapes de cet article précédent](../configurer-etapes-ci-avec-github/index.md).

## Configuration avancée

Dans mon modèle de projet _Vue et Supabase_, j’ai configuré mon fichier `dependabot.yml` comme suit :

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    # Dossier où se trouve le `package.json`
    directory: "/"
    # Fournir une mise à jour hebdomadaire par e-mail et créer le
    # communiqué de presse en fonction des résultats de
    # dependatbot. Je pense qu'un intervalle hebdomadaire est idéal
    # pour éviter d'être submergé par des notifications quotidiennes.
    schedule:
      interval: "weekly"
    # Ajoutez des étiquettes aux pull requests pour identifier
    # les PR de Dependabot.
    labels:
      - "npm dependencies"
    # Autorisez jusqu'à 5 pull requests ouvertes pour limiter le #
    # nombre de PR ouvertes.
    # Je pense que cela permet d'éviter d'avoir autant de PR que
    # vous avez de dépendances dans votre projet, qui peuvent être
    # nombreuses lorsque vous travaillez sur un projet
    # JavaScript...
    open-pull-requests-limit: 5
```

Lorsqu’une mise à jour d’un package existe, `dependabot` crée une branche et soumet une nouvelle PR pour fusionner la mise à jour dans `develop`, si vous avez suivi les [étapes de cet article précédent](../../2025-12/configure-ci-steps-with-github/index.md).

Par conséquent, il exécutera également le CI pour vérifier que le projet compile toujours avec la nouvelle version du package mis à jour.

## Vous souhaitez en savoir plus ?

Consultez [la documentation pour toutes les options de configuration](https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file). Vous y trouverez peut-être ce que vous recherchez pour vos besoins spécifiques.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pixabay](https://www.pexels.com/photo/gray-scale-photo-of-gears-159298/).
