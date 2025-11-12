---
title: "Windows — modifier la lettre d’un lecteur"
description: "Avec l’utilisation d’une interface CLI disponible en natif sous Windows"
image: /astuces/images/Microsoft_Windows-Logo.png
imageAlt: Logo de Microsoft Windows
date: 2025-11-04
categories:
  - Ligne de commande
tags:
  - Windows
---

## Cas d'usage

Pour modifier la lettre attribuée à votre lecteur CD-ROM (si elle est actuellement E:) sous Windows, vous pouvez procéder de plusieurs manières.

Cependant, suivez les étapes suivantes pour effectuer cette tâche rapidement :

## Solution

1. **Ouvrez l'invite de commande en tant qu'administrateur** :
   - Appuyez sur `Windows + X` → sélectionnez **Invite de commande (Admin)** ou **Windows PowerShell (Admin)**.
2. **Lancez DiskPart** :

   ```powershell
   diskpart
   ```

3. **Affichez la liste de tous les volumes** :

   ```powershell
   list volume
   ```

   Identifiez le numéro de volume de votre lecteur de CD-ROM (recherchez celui dont le type est `CD-ROM` et la lettre `E`).

4. **Sélectionnez le volume du lecteur de CD-ROM** :

   ```powershell
   select volume <numéro du lecteur>
   ```

   Remplacez `<numéro du lecteur>` par le numéro réel du volume du lecteur de CD-ROM.

5. **Attribuez une nouvelle lettre de lecteur** :

   ```powershell
   assign letter=Z
   ```

   Vous pouvez choisir n'importe quelle lettre inutilisée (par exemple, `Z`, `R`, etc.).

6. **Quittez DiskPart** :

   ```powershell
   exit
   ```

## Documentation

Référence: [Microsoft Learn](https://learn.microsoft.com/fr-fr/windows-server/administration/windows-commands/diskpart).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédits: Photo de [www.logo.wine](https://www.logo.wine/logo/Microsoft_Windows)
