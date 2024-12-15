---
title: "Déployer une application .NET Core 8 sur Azure"
description: "Et comment configurer la journalisation pour faciliter le débogage sur Azure ?"
image: 2024-12-16-a-pile-of-logs.jpg
imageAlt: Une pile de rondins
date: 2024-12-18
categories:
  - Développement Web
tags:
  - Microsoft Azure
---

Je travaille avec Microsoft Azure depuis un certain temps maintenant, et j'ai constaté que la configuration des journaux n'était pas triviale.

J'ai eu une expérience avec WordPress. Dans cet article, je vais démontrer c'est en réalité simple avec une api web .NET Core 8.

## Conditions préalables

Vous aurez besoin de :

- Un compte sur Microsoft Azure. Personnellement, je n'ai qu'un compte professionnel auprès de mon employeur actuel au moment où j'écris ces lignes. J'ai donc eu quelques problèmes pour faire fonctionner les ressources ensemble ou pour obtenir des permissions pour effectuer certaines actions. Je les détaillerai au fur et à mesure.
- Visual Studio 2022, du moins, c'est ce que j'ai utilisé pour réaliser ce guide. Vous devrez connecter votre compte Microsoft pour pouvoir déployer via la fonction _Publish_ de Visual Studio. Cet article ne montre pas comment configurer une CI via Azure DevOps et déployer une image Docker. Veuillez lire mon autre guide sur le sujet [où j'ai déployé un web API Python sur Microsoft Azure](../../2024-08/deployer-une-api-rest-python-sur-microsoft-azure/index.md).
- Un _App Service Plan_ : si vous n'en avez pas, il n'y a pas de difficulté à le créer. Vous le créerez en même temps que l'App Service plus tard dans l'article.

## Création de la `WebApi`

Tout d'abord, créons l'application en local.

Dans Visual Studio, créez un nouveau projet de type « _ASP.NET Core Web Api_ » et fournissez les détails suivants :

- Nommez-la.
- Sélectionnez le cible _.NET_. Bien que _.NET 9.0_ vienne de sortir au moment où j'écris ces lignes, je préfère la version _LTS_ actuelle, à savoir _.NET 8.0_.
- Ne sélectionnez aucun type d'authentification. Nous traiterons cette question avec OpenIddict dans un article ultérieur. [Abonnez-vous pour en savoir plus](https://iamjeremie.substack.com/) lorsque je publierai l'article.
- Cochez l'option _Configurer pour HTTPS_.
- Décochez l'option _Enable container support_.
- Décidez si vous voulez utiliser Swagger pour documenter votre webapi avec l'option _Enable OpenAPI Support_. Dans cet article, c'est hors sujet.
- Cochez l'option _Use controllers_.
- Laissez le reste tel quel.

Par défaut, il créera une application avec un contrôleur _WeatherForecast_.

Vérifiez que cela fonctionne par le _menu clic droit_ et _Debug > Start new instance_.

## Créer la resource _App Service_

Avant de déployer, nous devons créer l'endroit où l'application sera exécutée.

Rendez-vous sur le portail Azure (`https://portal.azure.com/`) et en utilisant la barre de recherche principale en haut, saisissez et sélectionnez « _App Services »_.

Sur la page chargée, vous verrez tous les _App Services_ existants sur votre abonnement ou groupe de ressources.

Sélectionnez _Create_ puis _Web App_.

Sous l'onglet _Basics_, vous devez entrer :

- Le groupe de ressources.
- Le nom de la ressource.
- Le type de _Publish_ à _Code_.
- La _Runtime stack_ à _.NET 8 (LTS)_.
- Le _Operating system_ à _Linux_.
- La _Region_ (Note : j'ai choisi la même que les autres ressources, parce que j'avais un _App Service Plan_ existant pour éviter la création (et les coûts) d'un nouveau)
- Le _Linux plan_. Si vous avez un plan existant, Azure le listera pour vous. Sinon, cliquez sur _Create new_.

Sous l'onglet _Deployment_, cochez la case _Basic authentication_ à _Enable_ pour les _Authentication settings_.

Laissez les onglets _Database_ et _Networking_ avec les valeurs par défaut. La base de données sera créée séparément lorsque nous préparerons l'intégration d'OpenIddict. [Abonnez-vous pour en savoir plus](https://iamjeremie.substack.com/) lorsque je publierai l'article.

Sous l'onglet _Application Insights_, laissez-le tel quel car, même si cela peut être intéressant, ce n'est pas comme cela que vous indiquerez à Azure où iront les logs de l'application.

Sous l'onglet _Tags_, définissez les tags pour organiser vos ressources. Vous devriez avoir une stratégie pour trier et organiser vos ressources. Mais c'est un sujet pour un autre article.

Terminez par _Review + create_ et confirmez la création de la ressource.

## Deploy the Application to Microsoft Azure

Now, let’s deploy the application to the newly created _App Service_.

Right-click on the project and select _Publish._

You’ll need to create a publish profile, so click _Add a publish profile_.

On the modal,

- Select _Azure_ as the _Target._
- Select _Azure App Service (Linux)_ as the _Specific target_
- Select the _App Service_ you just created. You need to be connected in Visual Studio to the same account you used to create the resource in Azure. Otherwise, you won’t see it.
- Select _Publish (generatates pubxml file)_ as the _Deployment type_.

Close the modal and hit _Publish_.

After a couple of minutes, the application should be deployed to Azure. Use the _Overview_ blade of the _App Service_ on Azure to browse the Web API: it should be something like `demowebapinetcore8-fcg3bqdgbme3dchd.westeurope-01.azurewebsites.net`. Add `/weatherforecast` to validate the API is working.

## Enable the Application Logs to the FileSystem

On the Azure portal, browse your _App Service_ resource and search for the _App Service Logs_ blade.

Enable the _Application logging_ to _File System_ and set the _Retention Period_ to _7 days_.

Save the changes.

To check it is working, search for the _Advanced Tools_ blade and click _Go_.

In the new browser tab that opened, select the _Bash_ tab to load a SSH client, also known as the _Kudu_.

Type the following command:

```bash
ls -l LogFiles
```

You should see a file named `yyyy_mm_dd_[some_hash_value]_default_docker.log`. This is where the logs you add in your application will go.

### About the LogStream

You may have come across YouTube video or articles that tells you that you can view the logs live in the _LogStream._ Maybe, it was possible or is still possible in certain conditions. I find that it is not reliable. I’ve tried many things and it often remains stuck with the message “Connected!”…

### Modify `Program.cs` to Add Your First Log

First, before your instanciate the builder, add the following lines:

```csharp
using var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder
    .SetMinimumLevel(LogLevel.Trace)
    .AddConsole());

ILogger logger = loggerFactory.CreateLogger<Program>();
logger.LogInformation("Program.cs logger ready :)");

logger.LogInformation("Program.cs > init builder...");
var builder = WebApplication.CreateBuilder(args);
```

This way, you can debug errors while your application starts.

Let me tell you how important it is when it will come to debug the _OpenIddict_ integration (well, for you, it might not if you follow exactly the same steps as I describe here).

To test this, hit _Publish_ again and wait that the _App Service_ restarts. In the log file, you should see the two lines of log near the end of the file:

```bash
cat LogFiles/yyy_mm_dd_[some_hash_value]_default_docker.log
# 2024-12-10T10:37:19.5210376Z info: Program[0]
# 2024-12-10T10:37:19.5211218Z       Program.cs logger ready :)
# 2024-12-10T10:37:19.5366643Z info: Program[0]
# 2024-12-10T10:37:19.5366935Z       Program.cs > init builder...
```

### Modify `WeatherForecastController.cs` to Add a Log

In the controller file, use dependency injection to use the logger:

```csharp
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            _logger.LogInformation("Getting the forecast...");
            // Business logic...
        }
```

To test this, hit _Publish_ again and wait that the _App Service_ restarts. Request the `/weatherforecast` endpoint and check the logs as described above.

## Conclusion

That’s it. I've longed so much to understand where those log files where. Somehow, the articles and vlogs outthere show outdated information and this article is what you may be looking for.

Again, [subscribe to know more](https://iamjeremie.substack.com/) when I release the article about integrating _OpenIddict_ to the application.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}

Credit: Photo by [Craig Adderley](https://www.pexels.com/photo/rustic-woodpile-in-a-lush-forest-clearing-29162610/) on Pexels.
