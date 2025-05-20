---
title: "Le modèle de conception “Decorateur”"
description: "Le modèle de conception “Decorateur” est un modèle de conception structurelle utilisé pour étendre la fonctionnalité des objets d’une manière flexible et réutilisable."
image: 2025-05-23-4-colored-paint-brushes.jpg
imageAlt: 4 pinceaux de couleur
date: 2025-08-22
categories:
  - Développement logiciel
tags:
  - Modèles de conception
---

En C#, l’utilisation du modèle de conception _Decorator_ implique la création d’un ensemble de classes de décorateurs qui sont utilisées pour envelopper des composants concrets. Voici un exemple concret et quelques cas d’utilisation courants.

Créons un exemple simple impliquant un système `Notifier` où nous pouvons envoyer des notifications via différents canaux (Email, SMS, etc.).

## Étape 1 : Créer une interface de composant

Cette étape est essentielle pour définir le contrat que les décorateurs devront mettre en œuvre.

```csharp
public interface INotifier
{
    void Send(string message);
}
```

## Étape 2 : Créer un composant concret

```csharp
public class EmailNotifier : INotifier
{
    public void Send(string message)
    {
        Console.WriteLine($"Sending Email: {message}");
    }
}

```

## Étape 3 : Création de la classe décoratrice de base

```csharp
public class NotifierDecorator : INotifier
{
    protected INotifier _notifier;

    public NotifierDecorator(INotifier notifier)
    {
        _notifier = notifier;
    }

    public virtual void Send(string message)
    {
        _notifier.Send(message);
    }
}

```

## Étape 4 : Créer des décorateurs concrets

```csharp
public class SMSNotifier : NotifierDecorator
{
    public SMSNotifier(INotifier notifier) : base(notifier)
    {
    }

    public override void Send(string message)
    {
        base.Send(message);
        Console.WriteLine($"And sending SMS: {message}");
    }
}

public class FacebookNotifier : NotifierDecorator
{
    public FacebookNotifier(INotifier notifier) : base(notifier)
    {
    }

    public override void Send(string message)
    {
        base.Send(message);
        Console.WriteLine($"And posting on Facebook: {message}");
    }
}

```

## Étape 5: Utiliser les décorateurs

Mettons le code à l’épreuve :

```csharp
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine($"## Use case: just Email");
        INotifier emailNotifier = new EmailNotifier();
        emailNotifier.Send("Hello World!");

        Console.WriteLine($"## Use case: Email+SMS");
        var smsNotifier = new SMSNotifier(emailNotifier);
        smsNotifier.Send("Hello World!");

        Console.WriteLine($"## Use case: Email+SMS+Facebook");
        var facebookNotifier = new FacebookNotifier(smsNotifier);
        facebookNotifier.Send("Hello World!");

        Console.WriteLine($"## Use case: Email+Facebook");
        var facebookNotifier2 = new FacebookNotifier(emailNotifier);
        facebookNotifier2.Send("Hello World!");
    }
}
```

### Quel est le résultat ?

```plaintext
## Use case: just Email
Sending Email: Hello World!
## Use case: Email+SMS
Sending Email: Hello World!
And sending SMS: Hello World!
## Use case: Email+SMS+Facebook
Sending Email: Hello World!
And sending SMS: Hello World!
And posting on Facebook: Hello World!
## Use case: Email+Facebook
Sending Email: Hello World!
And posting on Facebook: Hello World!
```

### Explication étape par étape

Le premier test est simple. Il n’y a rien de particulier à expliquer.

Les deuxième, troisième et quatrième tests montrent le modèle de conception _Decorator_ en action.

Si vous regardez le troisième test, `facebookNotifier` enveloppe `smsNotifier`, qui lui-même enveloppe `emailNotifier`.

`emailNotifier` est la base et quand vous appelez `facebookNotifier.Send(« Hello World ! »)`, voici ce qui se passe :

- `FacebookNotifier.Send` est appelé et la première chose qui se passe dans la méthode est un appel à `base.Send(message)` (qui est `smsNotifier.Send`).

- Ensuite, `SMSNotifier.Send` est appelé. Encore une fois, la première chose qui se passe dans la méthode est un appel à `base.Send(message)` (qui est `emailNotifier.Send`).

- Donc `EmailNotifier.Send` est appelé et affiche « Sending Email : Hello World ! » dans la console de sortie.

- Ensuite, le contrôle retourne à `SMSNotifier.Send`, qui affiche « And sending SMS : Hello World ! » dans la console de sortie.
- Enfin, le contrôle retourne à `FacebookNotifier.Send`, qui affiche « And posting on Facebook : Hello World ! » dans la console de sortie.

Chaque décorateur ajoute son propre comportement après avoir appelé la méthode de l’objet enveloppé.

```plaintext
FacebookNotifier.Send
    -> SMSNotifier.Send
        -> EmailNotifier.Send
            (prints "Sending Email: Hello World!")
        (prints "And sending SMS: Hello World!")
    (prints "And posting on Facebook: Hello World!")

```

## Cas d’utilisation courants

Lorsque vous voulez réaliser l’un des cas d’utilisation ci-dessous, alors le modèle de conception _Decorator_ s’avère approprié :

1. **Étendre la fonctionnalité** lorsque vous souhaitez ajouter des responsabilités à des objets individuels, et non à une classe entière.
2. **Combiner des comportements** lorsque vous devez ajouter une combinaison de comportements au moment de l’exécution. Par exemple, combiner plusieurs comportements de journalisation, d’authentification ou de notification.
3. **Adhérer au principe de responsabilité unique** en utilisant des décorateurs, vous pouvez diviser la fonctionnalité d’une classe en classes distinctes ayant des responsabilités spécifiques.
4. **Construire une interface utilisateur** pour envelopper les éléments de l’interface utilisateur pour ajouter des responsabilités telles que des bordures, des barres de défilement ou des décorations.

## Ressources pour approfondir le sujet

Les ressources ci-dessous permettent d’approfondir le sujet et ses applications dans la conception de logiciels.

- **Design Patterns : Elements of Reusable Object-Oriented Software** par Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides (_Gang of Four_)
- **Head First Design Patterns** par Eric Freeman, Elisabeth Robson
- [Microsoft Documentation on the Decorator Pattern](https://learn.microsoft.com/en-us/archive/msdn-magazine/2008/october/design-patterns-the-decorator-pattern)

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Nataliya Vaitkevich](https://www.pexels.com/photo/blue-and-white-paint-brush-5642113/)
