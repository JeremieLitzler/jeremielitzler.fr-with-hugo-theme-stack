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

Voici les principaux cas d'utilisation et exemples d'utilisation du mot-clé `static` en C# :

## Utilisations

### Champs statiques

Ils représentent des variables qui appartiennent au type lui-même et sont partagées par toutes les instances du type.

Par exemple :

```csharp
public class Example
{
    public static int PI = 3.14;
}

//Outputs 3.14
Console.WriteLine(Example.PI);
```

### Méthodes statiques

Ces méthodes appartiennent au type lui-même et vous pouvez les appeler sans créer d'instance du type.

```csharp
public class Example
{
    public static void SayHello()
    {
        Console.WriteLine("Salut !");
    }
}

//Outputs "Salut !"
Example.SayHello()
```

### Propriétés statiques

Ce type de propriétés appartient au type lui-même.

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

L'exemple ci-dessus illustre un cas d'utilisation dans lequel une propriété statique permet de suivre le nombre d'instances de classe créées. La propriété reste accessible (`Person.Count`) plutôt que par une instance.

### Constructeurs statiques

Ces constructeurs initialisent les membres statiques du type. Ils sont appelés automatiquement avant tout accès aux membres statiques et ne sont exécutés qu'une seule fois.

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

### Classes statiques

Ces classes ne peuvent contenir que des membres statiques. Vous ne pouvez pas créer d'instance d'une classe statique, et elle est généralement utilisée pour regrouper des méthodes utilitaires.

```csharp
public static class Utility
{
    public static void HelperMethod()
    {
       Console.WriteLine("This is a helper method.");
    }
}
```

### Avantages et inconvénients

L'utilisation de `static` en C# offre plusieurs avantages clés pour le développement d'applications :

- Efficacité de la mémoire : une seule copie existe pour l'ensemble de l'application, quel que soit le nombre d'instances de classe créées, et l'utilisation de la mémoire est réduite puisqu'aucune instanciation d'objet n'est nécessaire.

- Gestion de l'état : en termes d'accès global, ils fournissent des valeurs partagées accessibles à l'ensemble de l'application sans création d'instance. Il s'agit par exemple de maintenir des constantes ou des valeurs de configuration à l'échelle de l'application. Au niveau de la classe, c'est avantageux pour mettre en œuvre des modèles de singleton ou gérer un état à l'échelle de la classe.

Cependant, vous devez tenir compte de certaines limitations :

- Ils ne sont pas « thread-safe » par défaut et peuvent causer des fuites de données.
- Elles peuvent rendre le code plus difficile à maintenir si elles sont utilisées de manière excessive en tant que variables globales.
- Elles ne peuvent pas accéder aux membres non statiques sans une référence d'instance explicite.

## Cas d'utilisation du mot clé `static`

### Méthodes utilitaires

Comme nous l'avons expliqué [ci-dessus](#classes-statiques), les classes utilitaires utilisent généralement le mot-clé `static`.

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

### Modèle Singleton

S'assurer qu'une classe n'a qu'une seule instance, et fournir un point d'accès global à celle-ci, c'est un cas bien classique.

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

### Constantes

Définir des valeurs qui ne changent pas est un autre cas d'utilisation courant.

```csharp
public class Constants
{
   public static const string AppName = "MyApplication";
}
```

### Données partagées

Lorsque vous avez besoin de partager des données entre toutes les instances d'une classe, vous pouvez utiliser le mot-clé `static`.

```csharp
public class Configuration
{
   public static string ConnectionString;
}
```

## Conclusion

Pour en savoir plus, consultez les ressources de Microsoft sur le sujet :

- [Microsoft Docs : Classes statiques et membres de classe statique (Guide de programmation C#)](https://learn.microsoft.com/fr-fr/dotnet/csharp/programming-guide/classes-and-structs/static-classes-and-static-class-members)
- [Microsoft Docs : static (référence C#)](https://learn.microsoft.com/fr-fr/dotnet/csharp/language-reference/keywords/static)

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
