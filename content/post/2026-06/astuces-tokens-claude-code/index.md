---
title: "Réduire sa consommation de tokens sur Claude Code"
description: "Quelques astuces que je pratique avec Claude Code."
image: /images/2026-03-09-white-robot-looking-at-the-camera.jpg
imageAlt: Un robot blanc regardant la caméra
date: 2026-06-24
categories:
  - Intelligence Artificielle
tags:
  - Claude Code
---

Après plusieurs mois d’utilisation de Claude Code, je me suis résumé une petite liste d’astuces à **Claude Code** en mode CLI.

Les astuces propres à l’application web Claude.ai (Projets, apps connectées, instructions du compte, Cowork, artefacts, édition de prompt dans l’UI, Webflow, plans gratuit/Pro/Max) ont été écartées, car j’utilise de moins en moins la plateforme Web.

Trois idées reviennent chez beaucoup d’utilisateurs de Claude Code :

- **L’essentiel de la consommation se joue « en coulisses »**, hors de nos prompts : le _prompt système_, le fichier `CLAUDE.md`, les serveurs MCP activés, la mémoire (qu’on ne contrôle pas toujours) et surtout l’**historique de conversation** (jusqu’à **51 %** à lui seul selon de nombreuses sources sur le Web, mais cela varie selon la situation).
- **Les modèles sont sans état** donc, à chaque message, le LLM relit toute la conversation et Anthropic vous le refacture. Le 30ᵉ message peut coûter ~30 fois le premier.
- **C’est la sortie qui coûte le plus cher**, davantage que l’entrée.

## Gérer la conversation et l’historique

### Garder des conversations courtes et repartir à neuf

Il faut limiter à **15-20 messages** maximum par conversation. Sinon, la qualité se dégrade fortement, même si Anthropic vante le _million de tokens du contexte_. En réalité, au-delà de 50 % [^1], les choses se gâtent.

Quand il faut continuer un sujet, demander à Claude un **résumé Markdown (300–400tokens)** à réutiliser dans le premier prompt de la nouvelle session.

Enfin, il faut toujours **démarrer une nouvelle conversation** pour une nouvelle tâche.

### Les commandes `/compact`, `/clear` et `/context`

`/compact` permet d’alléger l’historique d’une session en le transformant en liste de faits clés, sans tout détruire. Toutefois, sachez que le fonctionnement n’est pas transparent et on dépend du jugement de Claude et du modèle utilisé.

`/clear` permet de repartir d’un contexte propre pour une nouvelle tâche.

`/context` permet de connaitre la répartition de la consommation de token dans la fenêtre de contexte à tout moment. Par défaut, sans serveurs MCP, avec un `CLAUDE.md` de petite taille (100 tokens), je suis à 2 % sans même avoir soumis un seul message…

## Choisir le bon modèle

Dès que j’ai commencé à utiliser des sous-agents, j’ai adapté le modèle à la tâche : **Haiku** (tâches simples, rapides, le moins cher), **Sonnet** (complexité moyenne), **Opus** (planification, raisonnement complexe, code, architecture, relecture finale).

Beaucoup recommandent **Opus pour planifier**, puis on bascule sur Sonnet/Haiku pour l’exécution.

On peut vérifier le modèle actif avec la commande `/model`. Aussi, n’activez la **réflexion adaptative** que sur Opus pour les tâches vraiment complexes. Sinon, gare à la surconsommation de tokens !

Il existait un paramètre pour limiter la quantité de tokens dédiés à la réflexion (`MAX_THINKING_TOKENS`), toutefois, d’après mes recherches, Anthropic a remplacé cela par la commande `/effort` :

```sh
❯ /effort  [low|medium|high|xhigh|max|auto]
```

## Documents et données lourdes

Il s’avère plus efficace de convertir les documents lourds en Markdown.

Par exemple, un PDF coûte cher (~10 000 tokens pour 20 pages ; 6 800-7 000 vs 2 800 après conversion). Le transformer en **`.md`** divise le coût par ~3, ce qui s’avère utile dès qu’un fichier est relu plusieurs fois dans le contexte.

Il existe plusieurs méthodes pour transformer un fichier PDF en Markdown. Toutefois, cela suppose que le PDF n’est pas un fichier fusionnant des images.

Si la base du PDF est textuelle, un petit script Python peut s’en occuper avec les librairies `pypdf` et `re`.

Si le fichier PDF n’a de base textuelle, il faudra passer par la méthode OCR (_reconnaissance optique de caractères_), plus coûteuse.

## Centraliser et alléger le contexte permanent

### Mémoire et `CLAUDE.md`

Consigner **une seule fois** dans la mémoire de Claude Code ses préférences, son style et le métier du projet, de façon optimisée, éviter les redires chaque session.

C’est là qu’on peut parler du `CLAUDE.md`. Il doit être court et de haut niveau. Un bon `CLAUDE.md` fait 500 tokens.

Pourquoi si petit ? Il faut savoir qu’il est lu chaque session. Le scinder en fichiers séparés quand cela est nécessaire avec la méthode de **divulgation progressive** peut aider à charger à la demande des informations et instructions.

Mais attention, éviter les directives d’inclusion qui chargent tout.

### `.claudeignore`

Il fonctionne comme un `.gitignore`, mais pour Claude. Par exemple, inutile de lire les `node_modules`, le dossier `dist`, et les **fichiers d’environnement sensibles** (clés API, accès BDD). J’ai vu un message sur LinkedIn où quelqu’un a juste obtenu le contenu d’un fichier `.env` à un contact qui n’avait pas assez sécurisé son processus et le LLM a exposé des secrets sans état d’âme.

## Réduire la sortie

### Forcer des réponses courtes

Demander explicitement « fais une liste », « donne des points » plutôt que des paragraphes/rapports quand une réponse brève suffit.

### Compresser la sortie des commandes avec RTK

Il s’agit d’un proxy CLI qui filtre la sortie des commandes (suppression commentaires/espaces, regroupement, déduplication) avant qu’elle n’atteigne le contexte. Sur GitHub, les auteurs vantent **-70 à -92 %**, mais, personnellement, j’ai observé un gain de plutôt **40 à 50 %**.

## Prompter efficacement

### Planifier avant d’exécuter

J’ai tendance à préparer finement le travail en créant des tâches concises et ciblées. Cela permet d’appliquer la méthode de démarrer une nouvelle session pour partir d’un contexte vierge à chaque tâche.

### Encourage Claude à poser des questions (`AskUserQuestion`)

Au début, je ne le faisais pas assez. Demander à Claude « de quoi as-tu besoin pour la meilleure réponse ? » et laisser **AskUserQuestion** cibler l’info utile permet de réfléchir avec Claude. C’est une instruction qui doit se trouver dans le `CLAUDE.md` pour moi, car c’est un principe fondamental : « Préfère les questions à l’utilisateur plutôt que les suppositions ».

## Couper les fonctionnalités inutiles

Par défaut, désactiver les **connecteurs et MCP** (un appel par erreur peut vider les tokens) et la **recherche web** permet de gagner des tokens non négligeables. La bonne pratique est de les activer quand on en a besoin.

## Bien concevoir ses compétences (`skill`) et ses commandes

C’est un sujet que j’affine en ce moment. Une compétence bien ficelée :

- instructions précises,
- 2-3 exemples,
- séparation du quoi et du comment,
- conditions de déclenchement précises.

J’approfondirai ce sujet dans un prochain article.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

_Photo de Alex Knight sur Pexels._

- [^1] : [Context Rot: Why AI Gets Worse the Longer You Chat (And How to Fix It)](https://www.producttalk.org/context-rot/)
