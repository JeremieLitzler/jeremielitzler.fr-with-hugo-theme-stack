---
title: "« Fire & Forget » sur ASP.Net"
description: ""
image: -.jpg
imageAlt:
date:
categories:
  - ???
tags:
  -
---

L'année dernière, une API a été remontée comme très lente. En analysant le temps passé par tous les éléments dans la chaîne du code, l'envoi d'email est ressorti comme problématique.

Dans le contexte projet à ce moment, il n'y avait _pas de temps_ pour changer le code, surtout qu'on était en pleine migration en plusieurs étapes de .NET Framework vers .NET.

Les solutions recommandées ci-dessous ne pouvaient être implémentées dans les temps. Toutefois, dans une requête de tirage qui tentait de solutionner l'anomalie, nous avons discuté d'utiliser ou pas la technique "Fire & Forget" avec `Task.Run`. Mais que devions-nous passer comme `CancellationToken` ?

Passer `default` (= CancellationToken.None) dans une méthode synchrone pour déporter un envoi d'email avec `Task.Run` est une MAUVAISE idée.

Voici pourquoi et les alternatives appropriées.

## Pourquoi est-ce problématique

### 1. Fire-and-forget est dangereux dans ASP.NET

Les tâches fire-and-forget continuent à s'exécuter après que la requête HTTP est terminée, et à ce moment-là, les services scopés seront déjà disposés. Si votre application ASP.NET redémarre pendant l'envoi (déploiement, recyclage du pool d'applications), l'email ne sera jamais envoyé.

### 2. Aucune garantie d'exécution

Cette solution est dangereuse car elle n'est pas fiable ; il n'y a aucune garantie que le travail en arrière-plan sera réellement effectué.

```csharp
// DANGEREUX - L'email peut ne jamais être envoyé
public void CreateUser(User user) {
    _repository.Save(user);

    // Si l'app crash ou redémarre, l'email est perdu
    Task.Run(() => SendEmail(user.Email), default);
}
```

### 3. Problèmes avec les services scopés

```csharp
// ERREUR - ObjectDisposedException
Task.Run(() => {
    // DbContext est déjà disposé après la fin de la requête
    _dbContext.Users.Find(userId); // BOOM!
}, default);
```

## Quelles solutions sont recommandées

### Option 1 : Queue fiable + Worker (Recommandé pour la production)

```csharp
// ✅ MEILLEURE APPROCHE
public async Task CreateUser(User user) {
    await _repository.SaveAsync(user);

    // Ajouter à une queue fiable (Azure Queue, RabbitMQ, etc.)
    await _messagingClient.PublishAsync(new EmailMessage {
        To = user.Email,
        Subject = "Bienvenue"
    });
}
```

Puis un worker indépendant (Azure Function, BackgroundService, Hangfire) traite la queue.

Alors, oui, il existe d'autres problématiques quand on commence à travailler avec des processus distribués, mais cela sera sûrement le sujet d'un autre article. En attendant, voici [une vidéo par une personne plus compétente que moi](https://vimeo.com/111998645) pour expliquer les problématiques que j'ai en tête.

### Option 2 : IHostedService avec BackgroundService

Pour des emails non critiques dans une application qui ne redémarre pas souvent :

```csharp
public class EmailBackgroundService : BackgroundService {
    private readonly Channel<EmailMessage> _queue;

    protected override async Task ExecuteAsync(CancellationToken ct) {
        await foreach (var email in _queue.Reader.ReadAllAsync(ct)) {
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            await emailService.SendAsync(email, ct);
        }
    }
}
```

### Option 3 : Attendre simplement l'envoi

La plupart des fournisseurs d'email fonctionnent en plaçant les emails envoyés dans une queue, et la livraison réelle se produit plus tard. L'appel API est souvent rapide (< 100ms).

```csharp
// ✅ SIMPLE ET FIABLE
public async Task CreateUser(User user) {
    await _repository.SaveAsync(user);
    await _emailService.SendAsync(user.Email); // Rapide, juste met en queue
}
```

### Option 4 : Hangfire (Si vous avez besoin d'un système de jobs)

```csharp
// ✅ FIABLE avec retry automatique
public void CreateUser(User user) {
    _repository.Save(user);
    BackgroundJob.Enqueue(() => SendEmailJob(user.Email));
}
```

### Résumé

| Approche           | Fiabilité      | Complexité  | Cas d'usage                    |
| ------------------ | -------------- | ----------- | ------------------------------ |
| Task.Run + default | ❌ Très faible | Faible      | Jamais                         |
| Await direct       | ✅ Haute       | Très faible | Email non-critique, API rapide |
| Queue + Worker     | ✅ Très haute  | Haute       | Production, emails critiques   |
| Hangfire           | ✅ Haute       | Moyenne     | Jobs avec retry                |
| BackgroundService  | ⚠️ Moyenne     | Moyenne     | Tâches internes non-critiques  |

## Sources

- [Microsoft Community Hub - Fire-and-Forget Methods in C#](https://techcommunity.microsoft.com/blog/educatordeveloperblog/fire-and-forget-methods-in-c-%E2%80%94-best-practices--pitfalls/4299605)
- [Stephen Cleary - AspNetBackgroundTasks](https://techcommunity.microsoft.com/blog/educatordeveloperblog/fire-and-forget-methods-in-c-%E2%80%94-best-practices--pitfalls/4299605)
- [Microsoft Learn - Background tasks with IHostedService](https://techcommunity.microsoft.com/blog/educatordeveloperblog/fire-and-forget-methods-in-c-%E2%80%94-best-practices--pitfalls/4299605)

## Conclusion

Donc, n'utilisez jamais le _fire-and-forget_ avec Task.Run dans ASP.NET. Utilisez une queue fiable ou attendez simplement l'opération si elle est rapide.

Dans le cas présenté ci-dessus, on a décidé de partir avec l'option 3 dans la phase du projet dans laquelle on se trouvait, sacrifiant la performance dans un environnement de non-production.

En effet, le serveur SMTP était configuré pour déposer les emails dans un dossier dont le chemin était un chemin UNC. Les appels prenaient ~25 s par appel quand on enchaînait rapidement ceux-ci, le premier appel étant toujours rapide (500 ms).

En attendant 10 s entre chaque appel, on avait systématiquement un temps d'exécution de l'appel API en 500 ms environ. Le pourquoi est une histoire pour un autre article... Mais à ce jour, je n'ai pas trouvé la cause de ce comportement.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
