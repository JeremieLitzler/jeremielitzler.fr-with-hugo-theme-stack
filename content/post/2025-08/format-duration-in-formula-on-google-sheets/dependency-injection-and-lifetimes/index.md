---
title: "Dependency Injection And Lifetimes"
description: "In software development, particularly in the context of dependency injection (DI), the lifetimes of services determine how long an instance of a class is kept alive. Let’s define them."
image: 2025-05-19-dependency-injection-and-lifetimes.jpg
imageAlt: “Dependency Injection and Lifetimes” over a gradient background
date: 2025-05-19
categories:
  - Software Development
tags:
  - CSharp
---

There are 3 lifetimes possible when using dependency injection: `Transient`, `Scoped` and `Singleton`.

Let’s detail each of these with a definition, its respective use cases and a case example.

## Transient

If you need a new instance every time you request the service, this lifetime suits your need.

It’s what we call stateless services where each operation is independent of any previous operations.

### Code Example of a Transient

Let’s take a very trivial example with C# programming:

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

// Registering the service, usually in the Program.cs
services.AddTransient<ITransientService, TransientService>();
```

### Common Use Cases for a Transient

Generally, the common use cases are the following:

- **Utility Services**, which don’t need to maintain any state between calls but required an instantiation.
- **Formatting Services**, such as converting data into a specific string format.
- **Calculation Services**, when you need to perform computations or data transformations without needing to maintain any state.
- **Operation Services**, which perform a specific operation independently each time they’re called, like sending an email or logging an event.

### Read more about Transient

If you need to dive deeper into the topic, you can find below some online sources:

- **Microsoft Documentation**:
  - [Service lifetimes in dependency injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection#service-lifetimes)
  - This article explains the three lifetimes (Transient, Scoped, Singleton) and provides guidance on when to use each one.
- **Microsoft Learn Module About Dependency Injection in .NET**:
  - [Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
  - This module provides an in-depth look at dependency injection in .NET, including examples and best practices for using different service lifetimes.
- **Stack Overflow**:
  - [When to use AddTransient vs AddScoped vs AddSingleton in ASP.NET Core?](https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences)
  - This thread discusses the practical scenarios and implications of using different lifetimes, with community-provided examples and insights.
- **Blog Post on Dependency Injection**:
  - [Understanding Dependency Injection in .NET Core](https://auth0.com/blog/dependency-injection-in-dotnet-core/)
  - This blog post covers the basics of dependency injection in .NET Core and explains the different lifetimes with practical examples.

## Scoped

When you need to maintain a state during a single request but not across multiple requests, using a scoped dependency becomes the proper lifetime to use.

In a web application, we create a new instance for each HTTP request, and we can use throughout that request lifetime.

### Common Use Cases for a Scoped

Here are some common use cases that you can find out there:

- **Entity Framework DbContext**, which ensures a single instance of the DbContext used throughout a request to manage database operations, thus avoiding concurrency issues and ensuring that all changes are tracked and persisted correctly.
- **Unit of Work Pattern**, when managing a single unit of work that encompasses multiple repository operations within a single request.
- **Caching per Request**, to cache data that is expensive to fetch or compute and should be reused within the same request but not beyond it.
- **Request-Specific Data**: Storing request-specific data, such as user authentication information, that requires access by multiple components during the request processing.

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

## Summary

Use **Transient** for stateless services that **can be recreated as needed** and **don’t hold a state**.

Use **scoped** for services that should be **unique to a single request or scope,** holding state that shouldn’t persist beyond that scope.

Use **Singleton** for services that need to **maintain a state across the entire application lifecycle** and all requests and users can access it through the various services.

I hope this short summary helped you understand the usage of each lifetime next time you work a new service for your applications.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
