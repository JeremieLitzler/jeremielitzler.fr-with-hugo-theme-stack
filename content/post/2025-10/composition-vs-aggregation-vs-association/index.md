---
title: "Composition vs Agrégation vs Association"
description: "Plongeons-nous dans les trois concepts de la programmation orientée objet."
image: 2025-07-14-a-notebook-with-wireframes.jpg
imageAlt: Un cahier avec des wireframes
date: 2025-10-22
categories:
  - Développement logiciel
tags:
  - Modèles De Conception
---

Ces concepts décrivent les relations entre les objets dans une hiérarchie de classes.

Nous allons les détailler un par un ci-dessous.

### Association

L’association représente une relation « *utilise-un* » ou « *possède-un* » entre deux classes distinctes, où une classe utilise l’autre. Elle définit une relation entre des objets où un objet peut accéder à un autre.

Par exemple, en C# :

```csharp
public class Driver
{
    public string Name { get; set; }
}

public class Car
{
    public string Model { get; set; }
    public Driver Driver { get; set; }  // Association avec la classe Driver
}

public class Program
{
    public static void Main()
    {
        Driver driver = new Driver { Name = "John" };
        Car car = new Car { Model = "Toyota", Driver = driver };

        Console.WriteLine($"{car.Driver.Name} drives a {car.Model}");
    }
}
```

### Agrégation

L’agrégation est une forme spécialisée d’association avec une relation « tout-partie », mais la durée de vie des parties est indépendante de celle du tout. En d’autres termes, la partie peut exister sans le tout.

Par exemple :

```csharp
public class Department
{
    public string Name { get; set; }
}

public class Company
{
    public string Name { get; set; }
    public List<Department> Departments { get; set; } = new List<Department>(); // Aggregation

    public void AddDepartment(Department department)
    {
        Departments.Add(department);
    }
}

public class Program
{
    public static void Main()
    {
        Department d1 = new Department { Name = "HR" };
        Department d2 = new Department { Name = "Finance" };

        Company company = new Company { Name = "TechCorp" };
        company.AddDepartment(d1);
        company.AddDepartment(d2);

        Console.WriteLine($"{company.Name} has the following departments:");
        foreach (var dept in company.Departments)
        {
            Console.WriteLine(dept.Name);
        }
    }
}
```

Une `Company` a des `Departments`. Cette relation est représentée par la liste `List<Department>`.

Le cycle de vie entre la `Company` et un `Department` est indépendant.
C’est l’élément clé qui distingue l’agrégation de la composition

Les départements sont créés à l’extérieur de la compagnie, ils existent indépendamment. Si la compagnie est détruite, les départements peuvent continuer à exister.

Les objets `Department` peuvent potentiellement appartenir à plusieurs `Company` (même si ce n’est pas illustré ci-dessus). Ils ne sont pas « possédés exclusivement » par une seule compagnie.

### Composition

La composition est une forme plus forte d’agrégation avec une relation « partie-tout » où la partie ne peut exister sans le tout. Si le tout est détruit, les parties sont également détruites.

Prenons l’exemple suivant :

```csharp
public class Engine
{
    public string Model { get; set; }

    public Engine(string model)
    {
        Model = model;
    }
}

public class Car
{
    public string Model { get; set; }
    public Engine Engine { get; set; } // Composition

    public Car(string model, string engineModel)
    {
        Model = model;
        Engine = new Engine(engineModel);
    }
}

public class Program
{
    public static void Main()
    {
        Car car = new Car("Toyota", "V8 Engine");

        Console.WriteLine($"Car model: {car.Model}, Engine model: {car.Engine.Model}");
    }
}
```

Une `Car` a toujours un `Engine`.
Cette relation est vitale : une voiture sans moteur n’a pas de sens.

Le moteur est créé à l’intérieur du constructeur de `Car`. Cela signifie :

- Le moteur naît en même temps que la voiture
- Le moteur mourra avec la voiture (quand l’objet Car sera détruit)
- On ne peut pas créer ce moteur indépendamment de cette voiture

Dans la vraie vie, quand on construit une voiture, le moteur est assemblé pour cette voiture spécifique. Si la voiture est détruite à la casse, son moteur l’est aussi (ou du moins, il perd son sens d’exister en tant que « moteur de cette voiture »). C’est une relation indissociable, exactement ce que modélise la composition.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [picjumbo.com](https://www.pexels.com/photo/notebook-beside-the-iphone-on-table-196644/).
