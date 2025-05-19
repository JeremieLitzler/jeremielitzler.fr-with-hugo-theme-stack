---
title: "Injection de dépendance et durées de vie applicatives"
description: "Dans le développement de logiciels, en particulier dans le contexte de l'injection de dépendances, les durées de vie des services déterminent combien de temps une instance d'une classe est maintenue en vie."
image: 2025-05-19-dependency-injection-and-lifetimes.jpg
imageAlt: « Dependency Injection and Lifetimes » sur un fond dégradé
date: 2025-08-15
categories:
  - Software Development
tags:
  - CSharp
draft: true
---

Il existe 3 durées de vie possibles quand on utilise l'injection de dépendance : `Transient`, `Scoped` et `Singleton`.

Détaillons chacune d'entre elles avec une définition, ses cas d'utilisation respectifs et un exemple.

## Transient

Si vous avez besoin d'une nouvelle instance à chaque fois que vous demandez le service, `Transient` répond à vos besoins.

C'est ce que nous appelons des services sans état, où chaque opération est indépendante des opérations précédentes.

### Exemple de code d'un Transient

Prenons un exemple très trivial avec la programmation C# :

```csharp
public interface ITransientService
{
    void Execute();
}

public class TransientService : ITransientService
{
    public void Execute()
    {
        Console.WriteLine("Transient service executed.");
    }
}

// Enregistrement du service, généralement dans le fichier Program.cs
services.AddTransient<ITransientService, TransientService>();
```

### Cas d'utilisation courants pour un transitoire

En général, les cas d'utilisation les plus courants sont les suivants :

- **Services d'utilitaire**, qui n'ont pas besoin de maintenir un état entre les appels.
- **Services de formatage**, tels que la conversion de données dans un format de chaîne spécifique.
- **Services de calcul**, lorsque vous devez effectuer des calculs ou des transformations de données sans avoir à maintenir d'état.
- **Services d'opération**, qui effectuent une opération spécifique indépendamment chaque fois qu'ils sont appelés, comme l'envoi d'un courrier électronique ou l'enregistrement d'un événement.

Bien sûr, tous ces usages supposent que l'on a besoin d'une instanciation de classe.

## Scoped

Lorsque vous devez maintenir un état au cours d'une seule requête, mais pas au cours de plusieurs requêtes, l'utilisation du `Scoped` correspond à la durée de vie à utiliser.

Dans une application web, nous créons une nouvelle instance pour chaque requête HTTP, et nous pouvons l'utiliser pendant toute la durée de vie de la requête.

### Cas d'utilisation courants pour un `Scoped`

Voici quelques cas d'utilisation courants :

- **Entity Framework DbContext**, qui garantit une instance unique du DbContext utilisée tout au long d'une requête pour gérer les opérations de base de données, évitant ainsi les problèmes de concurrence et garantissant que toutes les modifications sont suivies et conservées correctement.
- **Le modèle d'unité de travail**, qui permet de gérer une unité de travail unique englobant plusieurs opérations de référentiel au sein d'une même requête.
- **La mise en cache par requête**, pour mettre en cache les données qui sont coûteuses à récupérer ou à calculer et qui doivent être réutilisées au sein d'une même requête, mais pas au-delà.
- **Données spécifiques à la demande** : Stockage de données spécifiques à une demande, telles que les informations d'authentification de l'utilisateur, qui doivent être accessibles par plusieurs composants au cours du traitement de la demande.

### Code Example of a Scoped

Let’s consider a scenario where we have a web application that handles user authentication and authorization. We need to access user-specific data multiple times during a single request to ensure that the user has the correct permission to access various resources.

We can use a scoped service to store and manage this user data.

1. Let’s create a `UserContextService` and its interface:

   It holds user-specific data for the duration of a single request.

   ```csharp
   public interface IUserContextService
   {
       void SetUserId(string userId);
       void SetUserName(string name);
       void SetRoles(List<string> roles);
       string GetUserId();
       string GetUserName();
       List<string> GetRoles();
   }

   public class UserContextService : IUserContextService
   {
       private string _userId;
       private string _userName;
       private List<string> _roles;

       public string SetUserId(string userId) {
        this._userId = userId;
       }
       public string SetUserName(string name) {
        this._name = name;
       }
       public List<string> SetRoles(List<string> roles) {
        this._roles = roles;
       }


       public string GetUserId() {
        return this._userId;
       }
       public string GetUserName() {
        return this._name;
       }
       public List<string> GetRoles() {
        return this._roles;
       }
   }
   ```

2. Next, let’s register the Scoped Service:

   In an `IocHelper` class (or wherever you configure your services that you call from `Program.cs`), register the `UserContextService` with a scoped lifetime.

   Below, we use an extension method registering the `UserContextService`.

   ```csharp
   public class IocHelper
   {
       public void ConfigureServices(this IServiceCollection services)
       {
           services.AddScoped<IUserContextService, UserContextService>();

           // Other service registrations...
       }

       // Other methods...
   }
   ```

3. We continue with the implementation of a Middleware to populate `UserContextService`

   We create a middleware to populate the `UserContextService` with user data at the beginning of each request.

   ```csharp
   public class UserContextMiddleware
   {
       private readonly RequestDelegate _next;

       public UserContextMiddleware(RequestDelegate next)
       {
           _next = next;
       }

       public async Task InvokeAsync(HttpContext context, IUserContextService userContextService)
       {
           // Simulate fetching user data, typically from an authentication service
           // This is where you could retrieve data from an IAM like Keycloak
           userContextService.SetUserId("123");
           userContextService.SetUserName("JohnDoe");
           userContextService.SetRoles("Admin");

           await _next(context);
       }
   }
   ```

4. Then, you register the middleware:

   ```csharp
   public class AppConfigurationHelper
   {
   		// Register the middleware
   		public void RegisterMiddlwares(this IApplicationBuilder app)
   		{
   		    app.UseMiddleware<UserContextMiddleware>();
   		    // Other middleware registrations...
   		}
   }
   ```

5. Finally, use `UserContextService` in a Controller.

   In a controller, you can inject the `IUserContextService` and use it to access user-specific data during the request.

   ```csharp
   public class HomeController : Controller
   {
       private readonly IUserContextService _userContextService;

       public HomeController(IUserContextService userContextService)
       {
           _userContextService = userContextService;
       }

       public IActionResult Index()
       {
           var userName = _userContextService.GetUserName();
           var roles = string.Join(", ", _userContextService.GetRoles());

           return Content($"Hello {userName}, you have the following roles: {roles.Join(',')}");
       }
   }
   ```

## Singleton

If you need to maintain shared state across the entire application lifetime, using a Singleton is a good choice.

It’s created once on the first request or at application startup. Every subsequent request will use the same instance.

### Common Use Cases of a Singleton

You will find that using a Singleton commonly falls into the following use cases:

- **Configuration Services,** which provide application-wide configuration settings read once and used throughout the application’s lifetime.
- **Logging Services**: Centralized logging services that need to maintain a single instance to collect and process log entries from various parts of the application.
- **Caching Services,** that need to cache data globally to avoid repeating expensive operations, such as fetching **static data** or configuration from a database.

### Example of a Singleton

The most common usage will be our example: we have a web application that needs to log activities across different modules. We want to use a single logging service that collects and processes all log entries, ensuring that log data is centralized and managed efficiently.

1. Let’s start with the implementation of a `LoggingService`

   The `LoggingService` below logs messages to a centralized log store.

   The service should be a singleton to ensure that all components use the same instance.

   ```csharp
   public interface ILoggingService
   {
       void Log(string message);
   }

   public class LoggingService : ILoggingService
   {
       private readonly List<string> _logs = new List<string>();

       public void Log(string message)
       {
           _logs.Add(message);
           Console.WriteLine($"Log entry added: {message}");
       }

       public IEnumerable<string> GetLogs()
       {
           return _logs;
       }
   }
   ```

2. Next, we register the Singleton Service

   In an `IocHelper` class (or wherever you configure your services that you call from `Program.cs`), register the `LoggingService` with a singleton lifetime.

   ```csharp
   public class IocHelper
   {
       public void ConfigureServices(this IServiceCollection services)
       {
           services.AddSingleton<ILoggingService, LoggingService>();

           // Other service registrations...
       }

       // Other methods...
   }
   ```

3. Finally, use `LoggingService` in Controllers

   In a controller, you can inject the `ILoggingService` into the constructor and use it to log messages.

   ```csharp
   public class HomeController : Controller
   {
       private readonly ILoggingService _loggingService;

       public HomeController(ILoggingService loggingService)
       {
           _loggingService = loggingService;
       }

       public IActionResult Index()
       {
           _loggingService.Log("HomeController.Index accessed.");
           return Content("Index page accessed.");
       }

       public IActionResult About()
       {
           _loggingService.Log("HomeController.About accessed.");
           return Content("About page accessed.");
       }
   }
   ```

### En savoir plus sur les durées de vie

Si vous souhaitez approfondir le sujet, vous trouverez ci-dessous quelques sources en ligne :

- **Microsoft Documentation**:
  - [Durée de vie des services dans le cadre de l'injection de dépendances](https://learn.microsoft.com/fr-fr/aspnet/core/fundamentals/dependency-injection#service-lifetimes)
  - Cet article explique les trois durées de vie (Transient, Scoped, Singleton) et fournit des conseils sur le moment où il convient d'utiliser chacune d'entre elles.
- **Module Microsoft Learn sur l'injection de dépendances dans .NET**:
  - [Injection de dépendances en .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
  - Ce module propose un examen approfondi de l'injection de dépendances dans .NET, y compris des exemples et des bonnes pratiques pour l'utilisation de différentes durées de vie de services.
- **Stack Overflow**:
  - [When to use AddTransient vs AddScoped vs AddSingleton in ASP.NET Core?](https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences)
  - Ce fil de discussion aborde les scénarios pratiques et les implications de l'utilisation de différentes durées de vie, à l'aide d'exemples et de points de vue fournis par la communauté.
- **Article de blog sur l'injection de dépendance**:
  - [Understanding Dependency Injection in .NET Core](https://auth0.com/blog/dependency-injection-in-dotnet-core/)
  - Cet article de blog couvre les bases de l'injection de dépendances dans .NET Core et explique les différentes durées de vie à l'aide d'exemples pratiques.

## Summary

Use **Transient** for stateless services that **can be recreated as needed** and **don’t hold a state**.

Use **scoped** for services that should be **unique to a single request or scope,** holding state that shouldn’t persist beyond that scope.

Use **Singleton** for services that need to **maintain a state across the entire application lifecycle** and all requests and users can access it through the various services.

I hope this short summary helped you understand the usage of each lifetime next time you work a new service for your applications.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
