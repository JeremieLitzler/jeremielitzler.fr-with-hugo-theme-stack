---
title: "Les modèles de conception et les architectures logicielles que j'ai utilisés"
description: "Bien qu'il s'agisse d'un vaste sujet que les auteurs ont décrit dans de nombreux livres et articles, j'aimerais passer en revue les modèles de conception et les architectures que j'ai rencontrés au cours de ma carrière jusqu'à présent.."
image: 2025-08-04-architecte-building-with-triangle-shapes.jpg
imageAlt: Bâtiment d'architecte avec des formes triangulaires
date: 2025-09-03
categories:
  - Développement logiciel
tags:
  - Modèles de conception
---

Avant de commencer, définissons les architectures logicielles et les modèles de conception.

Les architectures logicielles représentent la structure de haut niveau, les composants et leurs relations qui guident la conception des systèmes logiciels.

Les modèles de conception représentent des solutions réutilisables à des problèmes courants rencontrés lors de la conception et du développement de systèmes logiciels à grande échelle pour les entreprises. Les modèles aident les architectes et les développeurs à créer des applications robustes, évolutives et faciles à maintenir.

Passons en revue ce que j’ai rencontré jusqu’à présent.

## Les architectures

Voici un aperçu concis de certaines architectures clés que j’ai utilisées, dont je n’ai souvent connu le nom que bien plus tard.

### Architecture en couches

Il s’agit de l’architecture la plus courante. Elle divise l’application en couches distinctes (par exemple, présentation, logique métier, accès aux données) afin d’améliorer la modularité et la séparation des responsabilités.

Cependant, les applications en couches ne signifient pas que les couches sont découplées. Vous pouvez avoir une couche de données couplée à la couche métier et la couche Web ou présentation couplée à la couche métier. Ce n’est toutefois pas ce que nous devrions rechercher.

Un couplage fort rend les tests difficiles, en particulier sur de nombreuses solutions vieillissantes sur lesquelles j’ai travaillé.

### Modèle-Vue-Contrôleur (MVC)

Vous connaissez certainement celle-ci. Il s’agit d’une architecture très populaire qui sépare une application en trois couches interconnectées pour une meilleure organisation et réutilisabilité du code.

La couche Modèle représente vos définitions d’entités. Par exemple, si votre application modélise une voiture, les modèles seraient une voiture, un moteur, une roue, une suspension, etc.

La couche Vue est la représentation de la voiture, son apparence.

Enfin, la couche Contrôleur relie le Modèle à la Vue avec la logique métier pour faire fonctionner votre voiture et la rendre « conduisible ».

### Microservices

Ces dernières années, ce modèle a fait l’objet d’un engouement considérable. Il décompose un système en services plus atomiques, indépendants les uns des autres et qui peuvent être développés, déployés et mis à l’échelle séparément.

Je dirais que cela s’apparente à une architecture événementielle, car les microservices communiquent entre eux via un bus de messages.

Il est toutefois important de décomposer votre système en un nombre approprié de microservices, afin qu’il reste facile à utiliser et à faire évoluer. En d’autres termes, le défi consiste à trouver le meilleur compromis entre un système monolithique et un nombre trop important de microservices.

### Architecture propre

J’ai découvert cette architecture en avril dernier, alors que je préparais mes entretiens pour un nouvel emploi.

J’ai suivi un petit cours sur le sujet qui encourage l’utilisation du [modèle d’Ardalis](https://github.com/ardalis/CleanArchitecture), qui m’a tout de suite plu.

En résumé, l’architecture propre est une architecture en couches superposées où toutes les couches sont découplées les unes des autres, ce qui facilite le test de chaque couche.

Les couches se présentent comme suit :

- au centre, la couche _Domain_ où se trouvent vos entités.
- la couche extérieure suivante contient les _Use Cases_, qui correspondent à la logique métier.
- la couche extérieure suivante contient l’_Infrastructure_ permettant d’accéder à la couche de données avec, par exemple, EF Core ou toute autre API externe telle que la messagerie électronique, la journalisation, etc.
- la couche supérieure contient la partie _Web_, qui, dans le cas d’une API, serait l’API Web, ses contrôleurs, ses middlewares, etc.

Elle utilise largement le modèle de conception [Mediator](#mediator) et, bien qu’elle soit conçue pour être à l’épreuve du temps, elle nécessite de comprendre les abstractions en place pour comprendre la communication entre les couches.

C’est l’architecture que je suis très susceptible d’utiliser à l’avenir.

Veuillez [consulter toutes les décisions prises par Ardalis](https://github.com/ardalis/CleanArchitecture/tree/main/docs/architecture-decisions) pour créer le modèle ci-dessus comme il l’a fait.

## Les modèles de conception

### Repository

Il abstrait la couche d’accès aux données, offrant une vue orientée objet de la couche de persistance des données.

Grâce aux classes DTO, vous créez une couche de communication entre les couches métier et données.

L’objectif est que la couche métier ne connaisse pas les détails de la couche de données et soit donc faiblement couplée à celle-ci.

Cela facilite le test de la logique métier sans avoir à se préoccuper du _mocking_ de la couche de persistance des données.

Par exemple, Entity Framework en .NET utilise ce modèle de conception au cœur de son fonctionnement.

### Command Query Responsibility Segregation (CQRS)

Celui-ci a attiré mon attention ces deux dernières années et j’ai finalement commencé à l’utiliser dans le cadre d’une mission depuis juillet 2025.

Il a gagné en popularité au cours des cinq dernières années, bien que le modèle ait été défini il y a longtemps, Bertrand Meyer ayant inventé le concept en 1985. Martin Flowler détaille cela [dans son article](https://martinfowler.com/bliki/CommandQuerySeparation.html) sur le sujet.

Il sépare les opérations de lecture et d’écriture pour une meilleure séparation des responsabilités, une meilleure performance et évolutivité.

Certains utilisent une seule base de données relationnelle, tandis que d’autres utilisent une base de données No-SQL pour les opérations de lecture et une base de données relationnelle pour les opérations d’écriture.

Cependant, cette ségrégation avec deux types de base de données implique de mettre en place une synchronisation entre la base de données en écriture et la base de données de lecture, ce qui peut ajouter une complexité significative à votre système.

Pour moi, la séparation des responsabilités est la fonctionnalité qui apporte le plus de valeur. En effet, vous pouvez définir des requêtes ou des commandes très ciblées à un besoin métier, évitant aussi les « classes-dieu ».

### Singleton

Il s’agit d’un modèle de création permettant de conserver une seule instance pendant toute la durée de vie de l’application.

Nous l’utilisons souvent pour les fonctionnalités de journalisation et de mise en cache qui doivent exister tant que l’application est en cours d’exécution.

### Prototype

Il s’agit également d’un modèle de création, mais qui consiste à cloner des objets plutôt qu’à les créer à partir de constructeurs.

### Factory Method

[J’ai écrit à propos de ce modèle](../../2025-07/patrons-simple-factory-vs-factory-method/index.md). Encore une fois, nous avons affaire à un modèle de création qui nous permet de créer des objets grâce à l’héritage, mais plus souvent à travers une interface.

### Strategy

Vous souhaitez éviter le chaos des boucles « if…else » grâce à une interface commune implémentée par des classes suivant le principe de responsabilité unique ? Vous avez trouvé la solution !

Par exemple, je devais créer un gestionnaire d’exceptions global en .NET 4.8. À l’aide d’un registre réflexif (une exception = un générateur de détails sur le problème d’exception), j’ai pu coder un gestionnaire d’exceptions pour intercepter toutes les exceptions et les traiter de manière personnalisée en fonction de l’exception, en mettant en œuvre le [Problem Details RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).

J’écrirai un article sur le sujet pour expliquer en détail la mise en œuvre concrète.

### Chaîne de responsabilité

Je l’ai utilisé avec les middlewares dans .NET Core ou .NET Framework avec le package OWIN.

En gros, le concept est que la chaîne de middlewares est comme une poupée russe où le middleware supérieur transmet la requête au middleware suivant dans le pipeline d’exécution.

En bref, chaque middleware dans le pipeline a la possibilité de traiter la requête ou de la transmettre au suivant.

### Adapter

Je l’ai utilisé pour faire fonctionner ensemble deux interfaces incompatibles.

Par exemple, le transfert de données depuis une bibliothèque C ou C++ par l’intermédiaire d’un wrapper C# pour pouvoir consommer les méthodes mises à disposition par la libraire.

### Mediator

Dans le modèle CQRS, le médiateur traite la demande de récupération du résultat basé sur une requête ou une commande en transmettant l’événement au gestionnaire cible.

Ce dernier exécute la logique métier, puis retourne un résultat.

En .NET, cela ressemble à cela :

```csharp
// J'omets les using volontairement, car ils ne sont pas important dans cet extrait de code.

public MyAwesomeQuery : IRequest<MyAwesomeResult> {
  // vous définissez vos données d'entrée ici et le constructeur
  // que le contrôleur appelle
}

public MyAwesomeResult {
  // vous définissez vos données de sortie
}

public MyAwesomeQueryHandler : IRequestHandler<MyAwesomeQuery, MyAwesomeResult> {
  public Task<MyAwesomeResult> Handle(MyAwesomeQuery request, CancellationToken cancellationToken) {
    // la logique métier vient ici

    return Task.FromResult(new MyAwesomeResult());
  }
}
```

### Builder

Ce modèle permet de séparer la construction d’un objet complexe de sa représentation.

Je l’ai utilisé chez Conduent pour créer un produit de billetterie dont les sources de données étaient soit des API, soit des bibliothèques, soit des fichiers binaires.

À l’aide de méthodes `BuildPart` ayant chacune une signature distincte, nous avons rempli l’objet étape par étape.

Chaque `buildPart` renvoie l’instance de l’objet en cours de remplissage afin de permettre le chaînage des méthodes et d’éviter, une fois de plus, les arbres `if…else`.

### En savoir plus sur les modèles de conception

Je recommande la lecture de [cette série d’articles de Maxim Gorin](https://maxim-gorin.medium.com/list/design-patterns-b183b417384c). Maxim a fait un travail remarquable en décrivant chaque modèle à l’aide d’un exemple non technique et d’un exemple technique, et en présentant les avantages et les inconvénients de l’utilisation ou non d’un modèle.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Mathias Reding](https://www.pexels.com/photo/golden-tiles-on-modern-building-12884312/).
