---
title: "Utilisation des Scoped ou Singleton dans la mise en cache"
description: "La mise en cache est une exigence courante dans les applications web. Examinons les raisons pour lesquelles nous utiliserions une durée de vie Scoped ou Singleton en fonction des cas d’utilisation."
image: 2025-01-10-diagram-of-the-lifetimes.jpg
imageAlt: Diagramme des durées de vie
date: 2025-01-31
categories:
  - Développement Web
tags:
  - DotNet
---

Que choisir ? Tout dépend de la portée et de la durée de validité du cache.

Laissez-moi vous expliquer un peu quand utiliser la durée de vie `Scoped` et quand utiliser la durée de vie `Singleton` dans ce nouvel article.

## Mise en cache par demande (durée de vie par requête)

Quels sont les cas d’utilisation de la durée de vie `Scoped` ?

- **Données spécifiques à une requête** : lorsqu’on met en cache de données spécifiques à une seule demande et qui ne doivent pas persister au-delà de cette demande.
- **Éviter le traitement de calculs lourds dans une même requête** : si certains calculs ou récupérations de données se révèlent coûteux et que le résultat s'utilise plusieurs fois dans la même requête, la mise en cache dans le cadre de la requête peut permettre d’économiser des ressources.

Quels exemples concrets pouvons-nous donner ?

1. **Requêtes sur une base de données** : si une requête de base de données particulière est exécutée plusieurs fois au cours d’une même demande et que le résultat ne change pas, la mise en cache du résultat peut améliorer les performances.
2. **Autorisations pour un utilisateur** : la mise en cache des autorisations d’un utilisateur pendant la durée d’une requête peut éviter des vérifications répétées auprès du service d’autorisation.

Nous pouvons le mettre en œuvre de la manière suivante :

```csharp
public interface IRequestCache
{
    object Get(string key);
    void Set(string key, object value);
}

public class RequestCache : IRequestCache
{
    private readonly IDictionary<string, object> _cache = new Dictionary<string, object>();

    public object Get(string key)
    {
        _cache.TryGetValue(key, out var value);
        return value;
    }

    public void Set(string key, object value)
    {
        _cache[key] = value;
    }
}

// Registering the service in Program.cs
services.AddScoped<IRequestCache, RequestCache>();
```

## Mise en cache pendant la durée de vie de l’application

Quels sont les cas d’utilisation d’un `Singleton` ?

- **Données globales ou partagées** : mise en cache de données partagées entre plusieurs requêtes et qui ne changent pas fréquemment.
- **Opérations coûteuses** : Les données dont l’extraction ou le calcul coûtent cher et que l’on doit réutiliser dans le cadre de différentes requêtes.

Quels exemples concrets pouvons-nous citer ?

1. **Données de configuration**, par exemple, les paramètres de configuration de l’ensemble de l’application qu’on charge une fois et qu’on utilise pendant toute la durée de vie de l’application.
2. **Données statiques**, comme des données de référence qui ne changent pas souvent, telles que les listes de pays ou les catégories de produits.

On peut être mis en œuvre de la manière suivante :

```csharp
public interface IGlobalCache
{
    object Get(string key);
    void Set(string key, object value);
}

public class GlobalCache : IGlobalCache
{
    private readonly IDictionary<string, object> _cache = new Dictionary<string, object>();

    public object Get(string key)
    {
        _cache.TryGetValue(key, out var value);
        return value;
    }

    public void Set(string key, object value)
    {
        _cache[key] = value;
    }
}

// Registering the service
services.AddSingleton<IGlobalCache, GlobalCache>();

```

## Conclusion

Bien que les durées de vie `Scoped` et `Singleton` s'utilisent pour de la mise en cache, le choix de l'un ou l'autre dépend de la nature des données et des exigences de votre application.

**On utilise moins régulièrement la mise en cache sur une `Scoped`** , mais elle s'avère utile pour les données spécifiques à une requête qui peuvent servir à nouveau dans le cadre d’une seule requête.

**La mise en cache `Singleton`** se révèle très courante, en particulier pour les données partagées et celles relativement statiques dans l’ensemble de l’application.

## Sources pour approfondir

Vous pouvez consulter les ressources suivantes pour aller plus loin sur le sujet :

1. **Documentation Microsoft**:
   - [*Service lifetimes in dependency injection*](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection#service-lifetimes)
   - Cet article explique les trois durées de vie (`Transient`, `Scoped`, `Singleton`) et fournit des conseils sur le moment d’utiliser chacune d’entre elles.
2. **Microsoft Learn Module**:
   - [Injection de dépendance en .NET](https://learn.microsoft.com/fr-fr/dotnet/core/extensions/dependency-injection)
   - Ce module offre un examen approfondi de l’injection de dépendances dans .NET, y compris des exemples et des recommandations pour l’utilisation de différentes durées de vie de services.
3. **Stack Overflow**:
    - [Quand utiliser `AddTransient` vs `AddScoped` vs `AddSingleton` dans ASP.NET Core ?](https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences)
   - Ce fil de discussion aborde les scénarios pratiques et les conséquences de l’utilisation de différentes durées de vie, à l’aide d’exemples et de points de vue fournis par la communauté.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
