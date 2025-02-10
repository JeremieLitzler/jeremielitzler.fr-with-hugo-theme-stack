---
title: "À propos du mot-clé « static » en C#"
description: "Qu’est-ce que le mot-clé « static », quand et comment l’utiliser ? Découvrons cela dans ce nouvel article."
image: 2025-02-10-a-method-sayhello-using-the-static-keyword.jpg
imageAlt: Une méthode « Bonjour » utilisant le mot-clé « static ».
date: 2025-02-14
categories:
  - Développement Web
tags:
  - Csharp
draft: true
---

Here are the main use cases and examples of using the `static` keyword in C#:

## Usages

### Static Fields

They represent variables that belong to the type itself and are shared among all instances of the type.

For example:

```csharp
public class Example
{
    public static int PI = 3.14;
}

//Outputs 3.14
Console.WriteLine(Example.PI);
```

### Static Methods

Such methods belong to the type itself and you can call them without creating an instance of the type.

```csharp
public class Example
{
    public static void SayHello()
    {
        Console.WriteLine("Howdy!");
    }
}

//Outputs "Howdy!"
Example.SayHello()
```

### Static Properties

These kind of properties belong to the type itself.

```csharp
public class Person
{
    public static int Count { get; private set; }

    public Person()
    {
        Count++;
    }
}
```

The above example demonstrates a common use case where a static property tracks the number of class instances created. The property is accessible through the class name (Person.Count) rather than through an instance.

### Static Constructors

These constructors initialize the static members of the type. They’re called automatically before any static members are accessed and are executed only once.

```csharp
public class Example
{
    public static int StaticField;

    static Example()
    {
        StaticField = 42;
    }
}

```

### Static Classes

Such classes can only contain static members. You can’t create an instance of a static class, and it’s typically used to group-related utility or helper methods.

```csharp
public static class Utility
{
    public static void HelperMethod()
    {
       Console.WriteLine("This is a helper method.");
    }
}
```

### Pros and Cons

Using `static` in C# offer several key benefits for application development:

- Memory Efficiency: only one copy exists for the entire application, regardless of how many class instances are created and they require less memory usage since no object instantiation is needed.
- State Management: in terms of global access, they provide shared values accessible across the entire application without instance creation. For example maintaining application-wide constants or configuration values. At the class-level, it’s beneficial for implementing singleton patterns or managing a class-wide state.

However, you need to consider some limitations:

- They aren’t thread safe by default and can allow data leakage.
- They can make code harder to maintain if overused as global variables.
- They can’t access non-static members without an explicit instance reference.

## Use Cases for `static`

### Utility or Helper Methods

Like we explain [above](#static-classes), helper or utility classes usually use the `static` keyword.

```csharp
public static class MathHelper
{
    public static int Add(int a, int b)
    {
        return a + b;
    }
    public static int Subtrack(int a, int b)
    {
        return a - b;
    }

    /// etc...
}
```

### Singleton Pattern

Ensuring a class has only one instance and providing a global point of access to it.

```csharp
public class Singleton
{
    private static Singleton _instance;

    private Singleton() { }

    public static Singleton Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new Singleton();
            }
            return _instance;
        }
    }
}
```

### Constants

Defining values that don’t change is another common use case.

```csharp
public class Constants
{
   public const string AppName = "MyApplication";
}
```

### Shared Data

When you need to share data across all instances of a class, you can use the `static` keyword.

```csharp
public class Configuration
{
   public static string ConnectionString;
}
```

## Conclusion

For further reading, take a look at the resources from Microsoft on the topic:

- [Microsoft Docs: Static Classes and Static Class Members](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/static-classes-and-static-class-members)
- [Microsoft Docs: static (C# Reference)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/static)

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
