---
title: "Injection de dépendance et durées de vie applicatives"
description: "Dans le développement de logiciels, en particulier dans le contexte de l’injection de dépendances, les durées de vie des services déterminent combien de temps une instance d’une classe est maintenue en vie."
image: 2025-05-19-dependency-injection-and-lifetimes.jpg
imageAlt: "« Dependency Injection and Lifetimes » sur un fond dégradé"
date: 2025-08-15
categories:
  - Développement Logiciel
tags:
  - CSharp
---

Il existe 3 durées de vie possibles quand on utilise l’injection de dépendance : `Transient`, `Scoped` et `Singleton`.

Détaillons chacune d’entre elles avec une définition, ses cas d’utilisation respectifs et un exemple.

## Transient

Si vous avez besoin d’une nouvelle instance à chaque fois que vous demandez un service, `Transient` répond à vos besoins.

C’est ce que nous appelons des services sans état, où chaque opération est indépendante des opérations précédentes.

### Exemple de code d’un `Transient`

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

### Cas d’utilisation courants pour un `Transient`

En général, les cas d’utilisation les plus courants sont les suivants :

- **Services d’utilitaire**, qui n’ont pas besoin de maintenir un état entre les appels.
- **Services de formatage**, tels que la conversion de données dans un format de chaîne spécifique.
- **Services de calcul**, lorsque vous devez effectuer des calculs ou des transformations de données sans avoir à maintenir d’état.
- **Services d’opération**, qui effectuent une opération spécifique indépendamment chaque fois qu’ils sont appelés, comme l’envoi d’un courrier électronique ou l’enregistrement d’un événement.

Bien sûr, tous ces usages supposent que l’on a besoin d’une instanciation de classe. Dans le cas de classes statiques, vous n’avez pas besoin de `Transient`.

## Scoped

Lorsque vous devez maintenir un état au cours d’une seule requête, mais pas au cours de plusieurs requêtes, l’utilisation du `Scoped` correspond à la durée de vie à utiliser.

Dans une application web, nous créons une nouvelle instance pour chaque requête HTTP, et nous pouvons l’utiliser pendant toute la durée de vie de la requête.

### Cas d’utilisation courants pour un `Scoped`

Voici quelques cas d’utilisation courants :

- **Le `DbContext` d’_Entity Framework_**, qui garantit une instance unique du `DbContext` utilisée tout au long d’une requête pour gérer les opérations de base de données. Cela évite ainsi les problèmes de concurrence et garantissant que toutes les modifications sont suivies et conservées correctement.
- **Le modèle d’unité de travail**, qui permet de gérer une unité de travail unique englobant plusieurs opérations de référentiel au sein d’une même requête.
- **La mise en cache par requête**, pour mettre en cache les données qui sont coûteuses à récupérer ou à calculer et qui doivent être réutilisées au sein d’une même requête, mais pas au-delà.
- **Données spécifiques à la demande** : pour le stockage de données spécifiques à une demande, telles que les informations d’authentification de l’utilisateur, qui doivent être accessibles par plusieurs composants au cours du traitement de la demande.

### Exemple de code pour un `Scoped`

Considérons un scénario dans lequel nous avons une application web qui gère l’authentification et l’autorisation des utilisateurs. Nous devons accéder à plusieurs reprises aux données spécifiques à l’utilisateur au cours d’une seule requête afin de nous assurer que l’utilisateur dispose des autorisations nécessaires pour accéder à diverses ressources.

Nous pouvons utiliser un service à portée pour stocker et gérer ces données utilisateur.

1. Créons un `UserContextService` et son interface.:

   Il contient des données spécifiques à l’utilisateur pendant la durée d’une seule requête.

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

2. Ensuite, enregistrons le service en tant que service `Scoped` :

   Dans une classe `IocHelper` (ou à l’endroit où vous configurez vos services que vous appelez depuis `Program.cs`), enregistrez le `UserContextService` avec une durée de vie limitée.

   Ci-dessous, nous utilisons une méthode d’extension `ConfigureServices` qui enregistre le `UserContextService`.

   ```csharp
   public class IocHelper
   {
       public void ConfigureServices(this IServiceCollection services)
       {
           services.AddScoped<IUserContextService, UserContextService>();
           // Autres enregistrements de services peuvent suivre...
       }

   }
   ```

3. Nous poursuivons la mise en œuvre d’un middleware pour alimenter `UserContextService`

   Nous créons un middleware pour remplir le `UserContextService` avec les données utilisateur au début de chaque requête.

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

4. Ensuite, nous enregistrons le middleware.:

   ```csharp
   public class AppConfigurationHelper
   {
   		// Enregistrer le middleware
   		public void RegisterMiddlwares(this IApplicationBuilder app)
   		{
   		    app.UseMiddleware<UserContextMiddleware>();
   		    // Autres enregistrements de middleware...
   		}
   }
   ```

5. Enfin, on peut aussi utiliser `UserContextService` dans un contrôleur.

   Dans un contrôleur, vous pouvez injecter le `IUserContextService` et l’utiliser pour accéder aux données spécifiques à l’utilisateur pendant la requête.

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

           return Content($"Bonjour {userName}, Vous avez les rôles suivants : {roles.Join(',')}");
       }
   }
   ```

## Singleton

Si vous avez besoin de maintenir un état partagé pendant toute la durée de vie de l’application, l’utilisation d’un singleton est un bon choix.

Il est créé une seule fois lors de la première requête ou au démarrage de l’application. Chaque requête suivante utilisera la même instance.

### Cas d’utilisation courants d’un `Singleton`

Vous rencontrerez une utilisation de singletons dans les cas d’utilisation suivants :

- **Services de configuration**, qui fournissent des paramètres de configuration à l’échelle de l’application, lus une seule fois et utilisés tout au long du cycle de vie de l’application.
- **Services de journalisation** : services de journalisation centralisés qui doivent maintenir une instance unique pour collecter et traiter les entrées de journal provenant de différentes parties de l’application.
- **Services de mise en cache**, qui doivent mettre en cache les données de manière globale afin d’éviter de répéter des opérations coûteuses. Par exemple, la récupération de **données statiques** ou de configurations à partir d’une base de données.

### Exemple de code pour un `Singleton`

L’utilisation la plus courante sera notre exemple : nous avons une application web qui doit enregistrer les activités dans différents modules. Nous voulons utiliser un service de journalisation unique qui collecte et traite toutes les entrées de journal, garantissant ainsi que les données de journalisation sont centralisées et gérées efficacement.

1. Commençons par la mise en œuvre d’un `LoggingService`

   Le `LoggingService` enregistre les messages dans un magasin de journaux centralisé.

   Le service doit être un singleton afin de garantir que tous les composants utilisent la même instance.

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

2. Ensuite, nous enregistrons le service Singleton.

   Dans une classe `IocHelper` (ou à l’endroit où vous configurez vos services que vous appelez depuis `Program.cs`), enregistrez le `LoggingService` avec une durée de vie singleton.

   ```csharp
   public class IocHelper
   {
       public void ConfigureServices(this IServiceCollection services)
       {
           services.AddSingleton<ILoggingService, LoggingService>();
       }
   }
   ```

3. Enfin, utilisez `LoggingService` dans les contrôleurs ou les services.

   Dans un contrôleur, vous pouvez injecter le `ILoggingService` dans le constructeur et l’utiliser pour enregistrer des messages.

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

## En savoir plus sur les durées de vie

Si vous souhaitez approfondir le sujet, vous trouverez ci-dessous quelques ressources en ligne :

- **Microsoft Documentation**:
  - [Durée de vie des services dans le cadre de l’injection de dépendances](https://learn.microsoft.com/fr-fr/aspnet/core/fundamentals/dependency-injection#service-lifetimes)
  - Cet article explique les trois durées de vie (Transient, Scoped, Singleton) et fournit des conseils sur le moment où il convient d’utiliser chacune d’entre elles.
- **Module Microsoft Learn sur l’injection de dépendances dans .NET**:
  - [Injection de dépendances en .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
  - Ce module propose un examen approfondi de l’injection de dépendances dans .NET, y compris des exemples et des bonnes pratiques pour l’utilisation de différentes durées de vie de services.
- **Stack Overflow**:
  - [When to use AddTransient vs AddScoped vs AddSingleton in ASP.NET Core?](https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences)
  - Ce fil de discussion aborde les scénarios pratiques et les implications de l’utilisation de différentes durées de vie, à l’aide d’exemples et de points de vue fournis par la communauté.
- **Article de blog sur l’injection de dépendance**:
  - [Understanding Dependency Injection in .NET Core](https://auth0.com/blog/dependency-injection-in-dotnet-core/)
  - Cet article de blog couvre les bases de l’injection de dépendances dans .NET Core et explique les différentes durées de vie à l’aide d’exemples pratiques.

## Summary

Utilisez **Transient** pour les services sans état qui **peuvent être recréés selon les besoins** et **ne conservent pas d’état**.

Utilisez **Scoped** pour les services qui doivent être **uniques à une seule requête HTTP**, conservant un état qui ne doit pas persister au-delà de cette requête HTTP.

Utilisez **Singleton** pour les services qui doivent **conserver un état tout au long du cycle de vie de l’application** et auxquels toutes les requêtes et tous les utilisateurs peuvent accéder via les différents services.

J’espère que ce bref résumé vous aura aidé à comprendre l’utilisation de chaque durée de vie la prochaine fois que vous travaillerez sur un nouveau service pour vos applications.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
