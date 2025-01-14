---
title: "Intégrer OpenIddict à une application .NET Core 8 sur Azure"
description: "OpenIddict vise à fournir une solution polyvalente pour mettre en œuvre un client et un serveur OpenID Connect pour supporter la validation de jeton JWT dans n'importe quelle application .NET. Je décrirai dans cet article les étapes à suivre pour réaliser un cas d'utilisation simple."
image: 2025-01-06-openiddict-homepage-doc-webiste-screenshot.jpg
imageAlt: Capture d'écran de la page d'accueil d'Openiddict
date: 2025-01-08
categories:
  - Développement Web
tags:
  - Authentification
  - Microsoft Azure
  - Dot Net Core
---

J’avais besoin de créer une application RESTFul simple permettant de simuler un service web fourni par un client, mais inaccessible depuis mon environnement pour des raisons de sécurité.

De plus, certains points d’accès seraient interrogés via l’authentification de base et d’autres via le standard OpenID OAuth2.

Ce ne fut pas très simple, car, en même temps, je me débattais avec :

- Trouver les logs de l’application dans mon _App Service_ pour déboguer le déploiement vers Azure.
- Ajouter les bons liens entre les ressources avec des permissions très limitées dans mon organisation.

Entrons dans le vif du sujet !

## Conditions préalables

Vous aurez besoin de :

- Compléter [le guide suivant](../../2024-12/deployer-une-app-net-core-8-sur-azure/index.md) pour démarrer le projet.
- Une instance SQL Server pour créer une nouvelle base de données. Toutefois vous pouvez sûrement utiliser un autre type de base de données, comme MySQL ou Postgresql. Vous en avez besoin pour la base de données _OpenIddict_ où vous stockez les applications autorisées et les jetons. Vous pouvez également utiliser une base de données SQLite. Personnellement, j’avais déjà un serveur SQL provisionné.

## Créer la base de données `openiddict`.

Je vais utiliser un serveur SQL pour héberger les données de _OpenIddict._ Comme indiqué ci-dessus, vous pouvez choisir un autre pilote.

Vous devrez le provisionner avant de continuer.

Voici les étapes à suivre :

- Naviguez sur le portail Azure.
- Recherchez et sélectionnez _SQL Databases_ (Bases de données SQL) dans la bar de recherche.
- Cliquez sur _Create_ (Créer).

Note : si vous n’avez pas encore d’instance SQL, le portail Azure vous demandera de la créer. Utilisez _SQL authentication_ pour créer les informations d’identification permettant de se connecter l’instance sur SQL Server Management Studio (en abrégé _SSMS_) et depuis l’application que nous allons créer.

### Sous l’onglet _Basics_

- Assurez-vous de sélectionner le _Subscription_ et le _Ressource Group_
- Définissez le nom de la base de données à _openiddict_.
- Définissez l’instance du serveur (ou créez-en une).
- Laissez _Want to use SQL elastic pool_ à _No_.
- Laissez _Workload environment_ à _Development_.
- Configurez le _Compute + storage_ à _Basic tier_ avec 500 MB Storage.
- Choisissez _Sauvegarde localement redondante_.

### Sous l’onglet _Networking_

Laisser les valeurs par défaut telles quelles.

### Sous l’onglet _Security_

Laisser les valeurs par défaut telles quelles.

### Sous l’onglet _Additional settings_

- Choisissez la _Collation_ à `French_CI_AS` ou la valeur que vous souhaitez.
- Laisser les autres valeurs telles quelles.

### Sous l’onglet _Tags_

Ajoutez les étiquettes nécessaires.

### Sous l’onglet _Review + create_

Vérifiez le résumé et cliquez sur _Create_.

## Modifier le `Program.cs` pour utiliser SQL Server

Tout d’abord, ajoutez les paquets _nuget_ ci-dessous :

```powershell
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.11
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.11
dotnet add package OpenIddict.AspNetCore --version 5.8.0
dotnet add package OpenIddict.EntityFrameworkCore --version 5.8.0
```

Ensuite, vous devez créer la classe `ApplicationDbContext` dans un dossier `Models` :

```csharp
using Microsoft.EntityFrameworkCore;

namespace DemoWebApiWithOpenIddict.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) { }
}

```

Ensuite, déclarez la classe juste après l’enregistrement des contrôleurs dans le `Program.cs` :

```csharp
using DemoWebApiWithOpenIddict.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.Configuration;

using var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder
    .SetMinimumLevel(LogLevel.Trace)
    .AddConsole());

ILogger logger = loggerFactory.CreateLogger<Program>();
logger.LogInformation("Program.cs logger ready :)");

logger.LogInformation("Program.cs > init builder...");

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Configurer le contexte pour utiliser le serveur SQL.
    var dbServer = RetrieveValueFromConfig(builder, "DbServer", logger);
    var dbUser = RetrieveValueFromConfig(builder, "DbUser", logger);
    var dbPassword = RetrieveValueFromConfig(builder, "DbPassword", logger);
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
    options.UseSqlServer(string.Format(connectionString, dbServer, dbUser, dbPassword));

    // Enregistrer les ensembles d'entités nécessaires à OpenIddict.
    options.UseOpenIddict();
});

static string RetrieveValueFromConfig(WebApplicationBuilder builder, string key, ILogger logger)
{
    var keyValue = builder.Configuration[key];
    return keyValue ?? throw new ConfigurationErrorsException($"Missing <{key}> environment value in App Service");
}

```

Vous devez déclarer le `ConnectionString` dans votre `appsettings.json`.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server={0};Initial Catalog=openiddict;Persist Security Info=False;User ID={1};Password={2};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

Localement, nous définirons les placeholders définis dans la chaîne de connexion dans le fichier `appsettings.Development.json` :

```json
{
  "DbServer": "tcp:your-db-server.database.windows.net,1433",
  "DbUser": "your_user",
  "DbPassword": "Y0urPa55w0rd!"
}
```

Sur la ressource _App Service_, nous devons ajouter les 3 variables ci-dessus sous la lame _Environment variables_ du _App Service_.

Cliquez sur « + _Add »_ pour chaque variable et fournissez son nom et sa valeur tels que définis dans le fichier JSON. Par défaut, je coche la case « _Deployment slot setting_ » pour m’assurer que Microsoft Azure utilise le paramètre lors de la création d’un slot (un autre sujet en soi dont je parlerai un jour).

Pour tester, nous aurons besoin de compléter quelques étapes supplémentaires.

Note : vous pouvez stocker la `ConnectionString` dans un KeyVault. J’ai choisi les variables d’environnement pour stocker le serveur, l’utilisateur et le mot de passe pour des raisons de simplicité.

## Le _Key Vault_

### Pourquoi un _Key Vault_

Pour protéger les jetons générés, le client et le serveur d’OpenIddict utilisent deux types d’informations d’identification :

- **Les identifiants de signature**, utilisés pour se protéger contre la falsification.
- **Les identifiants de chiffrement**, utilisés pour s’assurer que le contenu des jetons ne peut pas être lu par des utilisateurs ou applications malveillants.

Source : [https://documentation.openiddict.com/configuration/encryption-and-signing-credentials](https://documentation.openiddict.com/configuration/encryption-and-signing-credentials)

Vous devez stocker ces certificats dans un endroit sûr : le _Kez Vault_ ou « coffre fort ».

La création d’un coffre-fort est simple. Je ne vais pas entrer dans les détails maintenant parce que je l’ai détaillée dans mon guide « [**Déployer une API REST Python vers Microsoft Azure**](../../2024-08/deployer-une-api-rest-python-sur-microsoft-azure/index.md) ».

### Configurer le _Key Vault_

Vous devez :

- Générer les certificats.
- Lire les certificats depuis l’application dans Azure.

Pour générer les certificats, vous avez besoin d’une politique d’accès. En fonction de votre ancienneté dans votre organisation, vous pouvez ne pas avoir la permission de lister les utilisateurs ou les applications auxquels vous devez assigner la politique d’accès.

Donc, tout d’abord, sous le _Key Vault_ nouvellement créé, sélectionnez la lame _Access Policies_ et cliquez sur « _+ Create_ ».

Nous allons ajouter la politique d’accès au créateur du certificat (vous), donc si vous n’arrivez pas à valider la création, demandez à votre manager.

Dans le formulaire,

- Sélectionnez _Select all_ comme _Permissions_.
- Ensuite, sélectionnez le _Principal_ ou l’utilisateur en utilisant votre adresse email complète.
- Laissez le champ _Application_ vide.
- Terminez en cliquant sur _Create._

Ensuite, ajoutez une autre politique d’accès à la ressource _App Service_.

Avant cela, assurez-vous d’activer l’identité _System assigned_ sous le _App Service_ et la lame _Identity_. Cela va générer un _Principal (Object) ID_ que vous utiliserez pour rechercher le _Principal_ ou « utilisateur » auquel assigner la politique d’accès.

Pour cette politique d’accès, assignez uniquement les permissions « _Get_ » et « _List_ ».

### Juste au cas où

Alors que je faisais cela moi-même pour la première fois, j’ai pensé que je devais ajouter des permissions basées sur les rôles pour moi-même et le _App Service_ :

- _Key Vault Administrator_ assigné à moi-même.
- _Key Vault Cerfitificates User_ et _Key Vault Cerfitificates Officer_ à la ressource _App Service_.

Je ne pense pas que vous en ayez besoin. Mais juste au cas où les politiques d’accès…

### Générer les certificats

Naviguez maintenant vers la lame _Certificates_ dans votre _Key Vault_ et :

- Cliquez sur « + Generate/Import ».
- Laissez la méthode à « Generate.\_ ».
- Donnez un nom comme « _certificate-openiddict-encryption_ ».
- Laissez le type de certificat à _Self-signed certificate_ à moins que vous ne puissiez fournir une autorité.
- Définissez le _Subject_ comme étant le nom de domaine complet de votre App Service. Vous pourriez donc avoir par exemple `CN=votre-appservice-fcg3bqdgbme3dchd.westeurope-01.azurewebsites.net`\_. Veuillez adapter l’URI à l’URI de votre service d’application.
- Choisissez la _Validity Period_.
- Laissez le _Lifetime Action Type_ tel qu’il est, par exemple, _Automatically renew at a given percentage lifetime_.
- Confirmez en cliquant sur _Create_.

Répétez les étapes, mais nommez le second certificat « _certificate-openiddict-signing_ ».

## Intégrer la solution _OpenIddict_ pour activer OpenID sur le projet

De retour au _Program.cs_, nous ajoutons d’abord les paquets nécessaires :

```csharp
dotnet add package Azure.Identity --version 1.13.1
dotnet add package Azure.Security.KeyVault.Certificates --version 4.7.0
dotnet add package System.Security.Cryptography.X509Certificates --version 4.3.2
```

Ensuite, nous allons encapsuler la configuration de _OpenIddict_ dans une méthode `SetupOpenIddict` :

```csharp
logger.LogInformation("Program.cs > Register the OpenIddict core components.");
SetupOpenIddict(builder, logger);
```

Dans la méthode, nous aurons ce qui suit. J’ai utilisé des commentaires pour expliquer la logique. Veuillez les lire.

```csharp
using System.Security.Cryptography.X509Certificates;

static void SetupOpenIddict(WebApplicationBuilder builder, ILogger logger)
{
    builder.Services.AddOpenIddict()
        .AddCore(options =>
        {
            // Configurer OpenIddict pour utiliser les magasins et modèles Entity Framework Core.
            // Note : appeler ReplaceDefaultEntities() pour remplacer les entités par défaut d'OpenIddict.
            options.UseEntityFrameworkCore()
                   .UseDbContext<ApplicationDbContext>();
        })
        // Enregistrer les composants du serveur OpenIddict.
        .AddServer(options =>
        {
            // Et activer le point de terminaison du jeton.
            options.SetTokenEndpointUris("connect/token");

            // Ensuite, activez le flux `client credentials`.
            options.AllowClientCredentialsFlow();

            // Ensuite, définissez les certificats.
            if (builder.Environment.IsDevelopment())
            {
                // En local, utiliser les certificats fournis par OpenIddict.
                // Ils ne fonctionneront pas en production.
                options.AddDevelopmentEncryptionCertificate()
                       .AddDevelopmentSigningCertificate();
            }
            else
            {
		        // En production, utiliser les certificats lus depuis le Key Vault.
                logger.LogInformation("SetupOpenIddict > AddServer > Not Development...");
                string? keyVaultUri = RetrieveValueFromConfig(
                    builder,
                    "OpenIddict:KeyVaultUri",
                    logger);
                logger.LogInformation($"SetupOpenIddict > AddServer > OpenIddict:KeyVaultUri is <{keyVaultUri}>");
                // Initialiser le client de certificat pour lire dans le Key Vault.
                var certClient = new CertificateClient(
                    new Uri(keyVaultUri),
                    new DefaultAzureCredential());
                logger.LogInformation("SetupOpenIddict > AddServer > KeyValult client to read certificates = OK!");

                // Lire le certificat de chiffrement
                var openIddict_EncryptionCertificateName = RetrieveValueFromConfig(
                    builder,
                    "OpenIddict:EncryptionCertificateName",
                    logger);
                logger.LogInformation($"SetupOpenIddict > AddServer > OpenIddict:EncryptionCertificateName is <{openIddict_EncryptionCertificateName}>");
                try
                {
                    // Télécharger le certificat complet qui inclut la clé privée,
                    // nécessaire pour OpenIddict.
                    //GetCertificate n'est pas suffisant et ne contient pas la clé privée du certificat, nécessaire à `AddEncryptionCertificate`.
                    var encryptionCert = certClient.DownloadCertificate(openIddict_EncryptionCertificateName).Value;
                    logger.LogInformation($"SetupOpenIddict > AddServer > read encryption cert: <{encryptionCert}>");
                    options.AddEncryptionCertificate(new X509Certificate2(encryptionCert));
                    logger.LogInformation("SetupOpenIddict > AddServer > AddEncryptionCertificate = OK!");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex.Message, ex.StackTrace);
                    throw;
                }

                //  Lire le certificat de signature
                var openIddict_SigningCertificateName = RetrieveValueFromConfig(builder, "OpenIddict:SigningCertificateName", logger);
                logger.LogInformation($"SetupOpenIddict > AddServer > OpenIddict:SigningCertificateName is <{openIddict_SigningCertificateName}>");
                try
                {
                    var signingCert = certClient.DownloadCertificate(openIddict_SigningCertificateName).Value;
                    logger.LogInformation($"SetupOpenIddict > AddServer > read encryption cert: <{signingCert}>");
                    options.AddSigningCertificate(
                        new X509Certificate2(signingCert));
                    logger.LogInformation("SetupOpenIddict > AddServer > AddSigningCertificate = OK!");

                }
                catch (Exception)
                {
                    throw;
                }
            }
            // Enregistrer l'hôte ASP.NET Core et
            // configurer les options spécifiques à ASP.NET Core.
            options.UseAspNetCore()
                   .EnableTokenEndpointPassthrough();
        })

        // Enregistrer les composants de validation d'OpenIddict.
        .AddValidation(options =>
        {
            // Importer la configuration depuis l'instance locale d'OpenIddict
            // Fondamentalement, IIS Express ou la ressource App Service est le serveur OpenID qui tourne en parallèle de votre API Web.
            options.UseLocalServer();

            // Enregistrer l'hôte ASP.NET Core.
            options.UseAspNetCore();
        });
}
```

Vous avez peut-être remarqué que vous devez définir quelques clés de configuration dans `appsettings.json`. Les voici :

```json
{
  // ... le reste du fichier
  "OpenIddict": {
    "KeyVaultUri": "https://kcdemo.vault.azure.net/",
    "EncryptionCertificateName": "certificat-openiddict-encryption",
    "SigningCertificateName": "certificat-openiddict-signing"
  }
  // ... le reste du fichier
}
```

Les noms des certificats sont importants. Ils doivent correspondre au nom fourni lors de la création du certificat.

Ensuite, vous pouvez définir les valeurs des variables d’environnement. Pour ce faire, ajustez les clés de configuration et la façon dont vous les lisez dans le code (`OpenIddict:KeyVaultUri` vs `OpenIddict_KeyVaultUri`) :

```json
{
  // ... le reste du fichier
  "OpenIddict_KeyVaultUri": "https://kcdemo.vault.azure.net/",
  "OpenIddict_EncryptionCertificateName": "certificat-openiddict-encryption",
  "OpenIddict_SigningCertificateName": "certificat-openiddict-signing"
  // ... le reste du fichier
}
```

## Alimenter la base de données avec l’enregistrement d’une application de démonstration

Pour pouvoir tester plus tard, nous devons informer _OpenIddict_ qui peut s’authentifier et obtenir des jetons.

Pour ce faire, créons un fichier `Seeder.cs` à la racine du projet WebApi :

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using DemoWebApiWithOpenIddict.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace DemoWebApiWithOpenIddict.Core;

public class OpenIddictSeeder: IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public OpenIddictSeeder(IServiceProvider serviceProvider)
        => _serviceProvider = serviceProvider;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = _serviceProvider.CreateAsyncScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await context.Database.EnsureCreatedAsync();

        var manager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();

        var application = await manager.FindByClientIdAsync("console");
        if (application == null)
        {
            await CreateApplication(manager);
        }
        else
        {
            await manager.DeleteAsync(application);
            await CreateApplication(manager);
        }
    }

    private static async Task CreateApplication(IOpenIddictApplicationManager manager)
    {
        await manager.CreateAsync(new OpenIddictApplicationDescriptor
        {
            // Le ClientId et le ClientSecret seront utilisés dans le client plus loin dans l'article.
            ClientId = "console",
            ClientSecret = "388D45FA-B36B-4988-BA59-B187D329C207",
            DisplayName = "Demo OAuth2 App For RefList",
            Permissions =
                {
                    Permissions.Endpoints.Token,
                    Permissions.GrantTypes.ClientCredentials
                }
        });
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

```

Note : Le `ClientSecret` est un GUID aléatoire.

D’ailleurs, le `ClientSecret` doit être :

1. Suffisamment aléatoire et impossible à deviner.
2. Généré à l’aide d’une méthode cryptographique sûre.
3. D’une longueur d’au moins 256 bits, généralement représentée par une chaîne hexadécimale de 64 caractères.

Pour en savoir plus sur le sujet, [cliquez ici](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/).

Ensuite, instruisez l’application dans `Program.cs` de l’exécuter juste avant `builder.Build()` :

```csharp
logger.LogInformation("Program.cs > Seed the OpenIddict database.");
builder.Services.AddHostedService<OpenIddictSeeder>();

var app = builder.Build();
```

## Créer le fichier de migration

Cette étape permet de créer les tables de la base de données pour _OpenIddict_ dans la base de données créée précédemment. Vous devez d’abord installer le paquet suivant :

```json
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.11
```

Ensuite, exécutez les commandes suivantes :

```powershell
# Positionnez-vous dans votre projet, si vous êtes dans une grande solution.
cd DemoWebApiWithOpenIddict
# Créer ensuite la migration
dotnet ef migrations add InitOpenIddict --context DemoWebApiWithOpenIddict.Models.ApplicationDbContext --output-dir ./Migrations
# Et créer le fichier SQL à exécuter manuellement ou via DbUp, si vous l'utilisez.
# Le « 0 » signifie que nous demandons de générer la première migration.
# L'option « -i » indique à EF de générer un script que vous pouvez exécuter plusieurs fois (par exemple, réinitialisation).
dotnet ef migrations script 0 InitOpenIddict --context DemoWebApiWithOpenIddict.Models.ApplicationDbContext -o ./SQL/Patch/001-init-openiddict-tables.sql -i
```

Juste au cas où, éditez le `.csproj` pour avoir ce qui suit si les commandes de migration échouent :

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.11">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
</PackageReference>
```

## Exécuter la création des tables

Ouvrez SSMS et connectez-vous à votre instance SQL et sélectionnez la base de données `openiddict`.

Ouvrez le script `001-init-openiddict-tables.sql` du dossier `SQL/Patch` et exécutez-le.

Note : Vous aurez quelques avertissements. Cela ne pose pas de problème. Terminez le guide et lancez l’application.

## Mettre à jour les contrôleurs

### Ajouter un contrôleur `AuthorizationController`

Tout d’abord, vous devez activer l’authentification pour votre application : dans `Program.cs`, ajoutez `app.UseAuthentication();` juste avant `app.UseAuthorization();` .

Ensuite, dans le dossier _Controllers_, ajoutez ce `AuthorizationController` qui va générer le _token_ lorsqu’il est demandé :

```csharp
/*
 * Licensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 * See https://github.com/openiddict/openiddict-core for more information concerning
 * the license and the contributors participating to this project.
 */

using System.Security.Claims;
using DemoWebApiWithOpenIddict.Helpers;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace DemoWebApiWithOpenIddict.Controllers;

public class AuthorizationController : Controller
{
    private readonly IOpenIddictApplicationManager _applicationManager;
    private readonly IOpenIddictScopeManager _scopeManager;

    public AuthorizationController(IOpenIddictApplicationManager applicationManager, IOpenIddictScopeManager scopeManager)
    {
        _applicationManager = applicationManager;
        _scopeManager = scopeManager;
    }

    [HttpPost("~/connect/token"), IgnoreAntiforgeryToken, Produces("application/json")]
    public async Task<IActionResult> Exchange()
    {
        var request = HttpContext.GetOpenIddictServerRequest();
        if (request.IsClientCredentialsGrantType())
        {
            // Note : les informations d'identification du client sont automatiquement validées par OpenIddict :
            // si client_id ou client_secret sont invalides, cette action ne sera pas invoquée.
            var application = await _applicationManager.FindByClientIdAsync(request.ClientId);
            if (application == null)
            {
                throw new InvalidOperationException("The application details cannot be found in the database.");
            }

            // Créer l'identité basée sur les "claims" qui sera utilisée par OpenIddict pour générer des jetons.
            var identity = new ClaimsIdentity(
                authenticationType: TokenValidationParameters.DefaultAuthenticationType,
                nameType: Claims.Name,
                roleType: Claims.Role);

            // Ajouter les "claims" qui seront persistées dans les jetons (utiliser l'identifiant du client comme identifiant du sujet).

            identity.SetClaim(Claims.Subject, await _applicationManager.GetClientIdAsync(application));
            identity.SetClaim(Claims.Name, await _applicationManager.GetDisplayNameAsync(application));

            // Note : Dans la spécification originale d'OAuth 2.0, le client "credentials grant"
            // ne renvoie pas de jeton d'identité, ce qui est un concept OpenID Connect.
            //
            // En tant qu'extension non standardisée, OpenIddict permet de renvoyer un id_token
            // pour transmettre des informations sur l'application cliente lorsque la portée « openid » est accordée (c'est-à-dire spécifiée par l'application).

            // Définir la liste des champs d'application accordés à l'application cliente dans access_token.
            identity.SetScopes(request.GetScopes());
            identity.SetResources(await _scopeManager.ListResourcesAsync(identity.GetScopes()).ToListAsync());
            identity.SetDestinations(GetDestinations);

            return SignIn(new ClaimsPrincipal(identity), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        throw new NotImplementedException("The specified grant type is not implemented.");
    }

    private static IEnumerable<string> GetDestinations(Claim claim)
    {
        // Note : par défaut, les "clains" ne sont PAS automatiquement inclus dans les jetons d'accès et d'identité.
        // Pour permettre à OpenIddict de les sérialiser, vous devez leur attacher une destination, qui spécifie
        // si elles doivent être incluses dans les jetons d'accès, dans les jetons d'identité ou dans les deux.

        return claim.Type switch
        {
            Claims.Name or Claims.Subject => [Destinations.AccessToken, Destinations.IdentityToken],

            _ => [Destinations.AccessToken],
        };
    }
}

```

**Important** : le point de terminaison que vous avez spécifié dans le `Program.cs` (`options.SetTokenEndpointUris`) doit correspondre au point de terminaison de ce contrôleur.

### Modifier le contrôleur `WeatherForecast`

Pour autoriser les requêtes des clients authentifiés utilisant un jeton valide, ajoutons l’attribut `Authorize` :

```csharp
namespace DemoWebApiWithOpenIddict.Controllers
{
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
	    // Le code de votre contrôleur
    }
}
```

Vous pouvez placer l’attribut sur certaines méthodes si elles ne requièrent pas toutes une autorisation. De la même manière, vous pouvez avoir des contrôleurs qui ne requièrent aucune autorisation OAuth2.

Maintenant, lancez votre application localement : lorsque vous chargez le point de terminaison `/weatherforecast`, vous devriez obtenir une erreur `HTTP 401`. Nous nous y attendions !

## Tester l’implémentation

### Tester localement

Pour tester votre API Web localement, utilisez le code de l’application console ci-dessous et sélectionnez la première URL (adaptez-les à votre environnement 😉 ).

L’application console utilise un package :

```csharp
dotnet add package OpenIddict.Client.SystemNetHttp --version 5.8.0
```

Le code ci-dessous effectue deux tests :

- La première requête devrait aboutir.
- La seconde devrait échouer, puisque nous ne fournissons pas l’en-tête `Authorization` avec le jeton.

```csharp
using System.Net.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Client;

static string? PickUrl()
{
    Console.WriteLine("Please select a URL:");
    Console.WriteLine("1. https://localhost:7129 (Make sure you are running it locally)");
    Console.WriteLine("2. https://your-app-service-efgmfncjguejeaes.westeurope-01.azurewebsites.net");

    while (true)
    {
        Console.Write("\nEnter 1 or 2: ");
        string choice = Console.ReadLine();

        return choice switch
        {
            "1" => "https://localhost:7129",
            "2" => "https://your-app-service-efgmfncjguejeaes.westeurope-01.azurewebsites.net",
            _ => null
        };
    }
}

var host = PickUrl();
var noPick = host == null;
var pickAttempts = 0;
var maxPickAttempts = 5;

while (noPick)
{
    host = PickUrl();
    noPick = host == null;
    pickAttempts++;
    if (pickAttempts >= maxPickAttempts)
    {
        Console.Write("\nFollow instructions... Restart the app :)");
        Console.ReadLine();
    }
}

if (host == null) return;

Console.WriteLine($"\nWebApi picked: {host}");

ServiceCollection services = ConfigureValidServices(host);
await using var provider = services.BuildServiceProvider();
var token = await GetTokenAsync(provider);

Console.WriteLine("Access token: {0}", token);
Console.WriteLine();

var response = await GetResourceAsync(provider, token, host!, "/weatherforecast");
Console.WriteLine("API response: {0}", response);
Console.WriteLine();
Console.WriteLine("Press key to test oauth-protected endpoint");
Console.ReadLine();

response = await GetResourceAsync(provider, token, host, "/weatherforecast", false);
Console.WriteLine("API response: {0}", response);
Console.WriteLine();
Console.WriteLine("Press key to test oauth-protected endpoint without token bearer");
Console.ReadLine();

static async Task<string> GetTokenAsync(IServiceProvider provider)
{
    var service = provider.GetRequiredService<OpenIddictClientService>();

    var result = await service.AuthenticateWithClientCredentialsAsync(new());
    return result.AccessToken;
}

static async Task<string> GetResourceAsync(IServiceProvider provider, string token, string host, string resource, bool includeAuthBearer = true)
{
    using var client = provider.GetRequiredService<HttpClient>();
    using var request = new HttpRequestMessage(HttpMethod.Get, $"{host}{resource}");
    if (includeAuthBearer)
    {
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    Console.WriteLine($"Result of calling {host}{resource}");
    using var response = await client.SendAsync(request);
    try
    {
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
    finally { client.Dispose(); }

    return "Error thrown";
}

static ServiceCollection ConfigureValidServices(string? host, string scope = "demo_api_scope")
{
    var services = new ServiceCollection();

    services.AddOpenIddict()
        .AddClient(options =>
        {
            options.AllowClientCredentialsFlow();
            options.DisableTokenStorage();
            options.UseSystemNetHttp()
                   .SetProductInformation(typeof(Program).Assembly);

            options.AddRegistration(new OpenIddictClientRegistration
            {
                Issuer = new Uri($"{host}/", UriKind.Absolute),
                // Doit correspondre aux valeurs de OpenIddictSeeder
                ClientId = "console",
                ClientSecret = "388D45FA-B36B-4988-BA59-B187D329C207"
            });
        });
    return services;
}
```

### Test sur la ressource _App Service_

Enfin, appuyez sur le bouton _Publish_ dans Visual Studio.

Assurez-vous que l’application se charge correctement et qu’aucune erreur ne s’est produite en utilisant le fichier de traces applicatives.

Lancez ensuite l’application console et choisissez l’URL distante.

Vous devriez obtenir les mêmes résultats !

## Conclusion

Voilà, c’est fait ! C’était long, mais j’ai passé deux jours à le comprendre complètement (au passage, l’IA ne fait pas tout, mais elle m’a aidé).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
