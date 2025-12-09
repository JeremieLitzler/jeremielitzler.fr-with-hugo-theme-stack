---
title: "Comment mettre à jour efficacement les applications Scoop"
description: "Cela permet de rester à jour et nous pouvons y parvenir à l'aide d'un script PowerShell."
image: 2025-12-08-a-man-and-a-woman-scooping-into-a-watermelon.jpg
imageAlt: Un homme et une femme partageant une pastèque
date: 2025-12-12
categories:
  - Outils
tags:
  - PowerShell
---

J’adore [Scoop.sh](https://scoop.sh/) ! Il fournit presque toutes les applications dont j’ai besoin.

Mais leur mise à jour n’est pas très conviviale. Voyons ensemble comment j’ai réussi à mettre à jour toutes les applications obsolètes en (presque) une seule ligne de commande.

## Scoop « update » et Scoop « status »

Avant de commencer, il faut s’assurer que Scoop est à jour en utilisant la commande `update :

```powershell
scoop update
```

Ensuite, pour savoir quelles applications ont besoin d'une mise à jour, la commande suivante les répertorie pour nous :

```powershell
scoop status
```

Le résultat attendu serait :

```plaintext
Name      Installed Version        Latest Version         Missing Dependencies Info
----      -----------------        --------------         -------------------- ----
find-java 17                       19
nodejs    23.6.0                   23.7.0
picpick   7.2.9                    7.3.0
pycharm   2024.3.1.1-243.22562.220 2024.3.2-243.23654.177
python312 3.12.7                   3.12.8
signal    7.37.0                   7.40.1
supabase  2.6.8                    2.9.6
terraform 1.10.4                   1.10.5
vscode    1.96.3                   1.96.4
```

## Le point de départ

Créons un fichier PowerShell appelé `scoop-auto-update-apps.ps1`.

Les premières lignes sont les suivantes :

```powershell
    # Exécutez toujours la mise à jour scoop pour actualiser la base de données.
    Write-Host "Refreshing Scoop database..." -ForegroundColor Cyan
    scoop update

    # Obtenir l'état de mise à jour de chaque application
    Write-Host "Checking for outdated apps..." -ForegroundColor Cyan
    $statusOutput = scoop status
```

Que contient `$statusOutput` ?

```plaintext
@{Name=find-java; Installed Version=17; Latest Version=19; Missing Dependencies=; Info=} @{Name=nodejs; Installed Version=23.6.0; Latest Version=23.7.0; Missing Dependencies=; Info=} @{Name=picpick; Installed Version=7.2.9; Latest Version=7.3.1; Missing Dependencies=; Info=} @{Name=pycharm; Installed Version=2024.3.1.1-243.22562.220; Latest Version=2024.3.2-243.23654.177; Missing Dependencies=; Info=} @{Name=python312; Installed Version=3.12.7; Latest Version=3.12.8; Missing Dependencies=; Info=} @{Name=signal; Installed Version=7.37.0; Latest Version=7.40.1; Missing Dependencies=; Info=} @{Name=supabase; Installed Version=2.6.8; Latest Version=2.9.6; Missing Dependencies=; Info=} @{Name=terraform; Installed Version=1.10.4; Latest Version=1.10.5; Missing Dependencies=; Info=} @{Name=vscode; Installed Version=1.96.3; Latest Version=1.96.4; Missing Dependencies=; Info=}
```

Il correspond à une liste d’objets des applications à mettre à jour. Voyons un exemple :

```plaintext
@{Name=find-java; Installed Version=17; Latest Version=19; Missing Dependencies=; Info=}
```

## Extraire le nom de l’application

Pour extraire le nom de l’application, nous allons utiliser une expression régulière :

```powershell
# Extraire les noms d'applications avec une expression régulière
    $updatableApps = $statusOutput | ForEach-Object {
        if ($_ -match 'Name=([^;]+)') {
            $matches[1]
        }
    }
```

Remarque : `$_` correspond à l’objet actuel de la liste en cours d’analyse.

Nous vérifions l’élément `Name=([^;]+)` par rapport à la chaîne d’objet entière, et l’expression régulière capture uniquement la valeur après `Name=` et avant le point-virgule, ce qui nous donne le nom de l’application souhaité.

Ensuite, `$matches` est une variable automatique dans PowerShell qui est remplie lors de l’utilisation de l’opérateur `-match` avec des groupes d’expressions régulières (marqués par des parenthèses dans le motif).

Lorsque vous utilisez `Name=([^;]+)` :

- `$matches` contient la chaîne complète correspondante (par exemple, `Name=find-java`)
- `$matches` contient ce qui a été capturé dans le premier groupe entre `()` (par exemple, `find-java`)

Voici un exemple pour illustrer cela :

```powershell
$text = "@{Name=find-java; Installed Version=17; Latest Version=19; Missing Dependencies=; Info=}"
if ($text -match 'Name=([^;]+)') {
    Write-Host "Full match: $($matches[0])"     # Sortie : Name=find-java
    Write-Host "Group 1: $($matches[1])"        # Sortie : find-java
}

```

Nous utilisons `$matches` car nous voulons uniquement le nom de l’application sans le préfixe `Name=`.

## Vérification qu’aucune application ne doit être mise à jour

Ensuite, vérifions simplement que les résultats de la sortie `scoop status` retournent une liste d’applications.

Si ce n’est pas le cas, terminons l’exécution :

```powershell
# Vérifier s'il y a des applications à mettre à jour
if ($updatableApps.Count -eq 0) {
    Write-Host "No apps need updating." -ForegroundColor Green
    return
}
```

## Imprimer la liste des applications à mettre à jour

Afin de fournir un retour d’information à l’utilisateur, imprimons la liste des applications :

```powershell
Write-Host "The following apps will be updated:" -ForegroundColor Yellow
$updatableApps | ForEach-Object { Write-Host "- $_" }
```

## Exécutez la commande de mise à jour par application

Nous sommes maintenant prêts à mettre à jour les applications obsolètes. Parcourons la variable `$updatableApps` et exécutons la commande `scoop update $app` :

```powershell
Write-Host "`nUpdating apps..." -ForegroundColor Cyan
foreach ($app in $updatableApps) {
    Write-Host "Updating $app..." -ForegroundColor Yellow
    scoop update $app
}
```

## Ajout d’une option `--dry-run`

Bon, maintenant, j’aime toujours exécuter mes scripts avec une option `--dry-run` pour vérifier ce qui va se passer avant que la logique ne soit réellement exécutée.

Enveloppons le code que nous avons écrit jusqu’à présent dans une fonction :

```powershell
function Update-ScoopApps {
    param (
        [switch]$DryRun
    )

	# Le reste du code...
}
```

Et ajoutez au bas du script un appel de fonction qui gère l’option *dry run* :

```powershell
# Appeler la fonction avec le paramètre facultatif --dry-run
if ($args -contains "--dry-run") {
    Update-ScoopApps -DryRun
} else {
    Update-ScoopApps
}
```

Ensuite, dans le corps de la fonction, ajoutons l’option `--dry-run` juste avant la dernière boucle qui appelle `scoop update $app` :

```powershell
    if ($DryRun) {
        Write-Host "`DRY RUN: Updates would be performed for the above apps" -ForegroundColor Yellow
        return
    }

    Write-Host "`Updating apps..." -ForegroundColor Cyan

```

## Ce qui n’est pas inclus dans le script

Parfois, Scoop vous indique que vous devez exécuter une commande de registre pour les menus contextuels ou autres fonctionnalités. Ce script ne gère pas encore cela.

Vous devrez copier ces commandes et les exécuter individuellement.

De plus, le script ne permet pas d’ignorer une mise à jour d’application si vous devez conserver la version actuellement installée. Je dirais qu’il faudrait une option `--skip "app1 app2 ..."` pour cela.

## Conclusion

Et voilà ! Vous pouvez mettre à jour vos applications Scoop à l’aide d’une seule commande :

```powershell
.\scoop-auto-update-apps.ps1
```

Le script complet est disponible [dans ce gist GitHub](https://gist.github.com/JeremieLitzler/d0d66e25ee843697855f1509b6770ed9). Profitez-en !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Yan Krukau](https://www.pexels.com/photo/a-couple-scooping-fresh-watermelon-with-spoons-5216257/).
