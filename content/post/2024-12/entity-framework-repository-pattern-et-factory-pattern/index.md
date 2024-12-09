---
title: "Entity Framework, Repository Pattern et Factory Pattern"
description: "Qu’est-ce qu’Entity Framework et quel est son lien avec les modèles Repository et Factory ? Plongeons dans le vif du sujet !"
image: images/2024-11-29-ladder-leaning-on-bookshelf.jpg
imageAlt: Échelle en bois appuyée sur une étagère
date: 2024-12-09
categories:
  - Web Development
tags:
  - Entity Framework
  - Modèles de conception
---

_Entity Framework_ (ou _EF_ en abrégé) dans les applications C# utilise souvent des principes équivalents au _Factory Design Pattern_, mais il ne s’agit pas d’une implémentation directe du modèle de conception. Au lieu de cela, nous considérons _EF_ comme un bon exemple d’implémentation du _Repository Pattern_.

_EF_ se concentre sur le mappage objet-relationnel (en anglais _Object-Relational Mapping_ ou _ORM_) pour interagir avec les bases de données. Ensuite, il fait abstraction de la création et de la gestion du contexte des données et des entités, ce qui peut être considéré comme l’exploitation d’un comportement similaire à celui d’un _Factory Pattern_.

## Qu’est-ce que le _Factory Pattern_ en bref ?

Imaginez une pizzeria dotée de plusieurs stations de fabrication de pizzas.

Chaque poste (_Concrete Factory_) suit un processus général de fabrication de pizzas (_Abstract Factory_) mais peut créer différents types de pizzas.

Qu’il s’agisse d’une pizza margherita, d’une pizza pepperoni ou d’une pizza végétarienne, le processus de base reste le même, mais les ingrédients spécifiques et la préparation varient.

Le _Factory Pattern_ fonctionne de manière très similaire dans la conception de logiciels.

Il s’agit d’un modèle de conception créative qui fournit une interface pour la création d’objets dans une superclasse, mais qui permet aux sous-classes de modifier le type d’objets qui seront créés.

Essayez de réfléchir aux endroits de votre propre code où vous pourriez avoir besoin d’un processus de création d’objets flexible. Où voyez-vous des modèles de création répétitifs qui pourraient bénéficier d’une approche plus abstraite ?

## Qu’est-ce que le _Repository Pattern_ en bref ?

Imaginez-le comme une bibliothèque :

- Vous (client) demandez un livre
- Le bibliothécaire (référentiel) sait exactement où le trouver.
- Vous n’avez pas besoin de connaître l’organisation interne de la bibliothèque.
- Le bibliothécaire s’occupe de tous les mécanismes complexes de recherche.

Cette approche garantit que la logique de base de votre application reste propre, flexible et indépendante des implémentations spécifiques de stockage de données.

Le modèle de référentiel fonctionne comme un bibliothécaire, abstrayant les détails complexes d’accès aux données. Il fournit une interface simple et propre, semblable à une collection, pour :

- Récupérer des données
- Ajouter de nouvelles entités
- Mettre à jour des entités existantes
- Supprimer des entités

Les avantages sont les suivants :

- Il découple la logique commerciale de l’accès aux données
- Il centralisation de la logique d’accès aux données
- Il simplifie les tests et la maintenance
- Il permet de passer facilement d’une technologie de stockage des données à une autre

## Comment _Entity Framework_ se rapproche du _Factory Pattern_ tout en utilisant fortement le _Repository Pattern_

Nous pouvons considérer le _DbContext_ comme une _Factory_ qui crée des instances d’objets _Entity_ lors de l’interrogation de la base de données. Lorsque vous effectuez une requête, le _DbContext_ génère les entités qui correspondent aux conditions de la requête.

Cependant, _EF_ s’utilise en conjonction avec le _Repository Pattern_, qui peut encapsuler la logique de création et d’accès, ce qui le fait ressembler au _Factory Pattern_.

## Usage

### Exemple avec _EF_

Voici un exemple qui montre comment _Entity Framework_ peut utiliser des principes similaires au _Factory Pattern_ dans une application C#.

Tout d’abord, nous avons besoin d’une _classe d’entité_ :

```csharp
public class Book
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Isbn { get; set; }
}

```

Et d’une classe `DbContext`:

```csharp
using Microsoft.EntityFrameworkCore;

public class BookContext : DbContext
{
    public DbSet<Book> Books { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionStringHere");
    }
}

```

Ensuite, on définit l’interface `IRepository` que toutes les classes de référentiel concrètes utiliseront :

```csharp
public interface IRepository<T> where T : class
{
    IEnumerable<T> GetAll();
    T GetById(int id);
    void Add(T entity);
    void Delete(T entity);
    void Save();
}

```

Par exemple, la classe `BookRepository` l’implémente :

```csharp
public class BookRepository : IRepository<Book>
{
    private readonly BookContext _context;

    public BookRepository(BookContext context)
    {
        _context = context;
    }

    public IEnumerable<Book> GetAll()
    {
        return _context.Books.ToList();
    }

    public Book GetById(int id)
    {
        return _context.Books.Find(id);
    }

    public void Add(Book entity)
    {
        _context.Books.Add(entity);
    }

    public void Delete(Book entity)
    {
        _context.Books.Remove(entity);
    }

    public void Save()
    {
        _context.SaveChanges();
    }
}

```

### Utilisation du référentiel dans le code client

Dans le code client, vous pourriez consommer le référentiel de la façon suivante :

```csharp
class Program
{
    static void Main()
    {
        using (var context = new BookContext())
        {
            var library = new BookRepository(context);

            // Ajouter un livre
            var book1 = new Book { Name = "The Handbook of Science and Technology Studies", Isbn = "9780262035682" };
            // Puis un autre
            var book2 = new Book { Name = "Technology Trends for 2024", Isbn = "9781098167950" };
            // Et un 3e
            var book3 = new Book { Name = "Modern Operating Systems", Isbn = "9780137618842" };
            library.Add(book1);
            library.Add(book2);
            library.Add(book3);
            library.Save();

            // Lire tous les livres
            var books = library.GetAll();
            foreach (var book in books)
            {
                Console.WriteLine($"ID du livre : {book.Id}, Titre : {book.Name}, ISBN : {book.Isbn}");
            }
        }
    }
}
```

Dans l’exemple, il y a des éléments qui ressemblent à ceux d’une usine :

### `DbContext` comme une _Factory_

La classe `BookContext` joue un rôle de _Factory_ en :

- Créant des connexions à la base de données et configurant l’accès à la base de données via la méthode `OnConfiguring()`.
- Fournissant les propriétés `DbSet<T>` qui permettent de suivre et d’interroger les entités.
- Abstraillant l’interaction avec la base de données et donc en encapsulant la complexité des opérations de base de données

### Le référentiel comme variant de la _Factory_

L’interface `IRepository<T>` et la classe `BookRepository` démontrent le pattern _Repository_, qui partage des similarités avec le pattern _Factory_ :

- Abstraction : fournit une interface standardisée pour les opérations d’accès aux données
- Découplage : séparation de la logique d’accès aux données et de la logique métier
- Flexibilité : permet de changer facilement de source de données ou d’implémentation ORM

### Des caractéristiques assimilables à une _Factory_

Il y a les éléments suivants :

- Création d’objets : le `BookRepository` crée et gère des instances d’entités `Book`. Il fournit également des méthodes comme `Add()`, `GetById()`, et ainsi de suite, qui abstraient la création et la récupération d’objets.
- Injection de dépendance : le référentiel accepte un `DbContext` dans son constructeur, ce qui permet une configuration flexible. Il supporte également un couplage lâche entre l’accès aux données et la logique métier.
- Abstraction : l’interface `IRepository<T>` définit un contrat pour les méthodes d’accès aux données. Les implémentations concrètes peuvent varier sans affecter le code client.

## En résumé…

Bien qu’_Entity Framework_ ne soit pas une implémentation directe du _Factory Pattern_, il utilise des principes similaires en abstrayant la création et la gestion des entités et de leur contexte.

Le pattern _Repository_, souvent utilisé avec _EF_, encapsule la logique d’accès aux données. Il peut favoriser un comportement similaire à celui d’une _Factory_, aidant à gérer la création d’objets et l’interaction avec la base de données.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit: Photo de [Jean Vella](https://unsplash.com/@jean_vella?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/a-ladder-leaning-against-a-bookshelf-filled-with-books-wuQ-2WLVJuo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
