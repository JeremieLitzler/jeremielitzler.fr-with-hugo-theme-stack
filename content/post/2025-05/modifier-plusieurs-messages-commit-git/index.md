---
title: "Comment éditer plusieurs commit messages dans Git"
description: "Je me suis précipité dans un commit l’autre jour et j’ai oublié de spécifier le type de commit… Voici comment le modifier."
image: 2025-04-11-a-branch-like-canal.jpg
imageAlt: Un canal en forme de branche
date: 2025-05-28
categories:
  - Développement logiciel
tags:
  - Git
---

Pour éditer plusieurs messages de commit dans Git, vous pouvez utiliser le **_rebase interactif_**. Cette méthode vous permet de modifier l’historique du dépôt.

Voici les étapes à suivre pour y parvenir :

- Démarrer un rebase interactif
- Choisir les livraisons à éditer
- Modifier les messages de livraison
- Terminer le rebase
- Repousser les modifications

Détaillons toutes ces étapes une par une.

## Démarrer un rebase interactif

Exécutez la commande suivante pour lancer un rebase interactif pour les **`N`** derniers commits (remplacez **`N`** par le nombre de commits que vous voulez éditer) :

```bash
git rebase -i HEAD~N
```

Votre éditeur de texte s’ouvre alors.

## Choisir les commits à éditer

Dans le fichier qui s’est ouvert, vous verrez une liste des **`N`** derniers commits dans l’ordre inverse (le plus récent en haut).

Chaque commit sera préfixé par **`pick`**. Pour éditer un message de commit, remplacez **`pick`** par **`reword`** pour le commit correspondant.

Par exemple, dans mon cas, je voulais `reword` tous les commits avec un type de commit conventionnel manquant :

```plaintext
reword e499d89 restyle page login to fix buttons
reword 0c39034 restyle page settings and profiles/[username]
pick d7136fb fix: editing a subentity does refresh entities and its subentities list
reword f7fde4a restyle page subentity
```

Après avoir spécifié les commits à modifier, vous pouvez enregistrer et fermer le fichier.

## Modifier les messages des commits

Après avoir fermé le fichier, Git fera une pause à chaque commit marqué par **`reword`**, ouvrant votre éditeur de texte par défaut pour que vous puissiez modifier le message du commit.

Mettez à jour le message si nécessaire, enregistrez et quittez l’éditeur.

## Terminer le rebase

Une fois tous les messages édités, Git rejouera les commits et terminera le rebase. S’il n’y a pas de conflits, vos modifications seront finalisées.

Cette étape ne nécessite aucune action de votre part.

## Pousser les modifications

Si vous avez déjà poussé ces modifications vers un dépôt distant, vous devrez forcer le push pour mettre à jour l’historique du dépôt distant :

```bash
git push --force
# or
git push --force-with-lease
```

Attention : le _push_ en force réécrit l’historique et peut affecter les autres collaborateurs. Utilisez-le avec précaution. Souvent, ce n’est pas autorisé sur le dépôt parce que vous pouvez réécrire des modifications de code si vous n’êtes pas prudent.

Si vous effectuez un simple `git push`, votre push échouera avec une erreur parce que l’historique local a été réécrit et ne correspond plus à l’historique de la branche distante.

Ceci est dû au comportement par défaut de Git qui rejette les mises à jour non rapides pour éviter d’écraser les changements sur la branche distante (lire [cet article](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message) et [celui-là](https://www.atlassian.com/git/tutorials/rewriting-history) pour plus de détails).

Pour mettre à jour la branche distante avec votre historique réécrit, vous devez utiliser **`git push --force`** ou **`git push --force-with-lease`**. Ces commandes écrasent l’historique distant avec vos modifications locales. Si vous sautez cette étape, la branche distante reste inchangée, et aucun nouveau commit n’est créé.

Voici un résumé des deux options :

| -                              | `git push --force`                                  | `git push --force-with-lease`                                                                                                                                                 |
| ------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sécurité**                   | Faible : écrase l’historique distant sans condition | Haute : vérifie l’état distant avant d’écraser l’historique.                                                                                                                  |
| **Cas d’utilisation**          | Travail solo, corrections d’urgence                 | Travail collaboratif, rebase/squashing                                                                                                                                        |
| **Prévention de l’écrasement** | Non                                                 | Oui : Rejette le push si le distant a de nouveaux commits                                                                                                                     |
| **Référence de bail**          | Non supporté                                        | Facultatif : Spécifiez le commit distant attendu. [Voir cet article.](https://safjan.com/understanding-the-differences-between-git-push-force-and-git-push-force-with-lease/) |
| **Dry Run**                    | Non                                                 | Pris en charge via **`--dry-run`**                                                                                                                                            |

Si vous avez lancé **`git pull`** après avoir réécrit l’historique de vos commits (par exemple, via un rebase interactif), Git va essayer de fusionner l’historique de la branche distante avec votre historique local réécrit. Ce processus va créer des **merge commits** pour réconcilier les différences entre les deux historiques, puisque les branches locales et distantes ont divergé à cause du rebase.

Après cette fusion, vous pouvez pousser, car votre branche locale est maintenant alignée avec la branche distante, mais elle inclue des commits de fusion supplémentaires qui préservent les deux historiques (l’historique distant original et votre historique local réécrit).

Vous vous dites alors : « Ce n’est pas bon, je veux un historique propre et correct ».

## Mais de nombreux dépôts appliquent les règles de la branche protégée

Oui, ils le font et les deux `--force` et `--force-with-lease` seront rejetés si la branche est protégée…

Dans ce cas, la meilleure chose à faire est d’implémenter sur votre dépôt un linter de messages de commit pour forcer les règles conventionnelles de commit.

Ainsi, il n’est pas nécessaire de réécrire l’histoire. Je vais bientôt essayer d’implémenter cela sur mes dépôts personnels pour servir de bonne pratique et de rappel automatique pour suivre les règles de commit conventionnelles 😊.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Kashif Shah](https://www.pexels.com/photo/aerial-view-of-irrigation-canals-in-punjab-pakistan-31454645/)
