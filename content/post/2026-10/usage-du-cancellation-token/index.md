---
title: "Usage du CancellationToken"
description: "C'est un objet (notamment en .NET / C#) qui permet de propager un signal d'annulation à une opération asynchrone ou de longue durée."
image: /images/2026-09-14-une-cassette-magnetique-deroulee.jpg
imageAlt: Une cassette magnétique déroulée
date: 2026-10-12
categories:
  - Développement logiciel
tags:
  - Asynchronisme
  - Dotnet
---

Quand passer le `CancellationToken` à `Task.Run` ?

La réponse courte : généralement, ne le passez PAS à `Task.Run`. Voici pourquoi et comment bien l'utiliser.

## Le piège du `CancellationToken` dans `Task.Run`

Le `CancellationToken` passé à `Task.Run` annule uniquement la planification d'un délégué sur le `ThreadPool` ; une fois que ce délégué commence à s'exécuter (ce qui se produit presque immédiatement), ce token d'annulation est ignoré.

Beaucoup de développeurs écrivent ceci en pensant à tort que le délégué sera annulé :

```csharp
// ❌ INCORRECT - Le token ne fait PAS ce que vous pensez
await Task.Run(() => {
    // Ce code ignore le cancellationToken
    DoSomething();
}, cancellationToken);
```

## La bonne approche

Passez le token au code à l'intérieur du délégué, pas à Task.Run :

```csharp
// ✅ CORRECT
await Task.Run(() => {
    DoSomething(cancellationToken); // Le token est utilisé ICI
});
```

Cela rend explicite qu'il revient au code du délégué d'honorer l'annulation de l'opération.

## Les trois usages du CancellationToken

Prenons l’exemple suivant :

```csharp
var cts = new CancellationTokenSource();
var token = cts.Token;

try {
    Task.Run(() => {
        DoSomething(token);  // ① Annule l'exécution
    }, token)                 // ② Annule la planification (rarement utile)
    .Wait(token);             // ③ Annule l'attente (pas de la tâche elle-même)
}
catch (OperationCanceledException) {
    // Gestion de l'annulation
}
```

1. Dans le délégué : c'est là que ça compte vraiment. Il arrête l'exécution de `DoSomething`, à condition que la méthode soit écrite pour honorer les demandes d'annulation.
2. Dans `Task.Run` : il annule seulement si le token est déjà annulé AVANT que la tâche commence (ce qui est rare)
3. Dans `Wait()` : il annule uniquement le processus d'attente de la tâche, sans réellement annuler la tâche elle-même.

## Comment implémenter l'annulation dans votre code

```csharp
async Task DoSomethingAsync(CancellationToken token) {
    for (int i = 0; i < 100; i++) {
        // Vérifier périodiquement
        token.ThrowIfCancellationRequested();

        // Ou passer le token aux méthodes async
        await Task.Delay(1000, token);
    }
}
```

## Les Bonnes pratiques

- Passez toujours `CancellationToken` aux méthodes asynchrones.
- Vérifiez l'annulation dans les opérations longues.
- Utilisez `ThrowIfCancellationRequested` pour simplifier le code, et disposez correctement de `CancellationTokenSource`.

```csharp
// Pattern recommandé
using var cts = new CancellationTokenSource();

await Task.Run(() => {
    DoWork(cts.Token); // Token utilisé dans le code métier
});
```

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
