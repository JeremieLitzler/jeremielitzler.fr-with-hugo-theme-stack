---
title: "Task.Run ou Task.Factory.StartNew"
description: "Lequel choisir, quand et pourquoi?"
image: /images/2026-09-14-une-cassette-magnetique-deroulee.jpg
imageAlt: Une cassette magnétique déroulée
date: 2026-09-14
categories:
  - Développement logiciel
tags:
  - Asynchronisme
  - Dotnet
---

`Task.Run` est-il plus sûr, car il utilise le `TaskScheduler.Default` alors que `Task.Factory.StartNew` utilise `TaskScheduler.Current` qui dépend du contexte ?

C’est ce qu’on voit dans ce qui suit.

## Différences clés

Task.Run est effectivement plus sûr, car il utilise toujours `TaskScheduler.Default` (c’est l’équivalent du `ThreadPool`), tandis que `Task.Factory.StartNew` utilise par défaut `TaskScheduler.Current`, ce qui peut créer des comportements imprévisibles selon le contexte d’exécution.

`Task.Run` est essentiellement un raccourci qui appelle `Task.Factory.StartNew` avec des paramètres par défaut sécurisés (cf. les sources de la documentation Microsoft en fin d’article), notamment :

- `TaskScheduler.Default` (`ThreadPool`)
- `TaskCreationOptions.DenyChildAttach`
- `CancellationToken.None`

`Task.Factory.StartNew` offre plus de contrôle mais avec des risques si l’on ne maitrise pas assez bien son sujet :

- Utilise par défaut `TaskScheduler.Current` et non `TaskScheduler.Default` (cf. Source InfoWorld)
- Ne comprend pas les délégués async (retourne `Task<Task>` au lieu de `Task`)
- Nécessite `.Unwrap()` pour les opérations asynchrones

## Quand utiliser l’un ou l’autre

On utilise `Task.Run` pour :

- La grande majorité des cas d’utilisation moderne
- Déléguer du travail _CPU-bound_ au `ThreadPool`
- Travailler avec du code async/await
- Avoir des comportements prévisibles et sûrs

On utilise `Task.Factory.StartNew` uniquement si :

- On a besoin d’un `TaskScheduler` personnalisé
- On doit spécifier qu’un processus sera occupé longtemps avec `TaskCreationOptions.LongRunning` (cf. Source Programmer All)
- Vous devez passer un objet d’état pour optimiser les allocations mémoire (après profilage).
- Vous avez besoin de contrôler précisément les options de création de tâches

## Le piège du `TaskScheduler.Current`

Le problème majeur est que `Task.Factory.StartNew` examine d’abord le `TaskScheduler` courant.

Par exemple, si vous l’appelez depuis un gestionnaire d’événement UI (WinForms, WPF), la tâche s’exécutera sur le processus d’UI au lieu du `ThreadPool`, causant potentiellement un blocage de l’interface. C’est le cas le plus connu !

Dans mon cas, j’avais pris l’habitude d’utiliser `Task.Factory.StartNew` , car je l’avais vu utiliser dans le code pour lancer un traitement en mode _Fire & Forget_, ce qui n’est pas du tout recommandé.

En effet, cela cache en général un souci de conception logicielle et une impréhension d’un traitement asynchrone.

Par exemple, réaliser un envoi d’email avec un _Fire & Forget_ à la fin d’un paiement ne garantit pas l’envoi de l’email, même ce dernier ne « bloque » plus le retour de l’API de paiement. De plus, ce n’est pas la responsabilité du traitement de paiement d’envoyer l’email et vice-versa.

La solution pour éviter le _Fire & Forget_ est un sujet très vaste qui tourne autour d’un choix d’architecture logicielle que je dois encore approfondir avec des cas concrets.

A suivre donc…

## Sources

- Blog .NET officiel—Task.Run vs Task.Factory.StartNew (Stephen Toub, 2011)
- StartNew is Dangerous (Stephen Cleary)
- InfoWorld—On Task.Factory.StartNew and Task.Run methods
- Code Maze—Difference Between Task.Run and Task.Factory.StartNew

## Conclusion

La recommandation générale : préférez toujours Task.Run sauf si vous avez un besoin explicite qui nécessite des fonctionnalités avancées de StartNew.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de Paul Seling sur Pexels
