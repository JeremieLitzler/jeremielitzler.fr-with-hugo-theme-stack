---
title: "Concevoir une classe fermée en C#"
description: "Pour empêcher une classe d'être derivée par une autre classe en C#, vous pouvez utiliser un mot-clé. Voyons lequel, comment l'utiliser et pourquoi."
image: 2025-09-15-sealed-keyword-in-dotnet-and-csharp.jpg
imageAlt: "Image avec ‘Modificateur Sealed en .NET et C#’"
date: 2025-11-04
categories:
  - Développement web
tags:
  - Csharp
  - Programmation orientée objet
---

## How

To prevent a class from being subclassed in C#, you can use the `sealed` keyword. When a class is marked as `sealed`, it can’t be inherited by any other class. This is useful when you want to ensure that your class’s implementation remains unchanged and that no further subclasses are created to modify its behavior.

Here is an example of how to design a class to prevent it from being subclassed:

```csharp
public sealed class SealedClass
{
    // Class members go here

    public void DoAwesome()
    {
        // Method implementation
    }
}

```

In this example, `SealedClass` is marked as `sealed`, so no other class can inherit from it. If you try to create a subclass of `SealedClass`, the C# compiler will generate an error.

Here’s an example demonstrating the compiler error:

```csharp
public class DerivedClass : SealedClass
{
    // This will cause a compiler error because SealedClass is sealed
}

```

Attempting to compile the above code will result in a compiler error similar to:

```
error CS0509: 'DerivedClass': cannot derive from sealed type 'SealedClass'
```

Using the `sealed` keyword is a straightforward and effective way to ensure that a class can’t be subclassed in C#.

## Why

Using the `sealed` keyword in C# to prevent a class from being subclassed can be particularly useful in several scenarios. Here are some common use cases:

### 1. **Ensuring Security and Integrity**

When a class handles sensitive data or security-critical operations, sealing the class can prevent accidental or malicious modifications that could compromise the system’s security.

For example, a class that manages encryption keys or performs authentication checks falls into that category.

Feel free to review the [Microsoft Documentation on Secure Coding Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/security/secure-coding-guidelines) to dive deeper into the topic.

### 2. **Preserving Class Invariants**

If a class has complex internal logic and invariants that must always be maintained, sealing the class ensures that derived classes don’t unintentionally break these invariants.

For example, a class that manages a complex financial transaction process can benefit from the sealed mechanism.

[Microsoft’s Documentation on Class Design Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/class-design) can help to deepen the concept.

### 3. **Performance Optimization**

Sealing a class can lead to performance optimizations because the runtime can make certain assumptions about the class, such as avoiding virtual method dispatch overhead.

For example, frequently used utility classes or data structures where performance is critical do benefit from sealing classes.

Read more in the [Microsoft Documentation on Performance Considerations](https://docs.microsoft.com/en-us/dotnet/framework/performance/performance-tips) to understand the detailed impacts.

### 4. **API Design Stability**

When designing public APIs, sealing classes can help ensure that the behavior of the class remains stable and predictable, avoiding issues that might arise from incorrect subclassing.

An example would be framework classes that are widely used by other developers.

[Microsoft Documentation on API Design](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/) explains why in detail.

### 5. **Preventing Misuse**

Sealing a class can prevent users from inheriting and misusing the class in ways that weren’t intended by the original design.

This is the case for non-static utility classes that provide static methods where inheritance doesn’t make sense.

You can read “[.NET Sealed Classes - Example 2: Utility Classes](https://www.compilenrun.com/docs/framework/dotnet/net-object-oriented-programming/net-sealed-classes/)” to verify this.

## Example Scenario

Consider a class `CorePaymentProcessor` that handles financial transactions. This class might involve complex logic to ensure transactional integrity and security. To prevent any subclass from potentially compromising these aspects, the class can be sealed:

```csharp
public sealed class CorePaymentProcessor
{
    // Members and methods to process payments securely

    public void ProcessPayment(decimal amount)
    {
        // Payment processing logic
    }
}
```

If someone tries to subclass `CorePaymentProcessor`, they will encounter a compiler error:

```csharp
public class OtherPaymentProcessor : CorePaymentProcessor
{
    // This will cause a compiler error because CorePaymentProcessor is sealed
}
```

## Conclusion

There you have it! Were you using the `sealed` keyword before? Now, you might need to review your code to make your code safer.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
