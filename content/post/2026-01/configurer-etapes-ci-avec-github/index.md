---
title: "Configurer des étapes d'intégration continue avec GitHub"
description: "Nous appelons ces étapes « GitHub Actions » ; elles permettent d'améliorer et d'automatiser vos workflows."
image: 2025-12-29-steel-cogs.jpg
imageAlt: Pignons en acier
date: 2026-01-02
categories:
  - DevOps
tags:
  - GitHub
  - Intégration Continue
---

Au début de l’année dernière, j’ai travaillé sur un modèle de projet basé Vue et Supabase, et j’ai pensé qu’il serait judicieux d’automatiser certaines étapes, comme le recommande la communauté en matière de bonnes pratiques.

Je vais en décrire deux afin de montrer comment utiliser les actions GitHub pour effectuer ces étapes automatiquement lorsqu’un événement déclencheur se produit sur mon référentiel de code.

## L’action « Vérifier que le code compile »

Souvent, nous mettons en œuvre une bonne pratique consistant à automatiser la vérification que le code poussé vers un référentiel de code fonctionne pour tout le monde.

Ainsi, lorsqu’un programmeur soumet une requête de tirage pour fusionner ses modifications de code dans la branche `develop` et pour garantir que sa branche se compile avec succès, nous déclenchons automatiquement une compilation et la commande de compilation appropriée pour le projet est exécutée.

Dans mon projet, je dois exécuter `npm run build`.

### Le déclencheur

Dans GitHub Actions, vous définissez le déclencheur comme suit.

```yaml
on:
  pull_request:
    branches:
      - develop
    types: [opened, synchronize, reopened]
```

Il cible la branche `develop` dans le contexte d’une requête de tirage. Il ne se déclenche que sur les requêtes de tirage ouvertes ou réouvertes.

Il se déclenche également lorsque du nouveau code est poussé vers la branche `feature` uniquement lorsqu’une requête de tirage existe entre cette branche et `develop`. Ce dernier cas d’utilisation se produit souvent lorsque les développeurs examinent mutuellement leur code et suggèrent des ajustements dans le code.

### Les étapes

Ensuite, nous définissons les étapes à exécuter :

1. L’étape **_Checkout code_** extrait le code du référentiel dans le processus d’exécution.
2. L’étape **_Configurer Node.js_** installe la dernière version LTS de Node.js et active la mise en cache `npm` pour des installations plus rapides.
3. L’étape **_Installer les dépendances_** installe tous les paquets `npm` requis à l’aide de `npm ci` pour une configuration propre et reproductible.
4. L’étape **_Exécuter la compilation_** exécute le processus de compilation du projet à l’aide de `npm run build`.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run build
        run: npm run build
```

### Comment tester

Créez un fichier YAML `pr-build.yml` contenant les extraits décrits ci-dessus dans un dossier `.github/workflows` à la racine de votre projet.

Ensuite, poussez la branche de fonctionnalité et créez une requête de tirage. Cela devrait déclencher l’action GitHub.

## L’action « Créer une version sémantique »

Ce processus nécessite une configuration plus complexe, mais je vais vous guider pas à pas, comme d’habitude.

{{< blockcontainer jli-notice-tip "Abonnez-vous !">}}

J’ai prévu un article sur le sujet des versions sémantiques en février 2026. Il complétera bien cette action GitHub.

{{< /blockcontainer >}}

Pour l’instant, permettez-moi de commenter les parties importantes du code YAML ci-dessous :

```yaml
# release.yml
name: Automatic Release
run-name: ${{ github.actor }} is automatically releasing 🚀

on:
  # L'action GitHub s'exécutera automatiquement lors des commits
  # vers la branche principale, par exemple lorsque vous fusionnez
  # une requête de tirage de la branche develop vers la branche
  # principale.
  # Cela suppose que les branches develop et main sont protégées,
  # ce qui signifie que vous ne pouvez pas pousser directement vers
  # ces branches sans passer par une pull request.  push:
  branches:
    - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    environment:
      # Il s'agit du nom de votre environnement créé
      # sous https://github.com/{user}/{repo_name}/settings/environments/.
      # Le nom doit correspondre au code YAML et aux paramètres.
      name: CI
    steps:
      # À l'aide des variables secrètes d'environnement définies
      # sous https://github.com/{user}/{repo_name}/settings/environments/,
      # nous générerons un jeton utilisé pour permettre à l'étape
      # de publication sémantique de modifier le fichier
      # CHANGELOG.md lors de la création de la publication
      # (voir l'étape « Publication sémantique » ci-dessous).      - name: "Generate token"
        id: generate_token
        uses: tibdex/github-app-token@v1
        with:
          app_id: ${{ secrets.GH_APP_ID }}
          private_key: ${{ secrets.GH_APP_KEY }}
      # Consultez le code pour pouvoir exécuter la création de
      # la version, car cela nécessite certains paquets npm.
      - name: Checkout
        uses: actions/checkout@v4
        with:
          persist-credentials: false
          fetch-depth: 0
          ref: ${{ github.event.pull_request.base.ref }}
      # Installer Node LTS
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          cache: "npm"
      # S'assurer que toutes les dépendances sont correctes et
      # installées, en particulier les paquets de publication
      #sémantique.
      - name: "Installing dependencies"
        run: npm ci
      - name: "Verifying the signatures"
        run: npm audit signatures
      # Exécuter la création de version semantique
      - name: Semantic Release
        uses: cycjimmy/semantic-release-action@v4
        # Nous utilisons ici le jeton généré lors de la première étape.
        env:
          GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
```

Abonnez-vous pour connaître tous les détails nécessaires à la mise en place sur le projet le versionning sémantique et à sa configuration selon vos besoins. L’article est **prévu pour le 9 février 2026**.

## Conclusion

Vous pouvez aller beaucoup plus loin avec les GitHub Actions, mais c’est déjà un bon début !

Et vous, à quoi vous sert GitHub Actions dans vos tâches quotidiennes ?

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pixabay](https://www.pexels.com/photo/gray-scale-photo-of-gears-159298/).
