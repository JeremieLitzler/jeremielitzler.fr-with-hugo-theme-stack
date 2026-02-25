---
title: "Windows - Déplacer AppData du lecteur C vers un lecteur de données"
description: "Le dossier AppData peut devenir très volumineux."
image: /quick-tips/images/Microsoft_Windows-Logo.png
imageAlt: Logo de Microsoft Windows
date: 2025-12-06
categories:
  - Lignes de commande
tags:
  - Windows
---

## Scénario

Je commençais à manquer d'espace sur le disque C de mon ordinateur portable et j'ai remarqué que `AppData` prenait beaucoup d'espace disque, en particulier l'application Signal.

La cause : les photos et autres documents partagés avec mes contacts.

## Solution

Important : Fermez complètement Signal avant de commencer (cliquez avec le bouton droit de la souris sur l'icône de la barre d'état système → Quitter).

1. Ouvrez l'Invite de commande en tant qu'administrateur
   Appuyez sur Win et sélectionnez « Invite de commande (Admin) » ou « Windows PowerShell (Admin) »
2. Déplacez le dossier Signal existant

   ```cmd
   move "C:\Users\YourUserName\AppData\Roaming\Signal" "E:\Applications\ProgramFiles\Signal"
   ```

3. Créez le lien symbolique

   ```cmd
   mklink /D "C:\Users\YourUserName\Data\Roaming\Signal" "E:\Applications\ProgramFiles\Signal"
   ```

4. Vérifiez que le lien a été créé

   ```cmd
   dir "C:\Users\YourUserName\AppData\Roaming" | find "Signal"
   ```

   Vous devriez voir l'icône `<SYMLINKD>` à côté de Signal, indiquant qu'il s'agit d'un lien symbolique.

5. Lancez Signal - il devrait fonctionner exactement comme avant, mais il stocke maintenant les données sur votre disque `E:`.

Le drapeau `/D` crée un lien symbolique de répertoire (jonction).

Assurez-vous que `E:\Applications\ProgramFiles` existe avant de lancer la commande `move`.

Cela permet de préserver tous les messages, paramètres et médias de Signal.

Si vous devez annuler cette opération, supprimez le lien symbolique et déplacez à nouveau le dossier.

## Dépannage

### Si Signal ne démarre pas

Vérifiez que le lien symbolique existe et qu'il pointe vers le bon emplacement en utilisant la commande `dir`.

### `mklink` n'est pas une commande connue

Bien qu'il s'agisse d'une commande intégrée à Windows, et non d'un programme distinct à installer, j'ai rencontré le problème.

J'exécutais la ligne de commande en tant qu'administrateur.

L'alternative que j'ai utilisée est PowerShell.

```powershell
New-Item -ItemType SymbolicLink -Path "C:\Users\YourUserName\AppData\Roaming\Signal" -Target "E:\Applications\ProgramFiles\Signal"
```

## Documentation

Références :

- [Microsoft Learn-`mklink`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mklink).
- [Microsoft Learn-PowerShell](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/new-item?view=powershell-7.5#example-7-create-a-symbolic-link-to-a-file-or-folder).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo by [www.logo.wine](https://www.logo.wine/logo/Microsoft_Windows)
