---
title: "Usage du CancellationToken"
description: "Un CancellationToken (une struct en .NET / C#) propage un signal d'annulation, émis par un CancellationTokenSource, à une opération asynchrone ou de longue durée."
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

La réponse courte : toujours au code du délégué, et idéalement aussi à `Task.Run`, mais sans croire que ce second passage suffit à annuler le travail en cours.

Voici pourquoi et comment bien l'utiliser.

## Le piège du `CancellationToken` dans `Task.Run`

Le `CancellationToken` passé à `Task.Run` n'agit que sur la planification du délégué sur le `ThreadPool` : si l'annulation est demandée avant que le délégué démarre (y compris pendant qu'il attend dans la file), il n'est pas exécuté et la tâche passe à l'état `Canceled`. Une fois que le délégué s'exécute (ce qui se produit presque immédiatement), ce token n'interrompt plus rien.

Beaucoup de développeurs écrivent ceci en pensant à tort que le délégué sera annulé :

```csharp
// ⚠️ INSUFFISANT - Le token n'interrompt PAS le délégué en cours d'exécution
await Task.Run(() => {
    // Ce code ignore le cancellationToken
    DoSomething();
}, cancellationToken);
```

## La bonne approche

Passez d'abord le token au code à l'intérieur du délégué : c'est ce qui permet réellement d'interrompre le travail.

```csharp
// ✅ Le token est utilisé ICI, dans le code du délégué
await Task.Run(() => {
    DoSomething(cancellationToken);
});
```

Cela rend explicite qu'il revient au code du délégué d'honorer l'annulation de l'opération. L'annulation est coopérative : rien ne tue le délégué de l'extérieur.

Passez ensuite le même token à `Task.Run` :

```csharp
// ✅ Le token est honoré dans le délégué ET transmis à Task.Run
await Task.Run(() => {
    DoSomething(cancellationToken);
}, cancellationToken);
```

Ce second passage a deux effets utiles :

- Si le token est déjà annulé avant le démarrage, le délégué n'est pas lancé.
- Si le délégué lève une `OperationCanceledException` portant le même token, la tâche passe à `Canceled`. Sans cela, le token ne correspond pas à celui de la tâche, qui passe à `Faulted`. Un `await` lève dans les deux cas une `OperationCanceledException`, mais `IsCanceled`, `IsFaulted` et les continuations (`OnlyOnCanceled`, etc.) se comportent différemment.

## Les trois usages du CancellationToken

Prenons l'exemple suivant :

```csharp
using var cts = new CancellationTokenSource();
var token = cts.Token;

var task = Task.Run(() => {
    DoSomething(token);          // ① Interrompt l'exécution
}, token);                       // ② Empêche le démarrage / fixe l'état Canceled

try {
    await task.WaitAsync(token); // ③ Annule l'attente (pas la tâche elle-même)
}
catch (OperationCanceledException) {
    // Gestion de l'annulation
}
```

1. Dans le délégué : c'est là que ça compte vraiment. Il arrête l'exécution de `DoSomething`, à condition que la méthode soit écrite pour honorer les demandes d'annulation.
2. Dans `Task.Run` : il annule la tâche si le token est annulé AVANT que le délégué commence (ce qui est rare), et il permet à la tâche de se terminer à l'état `Canceled` plutôt que `Faulted`.
3. Dans `WaitAsync()` (ou `Wait()`) : il annule uniquement le processus d'attente de la tâche, sans réellement annuler la tâche elle-même.

{{< blockcontainer jli-notice-note "Version de .NET">}}

`Task.WaitAsync(CancellationToken)` n'existe que depuis .NET 6. Avec une version antérieure, utilisez `Task.WhenAny(task, Task.Delay(Timeout.Infinite, token))` pour obtenir un effet comparable.

{{< /blockcontainer >}}

Attention si vous utilisez la version synchrone : `task.Wait()` enveloppe l'annulation de la tâche dans une `AggregateException` (contenant une `TaskCanceledException`). Seule l'annulation de l'attente via `Wait(token)` lève directement une `OperationCanceledException`. Un `catch (OperationCanceledException)` autour de `Wait()` peut donc rater l'annulation. Préférez `await`, qui extrait l'exception qu'on souhaite vraiment.

## Comment implémenter l'annulation dans votre code

```csharp
async Task DoSomethingAsync(CancellationToken token) {
    for (int i = 0; i < 100; i++) {
        // Vérifier périodiquement (utile surtout pour le travail CPU)
        token.ThrowIfCancellationRequested();

        // Ou passer le token aux méthodes async
        await Task.Delay(1000, token);
    }
}
```

## Les Bonnes pratiques

- Passez toujours `CancellationToken` aux méthodes asynchrones.
- Vérifiez l'annulation dans les opérations longues.
- Utilisez `ThrowIfCancellationRequested` pour simplifier le code.
- Créez le `CancellationTokenSource` là où se prend la décision d'annuler (interface, délai, requête HTTP) et ne transmettez que le `CancellationToken`.
- Disposez correctement de `CancellationTokenSource`.

```csharp
// Pattern recommandé : le token vient de l'appelant, qui décide quand annuler
async Task RunAsync(CancellationToken token) {
    await Task.Run(() => DoWork(token), token);
}

// Côté appelant : annulation automatique après 5 secondes
using var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(5));

await RunAsync(cts.Token);
```

## Disposer correctement le `CancellationTokenSource`

`CancellationTokenSource` implémente `IDisposable` : il peut détenir un minuteur (après `CancelAfter`) et des enregistrements auprès d'autres tokens (sources liées). Ne pas le disposer retarde leur libération.

### Cas 1

Une source locale, avec `using` :

```csharp
using var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(5));

await DoSomethingAsync(cts.Token);
// cts est disposé en sortant de la portée
```

### Cas 2

Une source liée à un token parent, à disposer elle aussi sinon son enregistrement auprès du parent subsiste :

```csharp
async Task RunAsync(CancellationToken parentToken) {
    using var linked = CancellationTokenSource.CreateLinkedTokenSource(parentToken);
    linked.CancelAfter(TimeSpan.FromSeconds(5));

    await DoSomethingAsync(linked.Token);
}
```

### Cas 3

Une source détenue par un objet de longue durée, qui devient `IDisposable` à son tour :

```csharp
public sealed class Worker : IDisposable {
    private readonly CancellationTokenSource _cts = new();

    public Task StartAsync() => Task.Run(() => DoWork(_cts.Token), _cts.Token);

    public void Stop() => _cts.Cancel();

    public void Dispose() {
        _cts.Cancel();   // signale d'abord, au cas où une opération tourne encore
        _cts.Dispose();
    }
}
```

Ne disposez jamais la source tant que des opérations utilisent encore son token : demander `cts.Token` après le `Dispose` lève une `ObjectDisposedException`. Annulez, attendez la fin des opérations, puis disposez.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
