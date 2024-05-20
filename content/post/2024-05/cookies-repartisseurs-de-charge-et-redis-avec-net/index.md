---
title: "Cookies, répartisseurs de charge et Redis avec .NET"
description: "Un de mes collègues a récemment travaillé sur un problème de cookie pour une application “backend” .NET en utilisant le cookie pour valider une certaine logique commerciale. Voici comment procéder."
image: images/2024-05-17-some-started-to-eat-a-cookie.jpg
imageAlt: "Quelqu’un a commencé à manger un cookie."
date: 2024-05-17
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Redis
  - .NET Core
---

## Le contexte du problème

Le projet utilisait une infrastructure basée sur plusieurs `pods` (c’est-à-dire une VM) utilisant Openshift pour équilibrer la charge du _frontend_ et du _backend_.

Sur le projet, nous avons utilisé Redis pour stocker les cookies.

## Le problème

Sans répartition de charge active, aucun problème n’est survenu. L’application posait les cookies et les applications fonctionnaient comme prévu.

Lorsque le projet l’a activé, les applications ont cessé de fonctionner.

Pourquoi ?

## La solution

Les cookies nécessaires au fonctionnement de la logique métier étaient absents.

Comment mon collègue a-t-il résolu le problème ?

Tout d’abord, il a créé une classe de magasin de session pour gérer les opérations CRUD dans le cache Redis :

```csharp
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Distributed;

namespace My.Project.Business.Core.Services.Cache
{
    public class RedisCacheSessionStore : ITicketStore
    {
        private readonly IDistributedCache _cache;
        private const string KeyPrefix = "auth-myapp-";

        public RedisCacheSessionStore(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<string> StoreAsync(AuthenticationTicket ticket)
        {
            var key = $"{KeyPrefix}-{Guid.NewGuid()}";
            var value = Serialize(ticket);

            await _cache.SetAsync(key, value);

            return key;
        }

        public async Task RenewAsync(string key, AuthenticationTicket ticket)
        {
            var value = Serialize(ticket);

            await _cache.SetAsync(key, value);
        }

        public async Task<AuthenticationTicket> RetrieveAsync(string key)
        {
            var value = await _cache.GetAsync(key);

            return value == null ? null : Deserialize(value);
        }

        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }

        private static byte[] Serialize(AuthenticationTicket source)
        {
            return TicketSerializer.Default.Serialize(source);
        }

        private static AuthenticationTicket Deserialize(byte[] source)
        {
            return source == null ? null : TicketSerializer.Default.Deserialize(source);
        }
    }

}
```

À partir de là, mon collègue a modifié la classe de gestion des cookies pour ajouter ou récupérer des cookies.

```csharp
using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace My.Project.Business.Core.Services.Cache
{
    public class RedisCookieManager : ICookieManager
    {
        private readonly IDistributedCache _cache;

        public RedisCookieManager(IDistributedCache cache)
        {
            _cache = cache;
        }

        string? ICookieManager.GetRequestCookie(HttpContext context, string key)
        {

            var result = _cache.GetString(key);
            return result;
        }

        void ICookieManager.AppendResponseCookie(HttpContext context, string key, string? value, CookieOptions options)
        {
            //var redisKey = $"{sessionId}:cookies:{key}";

            var optionsWithExpiry = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
            };

            _cache.SetString(key, value, optionsWithExpiry);
        }

        void ICookieManager.DeleteCookie(HttpContext context, string key, CookieOptions options)
        {
            var redisKey = key;
            _cache.Remove(redisKey);
        }
    }

}
```

Ensuite, mon collègue a ajouté la classe cookie manager en tant que `Singleton` dans la méthode d’extension enregistrant les services (`public static void RegisterServices(this IServiceCollection services, IConfigurationRoot configuration, bool isTestEnvironment)`).

```csharp
services.AddSingleton<ICookieManager, RedisCookieManager>(provider =>
{
    var cache = provider.GetRequiredService<IDistributedCache>();
    return new RedisCookieManager(cache);
});
```

Enfin, mon collègue a mis à jour le code de démarrage de `Program.cs` pour utiliser la nouvelle dépendance dont on avait besoin pour lire le cookie de `OpenIdConnect` :

```csharp
public partial class Program {
  private const string API_CORS_POLICY = "ApiCorsPolicy";

    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        // Dependency Injection for Services
        builder.Services.RegisterServices(Configuration);
        // Dependency Injection for Controllers
        builder.Services.RegisterControllers(Configuration);
        // Register Loggers
        builder.Logging.RegisterLoggingProviders(Configuration, builder.Services);
        builder
            .AddCookie()
            .AddOpenIdConnect(options => {
                // ... some code is omitted for brevity
                OnTokenValidated = context => {
                    var idToken = context.SecurityToken.RawData; // Token ID
                    var accessToken = context.SecurityToken.RawData; // Access Token
                    var refreshToken = context.SecurityToken.RawData; // Refresh Token
                    var sessionId = context.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var key = $ "{sessionId}:cookies:app-auth";

                    context.HttpContext.RequestServices.GetRequiredService<ICookieManager>()
                            .AppendResponseCookie(context.HttpContext, key, accessToken, new CookieOptions());
                        return Task.CompletedTask;
                        }
                    };
                });

        var app = builder.Build();
        app.Run();
    }
}
```

Crédit: Photo par [Vyshnavi Bisani](https://unsplash.com/@vyshnavibisani?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/brown-round-cookie-on-white-surface-z8kriatLFdA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
