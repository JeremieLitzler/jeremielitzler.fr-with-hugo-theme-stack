---
title: "La composition en C#"
description: "La composition d’objets est un principe de conception selon lequel une classe est composée d’un ou plusieurs objets d’autres classes."
image: 2025-10-27-a-building-with-orange-and-blue-parts.jpg
imageAlt: Un bâtiment avec des parties orange et bleues
date: 2025-10-31
categories:
  - Développement logiciel
tags:
  - Modèles de Conception
  - Csharp
---

Il permet la modularité dans la conception d’une classe et la rend réutilisable, favorisant la relation « a » plutôt que la relation « est » qu’implique l’héritage.

Voici un exemple simple de composition d’objets en C# :

```csharp
using System;

namespace ObjectCompositionExample
{
    // Engine class
    public class Engine
    {
        public void Start()
        {
            Console.WriteLine("Le moteur a démarré.");
        }

        public void Stop()
        {
            Console.WriteLine("Le moteur s'est arrêté.");
        }
    }

    // Radio class
    public class Radio
    {
        public void TurnOn()
        {
            Console.WriteLine("La radio est allumée.");
        }

        public void TurnOff()
        {
            Console.WriteLine("La radio est éteinte.");
        }
    }

    // La voiture composée d'un moteur et d'une radio
    public class Car
    {
        private Engine _engine;
        private Radio _radio;

        public Car()
        {
            // Le moteur et la radio commencent à exister uniquement
            // lorsque la voiture est créée.
            _engine = new Engine();
            _radio = new Radio();
        }

        public void Start()
        {
            _engine.Start();
            _radio.TurnOn();
            Console.WriteLine("La voiture a démarré.");
        }

        public void Stop()
        {
            _radio.TurnOff();
            _engine.Stop();
            Console.WriteLine("La voiture s'est arrêtée.");
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Car myCar = new Car();
            myCar.Start();
            myCar.Stop();
        }
    }
}

```

La classe `Engine` représente le moteur d’une voiture. Elle dispose de méthodes pour démarrer et arrêter le moteur.
La classe `Radio` représente la radio d’une voiture. Elle dispose aussi de méthodes pour allumer et éteindre la radio.
La classe `Car` représente une voiture et utilise la composition pour inclure un `Engine` et une `Radio`. Elle dispose de méthodes pour démarrer et arrêter la voiture, qui démarrent/arrêtent le moteur et allument/éteignent la radio en interne.

Dans cet exemple, la classe `Car` est composée d’objets `Engine` et `Radio`, ce qui montre comment la composition d’objets permet à une classe d’utiliser les fonctionnalités d’autres classes pour remplir ses fonctions. Cette approche offre une grande flexibilité et favorise la réutilisation du code.

## Alternative avec un couplage faible entre `Car`, `Engine` et `Radio`

L’exemple précédent est correct, mais les bonnes pratiques de programmation recommandent un couplage faible entre les classes `Car`, `Engine` et `Radio`.

Pour obtenir un couplage faible, nous pouvons utiliser des interfaces pour définir le comportement attendu des classes `Engine` et `Radio`.

De cette façon, la classe `Car` ne dépend pas des implémentations concrètes des classes `Engine` et `Radio`, mais plutôt de leurs interfaces. Cela favorise un couplage lâche et rend le système plus flexible et plus facile à étendre, à modifier ou à tester.

Voici un exemple utilisant des interfaces pour un couplage lâche :

```csharp
using System;

namespace LooseCouplingExample
{
    // Engine interface
    public interface IEngine
    {
        void Start();
        void Stop();
    }

    // Radio interface
    public interface IRadio
    {
        void TurnOn();
        void TurnOff();
    }

    // Implementation concrète de IEngine
    public class Engine : IEngine
    {
        public void Start()
        {
            Console.WriteLine("Le moteur a démarré.");
        }

        public void Stop()
        {
            Console.WriteLine("Le moteur s'est arrêté.");
        }
    }

    // Implementation concrète de IRadio
    public class Radio : IRadio
    {
        public void TurnOn()
        {
            Console.WriteLine("La radio est éteinte.");
        }

        public void TurnOff()
        {
            Console.WriteLine("La radio est allumée.");
        }
    }

    // Car utilise IEngine et IRadio
    public class Car
    {
        private readonly IEngine _engine;
        private readonly IRadio _radio;

        // On appelle également cela l'injection de dépendance.
        public Car(IEngine engine, IRadio radio)
        {
            _engine = engine;
            _radio = radio;
        }

        public void Start()
        {
            _engine.Start();
            _radio.TurnOn();
            Console.WriteLine("La voiture a démarré.");
        }

        public void Stop()
        {
            _radio.TurnOff();
            _engine.Stop();
            Console.WriteLine("La voiture s'est arrêtée.");
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            IEngine engine = new Engine();
            IRadio radio = new Radio();

            Car myCar = new Car(engine, radio);
            myCar.Start();
            myCar.Stop();
        }
    }
}

```

**Les interfaces `IEngine` et `IRadio`** définissent le comportement que les classes `Engine` et `Radio` doivent implémenter. Cela garantit que la classe `Car` interagit avec ces interfaces, et non avec les implémentations concrètes.

**Les implémentations concrètes de `Engine` et `Radio`** implémentent les interfaces `IEngine` et `IRadio`. Elles fournissent le comportement réel pour démarrer/arrêter le moteur et allumer/éteindre la radio.

La **classe `Car`** utilise les interfaces `IEngine` et `IRadio` au lieu des classes concrètes `Engine` et `Radio`, découplant ainsi la classe `Car` des implémentations spécifiques et permettant l’utilisation de n’importe quelle implémentation de `IEngine` et `IRadio`.

Dans la **classe `Program`**, nous créons désormais des instances de `Engine` et `Radio`, les transmettons au constructeur `Car` et démarrons/arrêtons la voiture.

Le résultat reste le même, mais le code est devenu beaucoup plus évolutif. Par exemple, vous pouvez créer des implémentations fictives à des fins de test ou remplacer différents types de moteurs ou de radios selon vos besoins.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Nothing Ahead](https://www.pexels.com/photo/modern-architectural-abstract-with-shadows-34434121/).
