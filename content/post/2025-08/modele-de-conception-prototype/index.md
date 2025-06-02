---
title: "What is the Prototype Pattern?"
description: "Let's review the common use cases and concrete example on the pattern."
image: 2025-05-30-prototyping-a-box.jpg
imageAlt: Tools, glue and piece of a prototyped box on a sheet of paper with drawing and dimensions
date: 2025-08-29
categories:
  - Développement logiciel
tags:
  - Modèles de conception
---

## Definition

The Prototype design pattern is a creational pattern that allows for the creation of new objects by copying existing objects, which serve as prototypes.

This pattern is particularly useful when the cost of creating a new object is prohibitive or when a system wants to avoid subclasses proliferation.

## Common Use Cases

You’d use the pattern when:

1. you have **resource-intensive object creation**. When the cost of creating a new object is high in terms of time or resources, cloning an existing object can be much more efficient. For example, in graphic applications where creating a new graphic object (like a complex shape) is resource-intensive, cloning an existing one is preferred.
2. you want to **avoid subclass proliferation**. If a system has a complex hierarchy of classes and creating new combinations of state requires creating new subclasses, the Prototype pattern can be used to simplify this by cloning existing objects and modifying their state.
3. you need **dynamic object creation**. When the type of objects to be created is decided at runtime, the Prototype pattern allows for creating objects without knowing their exact types at compile time.
4. you need **state preservation**. In scenarios where an object needs to be saved and restored, such as in undo operations in text editors or other applications, cloning can help in preserving the state of the object.

## Example of **Resource-Intensive Object Creation**

Let’s consider a scenario in a graphic design application where creating a complex graphic object, such as a fractal, is resource-intensive. Instead of creating new fractals from scratch each time, we can create a prototype of a fractal and clone it whenever needed.

Suppose we have a `Fractal` class that is computationally expensive to create. We will use the Prototype pattern to clone existing fractals instead of creating new ones.

### Fractal Class

```csharp
using System;

abstract class Fractal
{
    public abstract Fractal Clone();
    public abstract void Draw();
}

class MandelbrotFractal : Fractal
{
    private int _complexity;

    public MandelbrotFractal(int complexity)
    {
        _complexity = complexity;
        // Simulate a resource-intensive creation process
        Console.WriteLine("Creating a Mandelbrot fractal with complexity " + complexity);
        System.Threading.Thread.Sleep(2000); // Simulate time-consuming creation
    }

    // Implement the Clone method
    public override Fractal Clone()
    {
        return (Fractal)this.MemberwiseClone();
    }

    public override void Draw()
    {
        Console.WriteLine("Drawing a Mandelbrot fractal with complexity " + _complexity);
    }
}

```

### Prototype Manager Class

```csharp
using System.Collections.Generic;

class FractalManager
{
    private Dictionary<string, Fractal> _fractalPrototypes = new Dictionary<string, Fractal>();

    public void RegisterFractal(string key, Fractal fractal)
    {
        _fractalPrototypes[key] = fractal;
    }

    public Fractal GetFractalClone(string key)
    {
        if (_fractalPrototypes.ContainsKey(key))
        {
            return _fractalPrototypes[key].Clone();
        }
        throw new ArgumentException("Fractal with the specified key doesn't exist.");
    }
}

```

### Client Code

```csharp
class Program
{
    static void Main(string[] args)
    {
        FractalManager fractalManager = new FractalManager();

        // Create and register a prototype of a Mandelbrot fractal
        MandelbrotFractal mandelbrotPrototype = new MandelbrotFractal(5);
        fractalManager.RegisterFractal("Mandelbrot", mandelbrotPrototype);

        // Clone the fractal multiple times
        // with the delay of object creation
        Fractal clonedFractal1 = fractalManager.GetFractalClone("Mandelbrot");
        clonedFractal1.Draw();

        Fractal clonedFractal2 = fractalManager.GetFractalClone("Mandelbrot");
        clonedFractal2.Draw();

        Fractal clonedFractal3 = fractalManager.GetFractalClone("Mandelbrot");
        clonedFractal3.Draw();
    }
}

```

### Explanation

1. `Fractal` is an abstract class that defines the `Clone` and `Draw` methods. `MandelbrotFractal` is a concrete implementation of `Fractal` that simulates a resource-intensive creation process through a simple timeout.

2. `FractalManager` is a class that manages the prototypes of fractals. It allows registering a fractal prototype with a specific key and retrieving a clone of the fractal using that key.

3. In the `Main` method of the client code, a `FractalManager` instance is created, and a `MandelbrotFractal` prototype is registered with it. The fractal is then cloned multiple times, and each clone is drawn. The resource-intensive creation process (simulated by a sleep) only happens once when the prototype is created. Subsequent clones are created quickly by copying the prototype.

## Example of **Subclass Proliferation**

Let’s dive a game development context where we have different types of game characters. Each character can have various attributes such as health, attack power, and defense, and different combinations of these attributes might require creating many subclasses if we don’t use the Prototype pattern.

By using the Prototype pattern, we can avoid subclass proliferation by cloning existing character prototypes and modifying their attributes as needed.

Suppose we have a base `GameCharacter` class and several types of characters (e.g., Warrior, Mage) that share common attributes but may need customization.

Imagine we have 5 base character types (Warrior, Mage, Archer, Rogue, Cleric). Each needs 3 variants (Basic, Elite, Legendary). Without Prototype, you'd need 15 subclasses.

```csharp
// Base classes
class WarriorBasic {}
class WarriorElite {}
class WarriorLegendary {}

class MageBasic {}
class MageElite {}
// ...and 10 more subclasses

// Client code would need to hardcode all variants
var warrior = new WarriorElite(health: 150, attack: 25);
var mage = new MageLegendary(health: 80, attack: 40);
```

We face the following Problems:

- ❌ Exploding number of subclasses
- ❌ Hard to maintain
- ❌ No runtime flexibility

Let's apply the Prototype Pattern to simplify the classes.

### GameCharacter Class

First, let's abstract the `GameCharacter`:

```csharp
using System;

abstract class GameCharacter
{
    public int Health { get; set; }
    public int AttackPower { get; set; }
    public int Defense { get; set; }

    public abstract GameCharacter Clone();
    public abstract void Display();
}
```

And define the necessary subclasses:

```csharp
class Warrior : GameCharacter
{
    public Warrior(int health, int attackPower, int defense)
    {
        Health = health;
        AttackPower = attackPower;
        Defense = defense;
    }

    public override GameCharacter Clone()
    {
        return (GameCharacter)this.MemberwiseClone();
    }

    public override void Display()
    {
        Console.WriteLine($"Warrior [Health: {Health}, AttackPower: {AttackPower}, Defense: {Defense}]");
    }
}

class Mage : GameCharacter
{
    public Mage(int health, int attackPower, int defense)
    {
        Health = health;
        AttackPower = attackPower;
        Defense = defense;
    }

    public override GameCharacter Clone()
    {
        return (GameCharacter)this.MemberwiseClone();
    }

    public override void Display()
    {
        Console.WriteLine($"Mage [Health: {Health}, AttackPower: {AttackPower}, Defense: {Defense}]");
    }
}

```

### Client Code of the Game

Let's put this to the test.

```csharp
class Program
{
    static void Main(string[] args)
    {
        // Create a prototype
        Warrior basicWarriorPrototype = new Warrior(100, 20, 10);

        Mage basicMagePrototype = new Mage(50, 30, 5);

        // Clone the characters multiple times and modify them as needed
        GameCharacter eliteWarrior = basicWarriorPrototype.Clone()
        eliteWarrior.Health = 120; // Customize the clone
        eliteWarrior.Display();
        basicWarriorPrototype.Display();

        GameCharacter legendaryMage = basicMagePrototype.Clone();
        legendaryMage.AttackPower = 35; // Customize the clone
        legendaryMage.Display();
        basicMagePrototype.Display();
    }
}

```

### Explanation of the Game

1. Like in the first example, **GameCharacter Class** represents an abstraction and defines the `Clone` and `Display` methods. `Warrior` and `Mage` are concrete implementations of `GameCharacter`. Each subclass implements the `Clone` method using `MemberwiseClone()` to create a shallow copy of the object.
2. In the `Main` method of the client code, prototypes of `Warrior` and `Mage` are created. The enhanced characters are then cloned from the basic character, and their attributes are customized as needed. The `Display` method outputs the clones’s value and it shows the original prototype isn’t affected.

The key benefits are as follows:

- Eliminated 12 subclasses (from 15 to 3 classes)
- Runtime customization without recompiling
- Centralized configuration through prototypes
- Easier maintenance - changes propagate to all clones

This shows how Prototype helps avoid combinatorial explosion of subclasses when dealing with multiple variation axes (character type + variant tier in this case).

## Resources to Read

You need more details on this design pattern?

You can read:

- Gamma, Erich, et al. _Design Patterns: Elements of Reusable Object-Oriented Software_. Addison-Wesley, 1994. This is the seminal book that introduced the Prototype pattern among other design patterns.
- Freeman, Eric, and Elisabeth Freeman. _Head First Design Patterns_. O’Reilly Media, 2004. This book provides an accessible and engaging introduction to design patterns, including the Prototype pattern.
- [Microsoft Docs](https://learn.microsoft.com/en-us/dotnet/standard/design-patterns/prototype-design-pattern): The official Microsoft documentation on design patterns includes explanations and examples of the Prototype pattern.
- [_Prototype Pattern Explained: When Copying is Smarter Than Creating_ de Maxim Gorin](https://medium.com/@maxim-gorin/prototype-pattern-explained-when-copying-is-smarter-than-creating-d05a85ae393a) : the article explains the topic very well, in my opinion.

These references can provide further reading and context on the Prototype pattern and its use cases. My article is my take on it and my notes for future reference.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}

Photo by [Senne](https://www.pexels.com/photo/white-diagram-paper-under-pliers-1178498/).
