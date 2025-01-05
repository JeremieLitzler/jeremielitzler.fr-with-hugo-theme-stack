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

Je travaille avec Microsoft Azure depuis un certain temps maintenant, et j’ai constaté que la configuration des journaux n’était pas triviale.

J’ai eu une expérience avec WordPress. Dans cet article, je vais démontrer c’est en réalité simple avec une API web .NET Core 8.

## Les prérequis

Vous aurez besoin de :

- Un compte sur Microsoft Azure. Personnellement, je n’ai qu’un compte professionnel auprès de mon employeur actuel au moment où j’écris ces lignes. J’ai donc eu quelques problèmes pour faire fonctionner les ressources ensemble ou pour obtenir des permissions pour effectuer certaines actions. Je les détaillerai au fur et à mesure.
- Visual Studio 2022, du moins, que j’ai utilisé pour réaliser ce guide. Vous devrez connecter votre compte Microsoft pour pouvoir déployer avec la fonction _Publish_ de Visual Studio. Cet article ne montre pas comment configurer une CI via Azure DevOps et déployer une image Docker. Veuillez lire mon autre guide sur le sujet [où j’ai déployé un API web Python sur Microsoft Azure](../../2024-08/deployer-une-api-rest-python-sur-microsoft-azure/index.md).
- Un _App Service Plan_ : si vous n’en avez pas, il n’y a pas de difficulté à le créer. Vous le créerez en même temps que l’App Service plus tard dans l’article.

## Création de la `WebApi`

Tout d’abord, créons l’application en local.

Dans Visual Studio, créez un nouveau projet de type « _ASP.NET Core Web API_ » et fournissez les détails suivants :

- Nommez-la.
- Sélectionnez la cible _.NET_. Bien que _.NET 9.0_ vienne de sortir au moment où j’écris ces lignes, je préfère la version _LTS_ actuelle, à savoir _.NET 8.0_.
- Ne sélectionnez aucun type d’authentification. Nous traiterons cette question avec OpenIddict dans un article ultérieur. [Abonnez-vous pour en savoir plus](https://iamjeremie.substack.com/) lorsque je publierai l’article.
- Cochez l’option _Configurer pour HTTPS_.
- Décochez l’option _Enable container support_.
- Décidez si vous voulez utiliser Swagger pour documenter votre API web avec l’option _Enable OpenAPI Support_. Dans cet article, c’est hors sujet.
- Cochez l’option _Use controllers_.
- Laissez le reste tel quel.

Par défaut, il créera une application avec un contrôleur _WeatherForecast_.

Vérifiez que cela fonctionne par le _menu clic droit_ et _Debug > Start new instance_.

## Créer la ressource _App Service_

Avant de déployer, nous devons créer l’endroit où l’application sera exécutée.

Rendez-vous sur le portail Azure (`https://portal.azure.com/`) et en utilisant la barre de recherche principale en haut, saisissez et sélectionnez « _App Services »_.

Sur la page chargée, vous verrez tous les _App Services_ existants sur votre abonnement ou groupe de ressources.

Sélectionnez _Create_ puis _Web App_.

Sous l’onglet _Basics_, vous devez entrer :

- Le groupe de ressources.
- Le nom de la ressource.
- Le type de _Publish_ à _Code_.
- La _Runtime stack_ à _.NET 8 (LTS)_.
- Le _Operating system_ à _Linux_.
- La _Region_ (Note : j’ai choisi la même que les autres ressources, parce que j’avais un _App Service Plan_ existant pour éviter la création (et les coûts) d’un nouveau)
- Le _Linux plan_. Si vous avez un plan existant, Azure le listera pour vous. Sinon, cliquez sur _Create new_.

Sous l’onglet _Deployment_, cochez la case _Basic authentication_ à _Enable_ pour les _Authentication settings_.

Laissez les onglets _Database_ et _Networking_ avec les valeurs par défaut. La base de données sera créée séparément lorsque nous préparerons l’intégration d’OpenIddict. [Abonnez-vous pour en savoir plus](https://iamjeremie.substack.com/) lorsque je publierai l’article.

Sous l’onglet _Application Insights_, laissez-le tel quel, car, même si cela peut être intéressant, ce n’est pas ainsi que vous indiquerez à Azure où iront les traces applicatives.

Sous l’onglet _Tags_, définissez les tags pour organiser vos ressources. Vous devriez avoir une stratégie pour trier et organiser vos ressources. Mais c’est un sujet pour un autre article.

Terminez par _Review + create_ et confirmez la création de la ressource.

## Déployer l’application sur Microsoft Azure

Maintenant, déployons l’application vers la ressource _App Service_ nouvellement créée.

Faites un clic droit sur le projet et sélectionnez _Publish._.

Vous devrez créer un profil de publication, donc cliquez sur _Add a publish profile_.

Dans la fenêtre qui vient de s’ouvrir,

- Sélectionnez _Azure_ comme _Target_.
- Sélectionnez _Azure App Service (Linux)_ comme _Specific target_.
- Sélectionnez la ressource _App Service_ que vous venez de créer. Vous devez être connecté dans Visual Studio au même compte Microsoft que celui que vous avez utilisé pour créer la ressource dans Azure. Sinon, vous ne le verrez pas.
- Sélectionnez _Publish (generatates pubxml file)_ comme _Deployment type_.

Fermez la fenêtre modale et cliquez sur _Publish_.

Après quelques minutes, l’application devrait être déployée sur Azure. Utilisez la lame _Overview_ de la ressource _App Service_ sur Azure pour naviguer sur l’API web : elle devrait ressembler à `demowebapinetcore8-fcg3bqdgbme3dchd.westeurope-01.azurewebsites.net`. Ajoutez `/weatherforecast` pour valider le fonctionnement de l’API.

## Activer les traces applicatives dans le système de fichiers

Sur le portail Azure, rendez-vous sur votre ressource _App Service_ et recherchez la lame _App Service Logs_.

Activez l’option _Application logging_ en sélectionnant _File System_ et définissez la _Retention Period_ sur _7 days_.

Enregistrez les modifications.

Pour vérifier le fonctionnement, recherchez la lame _Outils avancés_ et cliquez sur _Go_.

Dans le nouvel onglet du navigateur qui s’est ouvert, sélectionnez l’onglet _Bash_ pour charger un client SSH, également connu sous le nom de _Kudu_.

Saisissez la commande suivante :

```bash
ls -l LogFiles
```

Cela devrait lister un fichier nommé `yyyy_mm_dd_[some_hash_value]_default_docker.log`. C’est là qu’iront les traces de votre application.

### À propos de la lame _LogStream_

Vous avez peut-être vu des vidéos ou des articles sur YouTube qui vous disent que vous pouvez voir les journaux en direct dans le _LogStream._ Peut-être que c’était possible ou que c’est encore possible dans certaines conditions. Je trouve personnellement que ce n’est pas fiable. J’ai essayé beaucoup de choses et ça reste souvent bloqué avec le message « _Connected!_ »…

### Modifier `Program.cs` pour ajouter votre première trace applicative

Tout d’abord, avant d’instancier le constructeur, ajoutez les lignes suivantes :

```csharp
using var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder
    .SetMinimumLevel(LogLevel.Trace)
    .AddConsole()) ;

ILogger logger = loggerFactory.CreateLogger<Program>() ;
logger.LogInformation(" Logger Program.cs ready :) ") ;

logger.LogInformation(" Program.cs > init builder... ") ;
var builder = WebApplication.CreateBuilder(args) ;
```

De cette manière, vous pouvez déboguer les erreurs pendant le démarrage de votre application.

Laissez-moi vous dire à quel point c’est important lorsqu’il s’agit de déboguer l’intégration de _OpenIddict_. Pour vous, ce ne sera peut-être pas le cas si vous suivez exactement les mêmes étapes que celles que je décris ici.

Pour tester cela, appuyez sur _Publish_ à nouveau et attendez que l’_App Service_ redémarre. Dans le fichier de traces applicatives, vous devriez voir les deux lignes suivantes vers la fin du fichier :

```bash
cat LogFiles/yyy_mm_dd_[some_hash_value]_default_docker.log
# 2024-12-10T10:37:19.5210376Z info: Program[0]
# 2024-12-10T10:37:19.5211218Z       Program.cs logger ready :)
# 2024-12-10T10:37:19.5366643Z info: Program[0]
# 2024-12-10T10:37:19.5366935Z       Program.cs > init builder...
```

### Modifier `WeatherForecastController.cs` pour ajouter une trace applicative

Dans le fichier du contrôleur, utilisez l’injection de dépendance pour utiliser le logger :

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

Pour tester cela, appuyez à nouveau sur _Publish_ et attendez que le _App Service_ redémarre. Naviguez sur `/weatherforecast` et vérifiez la présence des traces ajoutées dans le contrôleur.

## Conclusion

Voilà, c’est fait. J’ai tellement cherché à comprendre où se trouvaient ces fichiers de traces applicatives. D’une manière ou d’une autre, les articles et les vlogs montrent des informations obsolètes, et c’est exactement ce que vous recherchiez.

Chaque application logicielle, que ce soit WordPress, Flask ou ASP.NET, possède une méthode spécifique pour intégrer des traces d’application. Si vous trouvez comment les mettre en œuvre, elles seront ajoutées dans le fichier cité dans cet article.

Pour la suite, [abonnez-vous pour la suite](https://iamjeremie.substack.com/). J’ai prévu un article sur l’intégration de _OpenIddict_ à l’application construite ensemble aujourd’hui.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit: Photo de [Craig Adderley](https://www.pexels.com/photo/rustic-woodpile-in-a-lush-forest-clearing-29162610/) sur Pexels.
