---
title: "Comprendre les 4 accesseurs en C#"
description: "Les connaissez-vous ? Pourquoi utiliser l’un plutôt que l’autre ? Voyons cela en détail."
image: 2025-05-09-a-private-sign.jpg
imageAlt: Un panneau avec le mot « Private » (privé)
date: 2025-07-16
categories:
  - Développement logiciel
tags:
  - Csharp
---

En C#, les accesseurs définissent la visibilité et l’accessibilité des membres (champs, propriétés, méthodes, etc.) au sein d’une classe ou d’une structure. Les principaux accesseurs en C# sont `private`, `public` et `protected`. Voici une explication détaillée de chacun d’entre eux.

## Qu’est-ce que les accesseurs ?

### Accesseur `private`

Les membres déclarés avec l’accesseur `private` ne sont accessibles qu’à l’intérieur de la même classe ou structure.

Vous pouvez utiliser `private` pour encapsuler des données et restreindre leur accès depuis l’extérieur de la classe. Cela permet de garder le contrôle sur les données et de s’assurer que vous ne pouvez pas les modifier ou y accéder directement depuis d’autres parties du code.

Dans l’exemple ci-dessous, le champ `_name` est privé et ne peut être accédé ou modifié que par les méthodes `SetName` et `GetName`.

La convention est aussi de préfixer le champ par `_`.

```csharp
class Person
{
    private string _name;

    public void SetName(string name)
    {
        this._name = name;
    }

    public string GetName()
    {
        return this._name;
    }
}

```

### Accesseur `public`

Les membres déclarés avec l’accesseur `public` sont accessibles à partir de n’importe quel autre code. Il n’y a aucune restriction sur leur accessibilité.

Vous utilisez `public` lorsque vous voulez exposer les membres pour qu’ils soient accessibles depuis l’extérieur de la classe ou de la structure, comme dans une bibliothèque ou une API où vous devez fournir un accès à certaines fonctionnalités.

Dans l’exemple ci-dessous, la propriété `Name` est publique et peut être accédée et modifiée directement depuis l’extérieur de la classe `Person`.

```csharp
namespace Some.Library;

public class Person
{
    public string Name { get; set; }
    public Person() {}
}

using Some.Library;
namespace Some.Project.Using.The.Library;
class Polite {
    void Greet()
    {
        var person = new Person()
        person.Name = "Jeremie"; //Set name
        Console.WriteLine($"Hello, my name is {person.Name}."); //Get name
    }
}
```

### Accesseur `protected`

Les membres déclarés avec l’accesseur `protected` sont accessibles dans la même classe ou structure, et dans les classes dérivées.

Vous utilisez `protected` lorsque vous voulez autoriser l’accès aux membres de la classe de base et des classes dérivées, mais restreindre l’accès à d’autres parties du code.

Dans l’exemple ci-dessous, le champ `species` est protégé et peut être accédé dans la classe `Animal` et la classe `Dog`, qui est dérivée de `Animal`.

```csharp
class Animal
{
    protected string species;

    public void SetSpecies(string species)
    {
        this.species = species;
    }
}

class Dog : Animal
{
    public void DisplaySpecies()
    {
        Console.WriteLine($"Ce chien appartient à l'espèce : {species}");
    }
}
```

### Quelques accesseurs supplémentaires

C# fournit également d’autres modificateurs d’accès comme `internal` et `protected internal` :

`internal` rend les membres accessibles au sein du même assemblage, mais pas à partir d’un autre assemblage.

```csharp
internal class InternalClass
{
    internal int InternalProperty { get; set; }
}

```

`protected internal` rend les membres accessibles au sein du même assemblage et d’une classe apparentée dans l’assemblage.

```csharp
protected internal class ProtectedInternalClass
{
    protected internal int ProtectedInternalProperty { get; set; }
}

```

## Qu’en est-il des accesseurs implicites dans la classe

Dans les exemples ci-dessus, vous vous demandez peut-être ce qui se passe lorsque vous ne spécifiez pas l’identificateur d’accès à la classe, à la méthode ou à la propriété.

Le modificateur d’accès d’une classe est important et peut affecter la manière dont on accède à la classe. En C#, si une classe ne spécifie pas de modificateur d’accès explicite, elle prend par défaut la valeur `internal`.

## Notes importantes

- **Pour les classes de premier niveau** : en C#, les classes de premier niveau (c’est-à-dire celles qui ne sont pas imbriquées dans une autre classe) ne peuvent avoir que des modificateurs d’accès `public` ou `internal`. Elles ne peuvent pas être `private` ou `protected`.
- **Pour les classes imbriquées** : lorsqu’une classe est imbriquée dans une autre classe, elle peut avoir n’importe quel modificateur d’accès (`public`, `private`, `protected`, `internal`, `protected internal`).

### Exemple avec des classes imbriquées

```csharp
public class OuterClass
{
    private class InnerPrivateClass
    {
        // Accessible seulement à  l'intérieur OuterClass
    }

    protected class InnerProtectedClass
    {
        // Accessible seulement à  l'intérieur OuterClass et les classes dérivées
    }

    internal class InnerInternalClass
    {
        // Accessible seulement à  l'intérieur la même assembly
    }

    public class InnerPublicClass
    {
        // Accessible depuis n'importe quelle assembly
    }
}

```

Dans cet exemple :

- `InnerPrivateClass` n’est accessible que dans `OuterClass`.
- `InnerProtectedClass` est accessible dans `OuterClass` et les classes dérivées.
- `InnerInternalClass` est accessible dans le même assembly.
- `InnerPublicClass` est accessible à partir de n’importe quel assembly.

## Conclusion

Comprendre et utiliser correctement les modificateurs d’accès aux classes permet de concevoir l’architecture de votre code, de contrôler les niveaux d’accès et d’assurer une encapsulation et une sécurité adéquates.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Tim Mossholder](https://www.pexels.com/photo/black-and-white-wooden-sign-behind-white-concrete-3690735/)
