---
title: "Pipeline d'agents avec Claude Code"
description: "Tout comme nous, l'IA est plus performante lorsqu'elle est spécialisée. Une seule responsabilité par agent et le résultat obtenu s'en trouve bien meilleur."
image: 2026-03-09-white-robot-looking-at-the-camera.jpg
imageAlt: Un robot blanc qui regarde l'appareil photo
date: 2026-03-16
categories:
  - Intelligence artificielle
tags:
  - Claude Code
---

Le 19 février dernier, j’ai recréé une application de vérification des liens morts sur mes sites web avec Claude Code. J’ai commencé par constituer l’équipe de sous-agents chargée de développer cette application.

Je venais tout juste de commencer à utiliser Claude Code une semaine auparavant et j’avais déjà le sentiment qu’il fallait confier une tâche spécifique de la réalisation du projet à un agent donné :

- l’un rédige le cahier des charges,
- l’autre code,
- un autre teste,
- un autre gère le contrôle de version
- et un autre orchestre le flux de travail.

Voyons comment cela s’est passé.

## À propos de l’utilisation des sous-agents

Cela **fonctionne bien lorsque les sous-agents définissent clairement leurs responsabilités** — sans chevauchement. Tout comme lorsque l’on travaille au sein d’une équipe humaine, n’est-ce pas ?

Ce n’est pas ce que j’ai fait dès le départ avec tous les agents. Mais je les ai affinés lorsque je m’en suis rendu compte.

Par exemple, les responsabilités entre l’orchestrateur et le sous-agent Git n’étaient pas très claires. Les deux exécutaient des commandes Git alors qu’un seul était censé le faire.

Je vais donc vous montrer comment je m’y suis pris.

## Le point de départ

Au départ, [Claude.ai](http://Claude.ai) m’a proposé un script shell, mais cela ne me convenait pas. Je voulais que les sous-agents communiquent via des fichiers Markdown. De cette manière, lorsqu’un sous-agent terminait sa tâche, il en rendait compte à l’orchestrateur, qui transmettait le travail à l’agent suivant dans la file.

De plus, cela permet de versionner le déroulé des développements.

[Claude.ai](http://Claude.ai) a suggéré cette structure de fichiers de départ :

```plaintext
project/
├── .agents/
│   ├── specs.md          # sortie de l'agent specs
│   ├── code-ready.md     # sortie de l'agent coder
│   └── test-results.md   # sortie de l'agent test
├── orchestrator.sh       # glues agents together
└── prompts/
    ├── specs.txt
    ├── coder.txt
    ├── tester.txt
    └── git.txt
```

I tweaked it to this one:

```plaintext
project/
├── .agents-output/
│   ├── specs.md          # sortie de l'agent specs
│   ├── code-ready.md     # sortie de l'agent coder
│   └── test-results.md   # sortie de l'agent test
└── .agents-brain/
    ├── agent-0-orchestrator.md
    ├── agent-1-specs.md
    ├── agent-2-coder.md
    └── agent-3-tester.md
    └── agent-4-git.md
```

Les fichiers dans `.agent-output` sont vides au départ et se remplissent au fur et à mesure que le sous-agent fonctionne. Si vous avez lu [mon article précédent](../organizing-specifications-with-claude-code/index.md), le répertoire `.agents-output` est similaire à `docs/prompts/tasks`.

Le fichier `.agents-brain` est la partie la plus importante que vous devez adapter à vos sensibilités et à vos habitudes.

Voici [les fichiers `.agents-brain` de mon agent](https://github.com/JeremieLitzler/deadlinkchecker/tree/main/.agents-brain) pour ce projet. Il ne s’agit pas de la dernière version, car j’ai depuis intégré et affiné la structure dans l’autre projet `SocialMediaPublisherApp` disponible [ici](https://github.com/JeremieLitzler/SocialMediaPublisherApp).

Une fois tout ajusté, j’ai lancé Claude Code dans le terminal et l’agent orchestrateur a récupéré mon prompt initial dans le fichier `README.md` pour démarrer le travail.

{{< blockcontainer jli-notice-warning "Remarque importante">}}

Si vous utilisez Claude Code depuis plus longtemps que moi, vous pourriez dire : _« Oui, mais les sous-agents devraient se trouver dans `.claude/agents` »_. Oui, j’ai découvert cela un peu plus tard dans le processus. J’y reviendrai dans un autre article.

{{< /blockcontainer >}}

## La programmation agentique ne signifie pas que l’IA a toujours raison

Et les humains non plus.

Au début, j’ai demandé à utiliser un script Bash pour effectuer la tâche. Mais lorsque l’agent de test a essayé de réaliser son travail, il a échoué à maintes reprises, ignorant le `MAX_RETRIES = 3`. Il semblait incapable de vérifier que la logique fonctionnait comme prévu…

Claude avait d’abord suggéré d’utiliser Python avant que je ne demande spécifiquement Bash. Je pensais que Bash ne nécessiterait aucune dépendance, vu qu’il était fourni avec Git.

L’approche Python nécessitait l’installation de Python et, selon moi, de nombreuses autres dépendances. Mais je me trompais, car Python intègre toutes les bibliothèques dont mon application avait besoin.

La leçon à retenir : ne croyez pas toujours connaître la meilleure approche, et ne comptez pas sur l’IA pour faire le travail sans instructions. Mais n’ayez pas peur d’essayer plusieurs approches.

## Amélioration du flux de travail

Au fur et à mesure que je développais l’application, j’ai affiné le fonctionnement de chaque agent et peaufiné le flux de travail :

- J’ai ajouté des validations intermédiaires après chaque agent, une fois leur tâche terminée : d’abord l’agent de spécifications, puis celui qui programmait et enfin celui qui testait.
- J’ai demandé que la validation soit effectuée après validation des spécifications ou du code.
- J’ai mis à jour l’agent de spécifications pour qu’il fournisse moins de code et laisse l’agent de codage s’occuper de cette tâche lui-même.
- J’ai mis à jour l’agent Git pour qu’il choisisse mieux le type de validation à utiliser. Il continuait à faire un mauvais choix en commettant les spécifications avec le type `chore` au lieu de `docs`. J’ai également précisé qu’il devait respecter la convention de validations, en fournissant des exemples clairs.
- J’ai installé GitHub CLI via Scoop pour permettre à l’orchestrateur de créer une PR, de la finaliser une fois validée par un humain, et de clore le ticket associé. Il s’est avéré que cette tâche relevait en réalité de la responsabilité d’un sous-agent Git, comme je l’ai découvert plus tard au cours de mon apprentissage.
- J’ai également amélioré la structure du dossier de sortie pour qu’elle devienne la suivante :

```plaintext
project/
├── .agents-output/
|   ├── 0-user-requests/
|       ├── _initial.md # contient l'ancien contenu au format Markdown
|       ├── 2026-02-26-07-33-28-issue-23-reorganize-agents-output-folder.md
|       └── 2026-02-26-13-01-39-issue-35-add-option-to-exclude-3xx-from-email-notifications.md
│   ├── 1-business-specifications/
|       ├── _initial.md
|       ├── 2026-02-26-07-33-28-issue-23-reorganize-agents-output-folder.md
|       └── 2026-02-26-13-01-39-issue-35-add-option-to-exclude-3xx-from-email-notifications.md
│   ├── 2-technical-specifications/
|       ├── _initial.md
|       ├── 2026-02-26-07-33-28-issue-23-reorganize-agents-output-folder.md
|       └── 2026-02-26-13-08-18-issue-35-add-option-to-exclude-3xx-from-email-notifications.md
│   └── 3-test-results/
|       ├── _initial.md
|       ├── 2026-02-26-07-33-28-issue-23-reorganize-agents-output-folder.md
|       └── 2026-02-26-13-13-31-issue-35-add-option-to-exclude-3xx-from-email-notifications.md
```

## Ajout de nouveaux agents

À partir de l’équipe d’agents initiale que j’avais définie, j’ai fini par en ajouter de nouveaux :

- un agent chargé de vérifier les aspects de sécurité de l’application juste après la définition des spécifications.
- un agent chargé de définir les cas d’utilisation pour les tests avant le codage et de coder les tests après le codage. Oui, je n’ai pas encore réussi à intégrer le TDD dans mon pipeline d’agents.
- un réviseur de code après avoir essayé le réviseur de code de Claude. Je n’ai toutefois pas réussi à le faire fonctionner. Pour l’instant, cet agent fait l’affaire et a en fait permis d’apporter des ajustements utiles après le codage.
- un agent de maintenance du pipeline d’agents à qui je pouvais demander des mises à jour lorsque je constatais des problèmes lors de l’exécution d’un agent ou du processus. Cela s’est produit à plusieurs reprises lorsque j’ai apporté des modifications à l’organisation des agents, en particulier lors de l’intégration de la fonctionnalité Git worktree dans le pipeline pour exécuter des pipelines en parallèle. Un sujet que j’aborderai dans un futur proche.

Cependant, je vais devoir prendre un peu de recul à un moment donné et clarifier la définition des agents, des compétences et des outils. Je suis presque sûr que certains de mes « agents » sont en réalité des compétences.

Ce sera le sujet d’un autre article à venir.

## Prochaines étapes

J’aimerais laisser l’IA effectuer davantage de tâches sans assistance, mais cela nécessite de définir très clairement à l’avance les fonctionnalités ou les bugs. Sinon, l’IA va beaucoup halluciner et gaspiller vos jetons disponibles ainsi que votre temps. De plus, de nombreuses commandes shell nécessitent une validation humaine, et ce, pour de bonnes raisons. Cela pourrait limiter la possibilité d’exécuter un Claude Code autonome sans compromis majeurs en matière de sécurité.

En effet, quand j’utilise Claude Code, j'atteins vite la limite de la session de cinq heures. Mais si je donne du travail aux équipes et que je mets en place un système pour surveiller cette limite de cinq heures afin qu’il puisse mettre les agents en pause et les relancer, je pourrais peut-être tirer davantage parti du prix payé pour le service. Je suis sûr que c’est faisable.

Cependant, les interactions humaines restent **vraiment indispensables**, car c’est l’humain qui apporte les idées. Il enrichit les idées en voyant le produit se construire et il repère les hallucinations de l’IA (qui sont encore nombreuses). Du moins, c’est ce que j’ai ressenti en développant l’application DeadLinkChecker.

Entre-temps, j’ai partagé cela avec quelques collègues et cela a suscité beaucoup d’intérêt. L’un d’eux a partagé les outils suivants :

- les [prompts systèmes](https://github.com/JeremieLitzler/claude-code-system-prompts) qu’Anthropic utilise pour créer et utiliser ses agents.
- le [MCP Serena](https://github.com/oraios/serena?tab=readme-ov-file) pour optimiser la consommation de tokens. [Rust Token Killer](https://github.com/rtk-ai/rtk/) est un autre petit logiciel permettant d’économiser des tokens d’entrée dont je parlerai bientôt, car, contrairement au premier, je l’ai déjà intégré.
- le [projet Open Code](https://opencode.ai/docs), une alternative à Claude Code, que vous pouvez utiliser avec des LLM gratuits et de nombreux autres LLM premium, mais parfois moins chers, comme DeepSeek, Gemini, Mistral, GPT, etc.
- le [package AgentOS](https://buildermethods.com/agent-os) qui permet de définir de meilleures spécifications et de maintenir la cohérence des agents dans un système léger qui s’adapte à votre façon de développer.

En clair, j’ai beaucoup de choses à expérimenter et à partager dans un avenir proche. Alors, abonnez-vous ⬇️⬇️⬇️

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

_Photo d'Alex Knight sur Pexels._
