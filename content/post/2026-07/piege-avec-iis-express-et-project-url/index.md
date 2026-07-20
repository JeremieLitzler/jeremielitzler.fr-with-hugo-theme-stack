---
title: "Un piège avec IIS Express et le `Project Url`"
description: "Modifier le `Project Url` dans un projet WebAPI peut être problèmatique. Je vous raconte dans un exemple."
image: 2026-07-20-un-vrai-labyrinthe.jpg
imageAlt: Un vrai labyrinthe
date: 2026-07-20
categories:
  - Développement logiciel
tags:
  - Visual Studio
---

Si tu modifies le `Project Url` dans les propriétés d’un projet WebApi pour ajouter `/swagger` à un url, par exemple `https://localhost:44306/`, puis que tu valides une modal qui apparait, mais que tu n’arrives plus à accéder à l’URL `/swagger/ui/index`, c’est que la configuration de ton IIS Express à changer.

Même après un retour en arrière sur le fichier `.csproj`, le problème persiste.

Regardons comment résoudre ce problème

## Analyse rapide

Quand tu procèdes à la modification du `Project Url` dans la section « Web » des propriétés du projet, cela modifie la façon dont IIS Express (ou le serveur de développement) lance ton application, notamment le chemin de base.

En ajoutant `/swagger` dans le Project Url, tu changes la racine de l’application à `https://localhost:44306/swagger` au lieu de `https://localhost:44306/`. Cela implique que ton application est désormais servie sous `/swagger` comme racine, donc l’URL complète pour Swagger pourrait ne plus être accessible comme avant.

Visual Studio te demande de mettre à jour le fichier `.vs/config/applicationhost.config` qui configure IIS Express, et cela a pu créer un binding spécial. La modale n’est pas aussi explicite que cela.

Avoir modifié la valeur du `Project Url` à modifier le `csproj`, mais une annulation de la modification ne suffit pas à rétablir l’accès en local à l’application. En effet, la configuration du serveur (IIS Express) est en dehors du `.csproj` dans un fichier de configuration utilisateur (`applicationhost.config`).

## Que faire alors ?

### Étape 1 : vérifier le fichier IIS Express

- Va dans le dossier `.vs` de ta solution (caché par défaut, dans le même dossier que ta solution `.sln`).
- Ensuite, dans `.vs/<nom_de_ta_solution>/config/applicationhost.config`
- Ouvre ce fichier, cherche la section `<sites>` et vérifie les bindings.
- Si tu vois un binding avec `/swagger` dans le chemin virtuel, remets-le à `/` (la racine).

### Étape 2 : Modifier la propriété `Project Url`

- Ouvre Visual Studio
- Dans les propriétés du projet -> onglet Web
- Modifie le champ **Project Url** pour mettre juste `https://localhost:44306/` (sans `/swagger`)
- Applique les changements et sauvegarde.

### Étape 3 : Modifier la page spécifique à lancer (pour ouvrir directement Swagger)

Toujours dans les propriétés Web, dans le champ **Specific Page** (ou « Page spécifique »), renseigne `/swagger` ou `/swagger/ui/index` (selon ta version Swagger)

Cela fera que quand tu démarres le projet, il ouvre directement cette page dans le navigateur.

### Étape 4 : Nettoyer et redémarrer

- Ferme Visual Studio
- Supprime éventuellement le dossier `.vs` (réinitialise la configuration IIS Express)
- Rouvre Visual Studio
- Recompile et lance le projet

Tu peux maintenant accéder au swagger de ton API.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit: Photo de Home Privilege Real Estate (`https://www.pexels.com/photo/woman-standing-in-middle-of-labyrinth-20620491/`).
