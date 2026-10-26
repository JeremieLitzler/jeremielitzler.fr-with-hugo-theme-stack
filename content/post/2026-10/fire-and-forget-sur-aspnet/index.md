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

Les solutions recommandées ci-dessous ne pouvaient être implémentées dans les temps. Toutefois, dans une requête de tirage qui tentait de solutionner l'anomalie, nous avons discuté d'utiliser ou pas la technique "Fire & Forget" : lancer l'envoi de l'email avec `Task.Run` sans attendre la fin de la tâche, pour rendre la main tout de suite à l'appelant.

Dans une application ASP.NET, c'est une MAUVAISE idée.

Voici pourquoi et les alternatives appropriées.

## Pourquoi est-ce problématique

### 1. Fire-and-forget est dangereux dans ASP.NET

Les tâches fire-and-forget continuent à s'exécuter après que la requête HTTP est terminée, et à ce moment-là, les objets liés à la requête (`HttpContext.Current`, un `DbContext` créé pour la durée de la requête) ne sont plus disponibles. Si votre application ASP.NET redémarre pendant l'envoi (déploiement, recyclage du pool d'applications), l'email ne sera jamais envoyé.

### 2. Aucune garantie d'exécution

Cette solution est dangereuse car elle n'est pas fiable ; il n'y a aucune garantie que le travail en arrière-plan sera réellement effectué.

```csharp
// DANGEREUX - L'email peut ne jamais être envoyé
public void CreateUser(User user) {
    _repository.Save(user);

    // Si l'app crash ou redémarre, l'email est perdu
    Task.Run(() => SendEmail(user.Email));
}
```

### 3. Problèmes avec les objets liés à la requête

```csharp
// ERREURS - NullReferenceException et ObjectDisposedException
Task.Run(() => {
    // HttpContext.Current est null en dehors du thread de la requête
    var userName = HttpContext.Current.User.Identity.Name; // BOOM!

    // Le DbContext, créé pour la durée de la requête, est déjà disposé
    _dbContext.Users.Find(userId); // BOOM!
});
```

### 4. Les exceptions sont perdues

Personne n'attend la tâche lancée par `Task.Run`, donc personne n'observe son exception. Si le serveur SMTP est injoignable, l'appelant reçoit quand même une réponse en succès, rien n'est loggé et personne ne sait que l'email n'est jamais parti.

```csharp
// SILENCIEUX - L'exception n'est jamais observée
Task.Run(() => SendEmail(user.Email)); // SmtpException perdue, aucun log
```

Depuis .NET Framework 4.5, une exception non observée ne fait plus planter le processus. Sauf si vous écoutez l'événement `TaskScheduler.UnobservedTaskException`, elle disparaît en silence.

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

Puis un worker indépendant (service Windows, Azure Function, Hangfire) traite la queue.

Alors, oui, il existe d'autres problématiques quand on commence à travailler avec des processus distribués, mais cela sera sûrement le sujet d'un autre article. En attendant, voici [une vidéo par une personne plus compétente que moi](https://vimeo.com/111998645) pour expliquer les problématiques que j'ai en tête.

### Option 2 : HostingEnvironment.QueueBackgroundWorkItem

Pour des emails non critiques dans une application qui ne redémarre pas souvent, .NET Framework 4.5.2 a introduit `HostingEnvironment.QueueBackgroundWorkItem` :

```csharp
public void CreateUser(User user) {
    _repository.Save(user);

    // ASP.NET suit cette tâche et tente de retarder l'arrêt de l'AppDomain jusqu'à sa fin
    HostingEnvironment.QueueBackgroundWorkItem(async ct => {
        await _emailService.SendAsync(user.Email, ct);
    });
}
```

Contrairement à un simple `Task.Run`, ASP.NET sait que la tâche tourne. Quand l'application s'arrête, il signale le `CancellationToken` et tente de retarder l'arrêt jusqu'à la fin de la tâche. Ce n'est qu'une tentative, pas une garantie : si le processus plante ou si l'arrêt n'attend pas assez longtemps, l'email est perdu.

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

| Approche                | Fiabilité      | Complexité  | Cas d'usage                    |
| ----------------------- | -------------- | ----------- | ------------------------------ |
| Task.Run                | ❌ Très faible | Faible      | Jamais                         |
| Await direct            | ✅ Haute       | Très faible | Email non-critique, API rapide |
| Queue + Worker          | ✅ Très haute  | Haute       | Production, emails critiques   |
| Hangfire                | ✅ Haute       | Moyenne     | Jobs avec retry                |
| QueueBackgroundWorkItem | ⚠️ Moyenne     | Faible      | Tâches internes non-critiques  |

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
