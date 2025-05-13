---
title: "Patrons de conception : Usine simple vs méthode d’usine"
description: "L’Usine simple et la Méthode d’usine sont tous deux des modèles de conception créative utilisés pour créer des objets, mais ils le font de manière différente."
image: 2025-05-13-simple-factory-pattern-vs-factory-method-pattern-image.jpg
imageAlt: « Usine simple vs méthode d’usine » sur un fond dégradé
date: 2025-07-23
categories:
  - Développement logiciel
tags:
  - Patrons de Conception
---

## Modèle d’usine simple

Le patron d’usine simple encapsule le processus de création d’objets dans une seule méthode et n’implique pas d’héritage. Il s’agit d’une implémentation de base dans laquelle une classe contient une méthode pour créer des instances d’autres classes. Cette méthode prend généralement des paramètres pour décider de l’instance à créer.

Voici un exemple en C# :

```csharp
public class ShapeFactory
{
    public enum ShapeType
    {
        Circle,
        Square
    }

    public static IShape CreateShape(ShapeType type)
    {
        switch (type)
        {
            case ShapeType.Circle:
                return new Circle();
            case ShapeType.Square:
                return new Square();
            default:
                throw new ArgumentException("Invalid type");
        }
    }
}

public interface IShape
{
    void Draw();
}

public class Circle : IShape
{
    public void Draw()
    {
        Console.WriteLine("Drawing a Circle");
    }
}

public class Square : IShape
{
    public void Draw()
    {
        Console.WriteLine("Drawing a Square");
    }
}

// Usage
class Program
{
    static void Main(string[] args)
    {
        IShape circle = ShapeFactory.CreateShape(ShapeFactory.ShapeType.Circle);
        circle.Draw();

        IShape square = ShapeFactory.CreateShape(ShapeFactory.ShapeType.Square);
        square.Draw();
    }
}
```

## La méthode d’usine

Le patron de la méthode d’usine implique une méthode dans une classe de base qui est surchargée par les sous-classes pour créer des instances spécifiques. Ce modèle utilise l’héritage et s’appuie sur les sous-classes pour gérer l’instanciation des objets.

Voici un exemple en C# :

```csharp
// Abstract class
public interface IShape
{
    void Draw();
}

// Concrete class: Circle
public class Circle : IShape
{
    public void Draw()
    {
        Console.WriteLine("Drawing a Circle");
    }
}

// Concrete class: Square
public class Square : IShape
{
    public void Draw()
    {
        Console.WriteLine("Drawing a Square");
    }
}

// Abstract Creator
public abstract class ShapeFactory
{
    public abstract IShape CreateShape();

    public void DrawShape()
    {
        var shape = CreateShape();
        shape.Draw();
    }
}

// Concrete Creator: Circle Factory
public class CircleFactory : ShapeFactory
{
    public override IShape CreateShape()
    {
        return new Circle();
    }
}

// Concrete Creator: Square Factory
public class SquareFactory : ShapeFactory
{
    public override IShape CreateShape()
    {
        return new Square();
    }
}

// Usage
class Program
{
    static void Main(string[] args)
    {
        ShapeFactory circleFactory = new CircleFactory();
        circleFactory.DrawShape();

        ShapeFactory squareFactory = new SquareFactory();
        squareFactory.DrawShape();
    }
}

```

## Comparons les deux approches

1. **Héritage** :
   - Dans l’**Usine simple**, nous utilisons une seule classe avec une méthode statique. Il n’y a pas d’héritage.
   - Dans la **Méthode d’usine**, nous utilisons l’héritage. La classe de base définit une méthode d’usine et les sous-classes la surchargent pour créer des instances spécifiques.
2. La **flexibilité et l’extensibilité** :
   - Dans l’**Usine simple**, l’ajout d’un nouveau produit nécessite de modifier la classe de la factory, ce qui peut enfreindre le principe d’ouverture/fermeture.
   - Dans la **Méthode d’usine**, l’ajout d’un nouveau produit implique la création d’une nouvelle sous-classe. La classe de base n’a pas besoin d’être modifiée, ce qui est conforme au principe d’ouverture/fermeture.
3. **Responsabilité** :
   - Dans l’**Usine simple**, la méthode est chargée de décider quelle classe doit être instanciée en fonction des paramètres.
   - Dans la **Méthode d’usine**, la décision de la classe à instancier reste du ressort des sous-classes.

## Ressources pour une lecture plus approfondie

- Design Patterns : « Elements of Reusable Object-Oriented Software » par Erich Gamma, Richard Helm, Ralph Johnson, et John Vlissides (Gang of Four)
- [Microsoft Docs - Méthode d’usine](https://learn.microsoft.com/en-us/dotnet/standard/design-patterns/factory-method)
- [Refactoring Guru—Méthode d’usine](https://refactoring.guru/design-patterns/factory-method)

Ces exemples et explications devraient enrichir votre compréhension des deux modèles de patrons de conception et de leurs différences.

Le patron de la Méthode d’usine est celui que nous utilisons le plus dans le développement de logiciels, mais vous verrez ou utiliserez l’Usine simple de temps en temps.

La Méthode d’usine peut sembler exagérée en ce qui concerne la quantité de code dont vous avez besoin.

En fonction de votre base de code et de la taille du projet, vous pouvez préférer une méthode à l’autre.

L’adhésion au principe d’ouverture/fermeture peut guider votre choix.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
