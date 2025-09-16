---
title: "Cas d'utilisation courants des filtres d'action dans ASP.Net WebAPI"
description: "Dans ASP.Net WebAPI, les filtres d'action sont couramment utilisés pour diverses préoccupations transversales qui doivent être appliquées à plusieurs méthodes d'action ou contrôleurs."
image: 2025-09-08-several-coffee-cups.jpg
imageAlt: Plusieurs tasses à café
date: 2025-09-08
categories:
  - Développement web
tags:
  - ASP.Net
  - Web API
  - Csharp
---

Voici quelques cas d’utilisation courants des filtres d’action.

## Cas d’utilisation

### Authentification et autorisation

Vous pouvez implémenter des filtres d’action sur la logique d’authentification et d’autorisation. Le résultat d’un tel cas d’utilisation garantit que seuls les utilisateurs autorisés peuvent accéder à certaines actions ou certains contrôleurs.

```csharp
public class CustomAuthorizeAttribute : AuthorizeAttribute
{
    protected override bool IsAuthorized(HttpActionContext actionContext)
    {
        // Logique d'authentification personnalisée
    }
}
```

Ce qui précède concerne spécifiquement .NET Framework, je vais donc vous donner également la version .NET Core :

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class CustomAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Logique d'autorisation personnalisée
        var user = context.HttpContext.User;
        if (!user.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }
        // Autre logique...
    }
}
```

### Journalisation et diagnostics

Vous pouvez également utiliser des filtres d’action pour consigner les détails de la requête et de la réponse HTTP, ce qui peut être utile pour le débogage.

```csharp
public class LoggingFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(HttpActionContext actionContext)
    {
        // Enregistrer les détails de la requête avant son traitement
    }
    public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
    {
        // Enregistrer les détails de la réponse après l'exécution de la logique métier.
    }
}
```

Dans le style .NET Core, le code change légèrement. Les types de paramètres passent de `HttpActionContext` et `HttpActionExecutedContext` (.NET Framework) à `ActionExecutingContext` et `ActionExecutedContext` (ASP.NET Core).

L’enregistrement et l’application fonctionnent presque de la même manière, mais peuvent utiliser DI et `ServiceFilter` ou `TypeFilter` pour les filtres injectés.

```csharp
using Microsoft.AspNetCore.Mvc.Filters;

public class LoggingFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        // Enregistrer les détails de la requête avant son traitement
    }

    public override void OnActionExecuted(ActionExecutedContext context)
    {
        // Enregistrer les détails de la réponse après l'exécution de la logique métier.
    }
}
```

Un cas d’utilisation concret serait d’enregistrer le temps écoulé pour traiter la requête en démarrant un observateur sur `OnActionExecuting` et en l’arrêtant sur `OnActionExecuted`.

### Gestion des exceptions

Si vous devez gérer les exceptions de manière globale, les filtres d’action permettent une approche cohérente de la gestion des erreurs sur plusieurs contrôleurs ou actions.

```csharp
public class CustomExceptionFilterAttribute : ExceptionFilterAttribute
{
    public override void OnException(HttpActionExecutedContext context)
    {
        // Logique personnalisée de gestion des exceptions
    }
}
```

Avec .NET Core, cela ressemblerait à ceci :

```c#
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class CustomExceptionFilterAttribute : ExceptionFilterAttribute
{
    public override void OnException(ExceptionContext context)
    {
        // Logique de gestion des exceptions personnalisée
        // Par exemple : définir context.Result sur un IActionResult personnalisé, consigner l'exception

        context.Result = new ObjectResult(new { Error = context.Exception.Message })
        {
            StatusCode = 500
        };
        context.ExceptionHandled = true;
    }
}
```

### Mise en cache

Les filtres d’action peuvent gérer les stratégies de mise en cache en ajoutant des en-têtes de mise en cache à la réponse ou en implémentant des mécanismes de mise en cache côté serveur.

Le code ressemble exactement à l’exemple de journalisation.

### Validation des entrées

Un dernier cas d’utilisation courant est la validation des données de la requête entrante avant l’exécution de la méthode d’action.

Le code ressemble exactement à l’exemple de journalisation.

### Pour en savoir plus sur le sujet

Pour la documentation Microsoft, voici quelques articles qui vous permettront d’approfondir le sujet avec .NET Framework :

- [Gestionnaires de messages HTTP dans API Web ASP.NET](https://learn.microsoft.com/fr-fr/aspnet/web-api/overview/advanced/http-message-handlers).
- [Using Action Filters in ASP.NET Web API](https://learn.microsoft.com/fr-fr/aspnet/web-api/overview/advanced/http-message-handlers#example-x-http-method-override)
- [Gestion globale des erreurs dans API Web ASP.NET 2](https://learn.microsoft.com/fr-fr/aspnet/web-api/overview/error-handling/web-api-global-error-handling)

Pour .NET Core, allez lire :

- [ce guide](https://learn.microsoft.com/fr-fr/aspnet/core/mvc/controllers/filters?view=aspnetcore-9.0) pour les filtres
- [ce guide](https://learn.microsoft.com/fr-fr/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-9.0&tabs=minimal-apis) pour les exceptions.

## Comment les utiliser dans les contrôleurs ?

Pour utiliser les filtres d’action dans les contrôleurs ASP.Net WebAPI, vous pouvez les appliquer de plusieurs façons :

### Au niveau de la méthode d’action

Vous pouvez appliquer un filtre d’action à une méthode d’action spécifique en décorant la méthode avec l’attribut de filtre.

```csharp
public class ProductsController : ApiController
{
    [LoggingFilter]
    [ValidateModel]
    public IHttpActionResult Post(Product product)
    {
        // Logic de la méthode
        return Ok();
    }
}
```

### Au niveau du contrôleur

Vous pouvez appliquer un filtre d’action à toutes les méthodes d’action d’un contrôleur en décorant la classe du contrôleur avec l’attribut filtre.

```csharp
[LoggingFilter]
[Authorize]
public class ProductsController : ApiController
{
    [ValidateModel]
    public IHttpActionResult Post(Product product)
    {
        return Ok();
    }

    public IHttpActionResult Get(int id)
    {
        return Ok();
    }
}
```

### Au niveau de l’application (sur tous les contrôleurs)

Vous pouvez appliquer un filtre d’action à tous les contrôleurs et actions de votre application WebAPI.

Pour ce faire, enregistrez le filtre dans la classe `WebApiConfig`.

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // Autre code de configuration...

        config.Filters.Add(new LoggingFilterAttribute());
        config.Filters.Add(new CustomExceptionFilterAttribute());
    }
}
```

Ce qui précède fonctionne pour les applications .NET Framework. Sur .NET Core, vous le feriez dans la méthode `ConfigureServices` :

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers(options =>
    {
        options.Filters.Add(typeof(LoggingFilterAttribute));
        options.Filters.Add(typeof(CustomExceptionFilterAttribute));
    });
}
```

ou dans .NET 6+ (`Program.cs`) :

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Filters.Add<LoggingFilterAttribute>();
    options.Filters.Add<CustomExceptionFilterAttribute>();
});

var app = builder.Build();
app.MapControllers();
app.Run();
```

## Conclusion

Les filtres d’action dans ASP.NET Web API et .NET Core sont un mécanisme polyvalent qui permet aux développeurs de gérer de manière centralisée les problèmes transversaux, tels que l’**authentification**, la **journalisation**, la **gestion des exceptions**, la **mise en cache** et la **validation des entrées** dans les contrôleurs et les actions.

En configurant ces filtres au niveau de l’action, du contrôleur ou de la portée globale, le code de l’application reste propre et facile à maintenir, tandis que les tâches d’infrastructure cruciales sont gérées de manière cohérente.

L’utilisation des filtres d’action améliore la sécurité, la fiabilité et les performances, ce qui les rend essentiels pour un développement API robuste dans les environnements .NET modernes.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Lucas Andrade](https://www.pexels.com/photo/man-hand-pouring-coffee-20643647/).
