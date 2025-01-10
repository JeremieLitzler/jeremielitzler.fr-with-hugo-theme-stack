---
title: "Utilisation des Scoped ou Singleton à des fins de mise en cache"
description: "La mise en cache est une exigence courante dans les applications web. Examinons les raisons pour lesquelles nous utiliserions une durée de vie Scoped ou Singleton en fonction des cas d'utilisation."
image: 2025-01-10-diagram-of-the-lifetimes.jpg
imageAlt: Diagramme des durées de vie
date: 2025-02-19
categories:
  - Web Development
---

Which to choose? It all depends on the scope and duration of the cache’s validity.

Let’s me explain a little bit when to use Scoped lifetime and when to use the Singleton lifetime in this new article.

## Caching per Request (Scoped Lifetime)

What are the use cases for the scoped lifetime?

- **Request-Specific Data**: Caching data that is specific to a single request and should not persist beyond that request.
- **Avoiding Repeated Computations**: If certain computations or data retrievals are expensive and the result is needed multiple times within the same request, caching within the request’s scope can save resources.

What are real-life examples?

1. **Database Queries**: If a particular database query is performed multiple times during a single request and the result is the same, caching the result within the request can improve performance.
2. **User Permissions**: Caching the permissions of a user for the duration of a request can avoid repeated checks against an authorization service.

It could be implemented as follows:

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

## Caching per Application Lifetime

What are the use cases for the singleton lifetime?

- **Global or Shared Data**: Caching data that is shared across multiple requests and does not change frequently.
- **Expensive Operations**: Data that is expensive to fetch or compute, and should be reused across different requests to avoid repeated overhead.

What are real-life examples?

1. **Configuration Data**: Application-wide configuration settings that are loaded once and used throughout the application’s lifetime.
2. **Static Data**: Reference data that does not change often, such as country lists or product categories.

It could be implemented as follows:

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

While both scoped and singleton lifetimes have their use cases for caching, the choice depends on the nature of the data and the requirements of your application.

**Scoped caching** is less common than singleton caching but is useful for request-specific data that needs to be reused within a single request.

**Singleton caching** is more common for data that is shared and relatively static across the entire application.

## Sources

You can read more from the following resources:

1. **Microsoft Documentation**:
   - [Service lifetimes in dependency injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection#service-lifetimes)
   - This article explains the three lifetimes (Transient, Scoped, Singleton) and provides guidance on when to use each one.
2. **Microsoft Learn Module**:
   - [Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
   - This module provides an in-depth look at dependency injection in .NET, including examples and best practices for using different service lifetimes.
3. **Stack Overflow**:
   - [When to use AddTransient vs AddScoped vs AddSingleton in ASP.NET Core?](https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences)
   - This thread discusses the practical scenarios and implications of using different lifetimes, with community-provided examples and insights.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
