---
title: "Rebase vs. Merge avec Git"
description: "Comprendre ces deux concepts vous aidera à savoir quand utiliser l’un ou l’autre avec Git."
image: 2026-01-12-a-forest-with-trees.jpg
imageAlt: Une forêt avec des arbres
date: 2026-01-16
categories:
  - Développement logiciel
tags:
  - Git
---

J’avais besoin de comprendre les deux méthodes, car j’ai toujours utilisé la méthode de `merge`, pensant que la méthode `rebase` n’était pas efficace ou dangereuse. En tout cas, c’est ce que j’avais lu.

Mais la vérité est plus nuancée.

Le choix entre `rebase` et `merge` dépend de nos besoins spécifiques et de notre flux de travail. Passons donc en revue les avantages de chaque méthode.

## Avantages du rebase

La première chose que vous apprenez à propos du `rebase`, c’est qu’il crée un historique de validations plus propre et linéaire. En fait `rebase` permet de réécrire l’historique.

Enfin, il élimine les validations de fusion _inutiles_, vous savez, les messages « _Merged PR xxxx into develop_ » qui apparaissent après avoir fusionné une branche de fonctionnalité dans `develop`.

## Avantages de la fusion

Tout d’abord, la méthode « merge » préserve l’historique complet du dépôt Git. Cela facilite ainsi le suivi de la mise en œuvre des fonctionnalités dans ce dépôt.

Elle facilite également la résolution des conflits, même si j’ai appris à effectuer un `rebase` sans difficulté du point de vue de la résolution de conflits.

Ensuite, il est plus facile d’annuler les modifications en cas d’erreur.

Enfin, elle conserve des horodatages précis des validations.

## Quand utiliser rebase

La principale raison pour laquelle j’ai vu jusqu’à présent l’utilisation de `rebase` est de conserver un historique de projet propre et linéaire.

De plus, lorsque vous traitez des modifications plus petites et ciblées qui doivent être intégrées proprement, vous pouvez utiliser `rebase`. J’ai examiné l’historique des validations de plusieurs projets open source et je n’ai vu dans aucun d’entre eux de message de commit « **Merged PR xxxx into develop** ».

## Quand utiliser Merge

Bien qu’il soit recommandé de ne pas avoir de branches à longue durée de vie, l’utilisation de `merge` est une meilleure option dans ce scénario.

De plus, lorsque plusieurs développeurs collaborent sur la même branche, cette méthode facilite le travail. Encore une fois, cela dépend vraiment de votre contexte. Dans une équipe travaillant sur des fonctionnalités distinctes, chaque individu devrait presque toujours travailler sur une branche distincte, spécifique à une fonctionnalité ou à une correction de bug données.

De plus, la commande `merge` ne réécrit pas l’historique, contrairement à la commande `rebase`. Utilisez-la donc lorsque vous devez conserver l’historique exact.

Certains affirment, j’étais l’un d’eux, que la commande `merge` facilite la résolution des conflits. Je pense toutefois que vous pouvez résoudre facilement les conflits avec la commande `rebase` en utilisant `squash` sur votre branche de fonctionnalité.

Cela s’applique lorsque vous souhaitez mettre à jour votre branche de fonctionnalité qui est en retard par rapport à `develop`. Oui, utilisez `squash` pour combiner plusieurs validations en un seul.

Si vous souhaitez vraiment conserver vos validations atomiques, si vous utilisez cette méthode de validation, alors oui, la fusion de `develop` dans votre branche de fonctionnalité peut être plus difficile à résoudre en cas de conflits. Cependant, les validations atomiques ne signifient pas une validation par fichier, comme je le croyais il y a quelques années.

## Recommandations de bonnes pratiques

En cas de doute, il est recommandé d’utiliser le `merge` plutôt que le `rebase` en raison de son risque moindre et de ses options de récupération plus faciles. Cependant, si vous travaillez seul sur une branche de fonctionnalité et que vous ne l’avez pas encore poussée vers le dépôt distant, envisagez d’effectuer un `rebase` pour nettoyer vos validations avant de créer la requête de tirage.

N’oubliez pas que les deux approches intégreront correctement vos modifications. La principale différence réside dans la manière dont vous souhaitez que l’historique du projet s’affiche et comment les conflits sont gérés.

## Exemples pratiques

Je vais vous présenter une série d’exemples couvrant les différents cas d’utilisation de `rebase` et de `merge`, en partant des hypothèses suivantes :

- nous travaillons sur un dépôt de code Git simple, avec un seul fichier texte
- nous voulons émuler une grande équipe avec un développement parallèle des fonctionnalités
- nous voulons tester une restauration

### Configuration initiale

```bash
# Créer et initialiser le dépôt
mkdir git-demo && cd git-demo
git init
echo "Initial content" > file.txt
git add file.txt
git commit -m "Initial commit"
```

### Scénario 1 : Développement d’une fonctionnalité

```bash
# Créer et passer à la branche de fonctionnalité
git checkout -b feature/simple-scenario
echo "Feature A content" >> file.txt
git commit -am "Add feature A"

# Pendant ce temps, la branche principale est mise à jour (simulant le travail d'équipe).
# Bien sûr, on ne pousse JAMAIS directement sur develop...
git checkout develop
echo "Hotfix content" >> file.txt
git commit -am "Add hotfix"

# Quelque chose se passe sur la page principale
git checkout develop
git pull

# Approche Rebase (recommandée pour les branches de fonctionnalités)
git checkout feature/simple-scenario
# Rewrite the history, no "merge" commit
git rebase develop

# Alternative : approche avec un merge
git checkout feature/simple-scenario
# Cela crée un commit « Merged feature/simple-scenario from develop ».
git merge develop
```

### Scénario 2 : Développement parallèle des fonctionnalités

```bash
# Créer deux entités parallèles
git checkout develop
git checkout -b feature/parallel-1
echo "Feature B content" >> file.txt
git commit -am "Add feature B"

git checkout develop
git checkout -b feature/parallel-2
echo "Feature C content" >> file.txt
git commit -am "Add feature C"

# Fusionner d'abord feature/parallel-1 (simulation de fusion PR)
git checkout develop
git merge --no-ff feature/parallel-1

# La fonctionnalité feature/parallel-2 doit maintenant être mise à jour.
git checkout feature/parallel-2
git rebase develp
```

### Scénario 3 : Rebase interactif pour le nettoyage

```bash
# Créer une fonctionnalité avec de nombreux validations
git checkout -b feature/with-many-validations
echo "Feature: Basic reporting" >> file.txt
git commit -am "WIP: Start reporting"
echo "Feature: Advanced reporting" >> file.txt
git commit -am "Fix typo"
echo "Feature: Report export" >> file.txt
git commit -am "Actually add reporting feature"
echo "Feature: Report scheduling" >> file.txt
git commit -am "Oops forgot this part"

# Nettoyage avec rebase interactif
# Cela combine tous les validations en un seul commit propre.
git rebase -i HEAD~4
# Dans l'éditeur qui s'ouvre, marquez les validations comme `squash`, sauf le premier.
# puis reformulez les messages de commit pour en garder un seul

# Après le nettoyage, fusionnez avec `develop`.
git checkout develop
git merge feature/with-many-validations
```

### Scénario 4 : Revenir en arrière avec fusion

```bash
# Créer une fonctionnalité et la fusionner
git checkout develop
git checkout -b feature/bad-feature
echo "Bad feature content" >> file.txt
git commit -am "Add bad feature"
git checkout develop
git merge --no-ff feature/bad-feature

# Create new feature from reverted develop
git checkout -b feature/fixed-feature
# Annuler la fusion
git revert -m 1 HEAD
git merge --no-ff feature/fixed-feature
```

### Scénario 5 : Revenir en arrière avec Rebase

Il existe trois variantes possibles :

#### Méthode A : Effectuer un `rebase` interactif pour supprimer des validations

```bash
# Setup: Create and merge a feature we'll want to revert
git checkout develop
git checkout -b feature/bad-feature
echo "Feature: Problematic feature" >> file.txt
git commit -am "Add problematic feature"
git checkout develop
git merge feature/bad-feature

# Add more work after the bad feature
echo "Feature: Good feature after bad" >> file.txt
git commit -am "Add good feature"

# Now we want to remove the bad feature using rebase
# Use interactive rebase to drop the bad commit
git rebase -i HEAD~2

# In editor, delete the line with "Add problematic feature" or mark it as 'drop'
# Save and exit
# Manually fix any conflicts if they arise
# The bad feature commit is now removed from history
```

Lorsque la fonctionnalité n’a pas été poussée vers un référentiel partagé, ou si votre équipe a convenu de réécrire l’historique, cette méthode peut être utilisée.

#### Méthode B : Effectuer un `rebase` sur un point antérieur

```bash
# Point de départ
git checkout develop
echo "Before bad feature" >> file.txt
git commit -am "Commit before bad feature"

GOOD_COMMIT=$(git rev-parse HEAD)

echo "Bad feature content" >> file.txt
git commit -am "Bad feature we want to remove"

echo "Another commit" >> file.txt
git commit -am "Commit after bad feature"

# Créer la branche temporaire à la position courante dans l'historique
git branch temp-current

# Réinitialiser avant le mauvais commit
git reset --hard $GOOD_COMMIT

# Sélectionner les validations que nous voulons conserver
git cherry-pick temp-current

# En cas de conflits, résolvez-les.

# Supprimer la branche temporaire
git branch -D temp-current
```

Cette variante vous aide à supprimer un commit spécifique tout en conservant tout le reste, en particulier dans le cas d’un historique complexe.

#### Méthode C : Effectuer un `rebase` avec `--onto` pour supprimer les validations intermédiaires

```bash
# Point de départ
git checkout develop
echo "Commit A" >> file.txt
git commit -am "Commit A"

echo "Bad feature start" >> file.txt
git commit -am "Bad commit 1"

echo "Bad feature continue" >> file.txt
git commit -am "Bad commit 2"

BAD_END=$(git rev-parse HEAD) # Bad commit 2

echo "Good commit after" >> file.txt
git commit -am "Good commit after bad feature"

# Trouver le commit avant les mauvais validations
BAD_START=$(git rev-parse HEAD~3)  # Commit A

# Rebase pour supprimer les validations incorrects
# Syntaxe : git rebase --onto <nouvelle-base> <ancienne-base> <branche>
# Cela signifie : prendre les validations après BAD_END et les rejouer sur BAD_START
git rebase --onto $BAD_START $BAD_END
```

Nous utilisons `--onto` lorsque vous avez besoin d’une précision chirurgicale pour supprimer une série de validations au milieu de votre historique.

### Scénario 6 : Effectuer un `rebase` complexe avec conflits

```bash
# Créer des modifications conflictuelles
git checkout develop
git checkout -b feature/parallel-work
echo "Feature edits line 1" >> file.txt
git commit -am "Feature D change 1"

git checkout develop
echo "develop edits line 1" >> file.txt
git commit -am "develop change 1"

# Résolution avec rebase
git checkout feature/parallel-work
git rebase develop

# En cas de conflits :
# 1. Résolvez les conflits dans le fichier file.txt.
# 2. git add file.txt
# 3. git rebase --continue
```

C’est le cas où, si vous avez beaucoup de validations sur la branche `feature/parallel-work` et beaucoup de validations sur la branche `develop` non reportés sur `feature/parallel-work`, qu’un `rebase` peut être difficile, car plusieurs validations sur chaque branche peuvent toucher à de mêmes fichiers.

Exécuter un `squash` de certains ou tous les validations sur `feature/parallel-work` aidera grandement à résoudre les conflits.

Quand j’ai commencé à utiliser `rebase`, j’avais l’impression de résoudre le même conflit vraiment trop de fois.

### Règles importantes

1. Ne jamais réaliser de `rebase` les branches sur lesquelles d’autres personnes travaillent.
2. Toujours utiliser `-no-ff` pour les fusions de fonctionnalités importantes.
3. Créer des messages de validation significatifs.
4. **Toujours** tester après un `rebase` ou un `merge`.

## Sources

Voici quelques articles et fils de discussion que j’ai consultés sur le sujet. Prenez le temps de les lire également.

1. [https://www.tempertemper.net/blog/git-rebase-versus-merge](https://www.tempertemper.net/blog/git-rebase-versus-merge)
2. [https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)
3. [https://stackoverflow.com/questions/804115/when-do-you-use-git-rebase-instead-of-git-merge/64319712](https://stackoverflow.com/questions/804115/when-do-you-use-git-rebase-instead-of-git-merge/64319712)
4. [https://www.gitkraken.com/learn/git/problems/git-rebase-vs-merge](https://www.gitkraken.com/learn/git/problems/git-rebase-vs-merge)
5. [https://www.aviator.co/blog/rebase-vs-merge-pros-and-cons/](https://www.aviator.co/blog/rebase-vs-merge-pros-and-cons/)
6. [https://blog.mergify.com/git-merging-vs-rebasing-the-complete-guide-for-modern-development/](https://blog.mergify.com/git-merging-vs-rebasing-the-complete-guide-for-modern-development/)
7. [https://softwareengineering.stackexchange.com/questions/309919/merge-vs-rebase-pull-requests-on-github](https://softwareengineering.stackexchange.com/questions/309919/merge-vs-rebase-pull-requests-on-github)
8. [https://www.atlassian.com/git/tutorials/merging-vs-rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
9. [https://blog.git-init.com/differences-between-git-merge-and-rebase-and-why-you-should-care/](https://blog.git-init.com/differences-between-git-merge-and-rebase-and-why-you-should-care/)
10. [https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests](https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests)

## Conclusion

Si vous souhaitez bénéficier d’une expérience d’apprentissage interactive de Git, je vous recommande le site Web [Learning Git Branching](https://learngitbranching.js.org/). Il vous guidera, étape par étape, dans une interface Web de type CLI, pour vous permettre d’apprendre les tenants et aboutissants de Git.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo d'[Hasan Albari](https://www.pexels.com/photo/ray-of-lights-passing-through-trees-1172626/).
