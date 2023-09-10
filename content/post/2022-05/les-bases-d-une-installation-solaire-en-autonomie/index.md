---
title: "Les bases d'une installation solaire en autonomie"
description: "Réaliser son installation solaire n'est pas compliquée, mais cela requiert de la préparation et une bonne définition de son besoin."
date: 2022-05-26
categories:
  - Energie
tags:
  - L Archipelle
  - Photovoltaique
  - Autoconsommation
  - Résilience
---

Merci à Brian et Rémi pour leur échange ! Ce qui suit sont mes notes de la vidéo publiée sur la chaîne de l'Archipelle. Vous pouvez retrouver [la vidéo sur YouTube](https://www.youtube.com/watch?v=WOuTv0kfwRg).

<!-- more -->

## Pourquoi une installation solaire en autonomie

Il faut se poser la question "Pourquoi". Il y a 2 choix :

- pour un site isolé
- pour un site hybride, c.-à-d. toujours connecté au réseau, mais pouvant passer en autonomie temporairement.

En particulier, les microcoupures sont gérables en système hybride si l'on souhaite rester connecté au réseau.

Le cas du raccordement pour vendre la production PV est hors sujet.

## Connaitre sa consommation

Concrètement, il faut :

- lister les éléments qui consomment de l'électricité dans le logement (kWh)
- déterminer leur puissance individuelle

Il faut savoir que pour une grosse disqueuse ou un poste à souder peut rendre compliquer le dimensionnement de l'onduleur qui devra délivrer au moins la puissance de l'élément le plus puissant dans le logement (on ne parle même pas de l'usage simultané de plusieurs appareils...)

Il faut alors trouver une autre solution pour alimenter les gros appareils, par exemple :

- se brancher chez un voisin : en utilisant [un wattmètre](https://www.google.com/search?q=wattmetre), on peut s'arranger avec le voisin pour lui payer ce qu'on utilise
- louer un groupe électrogène à la bonne puissance : cela nous rend dépendants de l'essence sauf si le groupe est partagé

### Comment mesurer la consommation d'un appareil

Il faut [un wattmètre](https://www.google.com/search?q=wattmetre). Cela donne plusieurs métriques : Wh, VA et la tension.

Par exemple, pour griller 10 tranches de pain, il faut 128 Wh sur quelques minutes.

Voir mon tableau sur le sujet [dans Google Sheet](https://docs.google.com/spreadsheets/d/1-1A2I04MqVy3-zxMwQJ7Zy83OP200ruxGRUNXsHlNbQ/edit?usp=sharing) listant les appareils les plus utilisés chez moi.

## Calculer la consommation en mode dégradé

Une fois que l’on connait sa consommation globale, il faut déterminer ce qu'on peut consommer quand la production solaire est moyenne ou mauvaise. Autrement dit, il faut se poser les questions suivantes :

- Qu’autorisons-nous d'utiliser dans la méthode ?
- Devons-nous faire des concessions sur certains usages ?
- Comment pouvons-nous remplacer un usage électrique en hiver ?
- Comment pouvons-nous optimiser notre usage de la production PV en été ?

Ainsi, avoir des appareils électriques peut-être instéressant, selon la période de l'année. Par exemple,

- Utiliser une plaque électrique l'été à la place d'une cuisinière à bois est plus logique, car on ne veut pas chauffer la maison en été ! Et la plaque de cuisson électrique peut être programmée. C'est la cuisine d'été.
- Pour faire griller le pain, si on est résilient, on utilisera le grille-pain l'été et la cuisinière à bois l'hiver.
- Pour le four, le poêle de masse l'hiver vs le four solaire l'été.
- Pour sécher les légumes, herbes et fruits, on utilisera le déshydrateur en été.
- Pour couper le bois, on utilisera une tronçonneuse électrique pour couper le bois l'été.
- Pour broyer les végétaux, pour tondre l'herbe avec des appareils électriques.

En mode résilience, on doit multiplier le matériel. Le stockage va plus loin que l'usage de batteries.

## Dimensionner les batteries

On prend notre consommation en mode dégradé et on détermine le nombre de jours d'autonomie souhaités.

```maths
[consommation en mode dégradé (kWh)] x [nombre de jours] = [Puissance totale des batteries]
```

À suivre sur une prochaine vidéo de l'Archipel ou [tester la simulation de Wattuneed](https://www.wattuneed.com/fr/content/56-dimensionner-votre-kit-solaire-autonomes-autoconsommation).

### Choisir sa technologie de batterie

On a :

- Gel (plomb)
- OPZS
- Li-ion
- Li-Ni-Fe

On doit penser aussi :

- À la place qu'on a pour stocker les batteries
- De la volonté de faire de l'entretien ou pas
- Qu'aucune technologie de batterie n'aime la chaleur !

#### [Gel (plomb)](https://www.google.com/search?q=batterie+Gel)

Avantanges :

- Facilité d'usage et le zéro entretien

Inconvénients :

- Durée de vie et réutilisation impossible

#### [OPZS](https://www.google.com/search?q=batterie+opzv+12v)

Avantanges :

Inconvénients :

- Émanations toxiques

#### [Li-ion](https://www.google.com/search?q=batterie+lithium)

Avantanges :

- Il faut penser au recyclage des batteries de PC et cie, où si une cellule est HS, l'ensemble de la batterie est HS. En réalité, sur 6 cellules, une seule est peut-être KO.

Inconvénients :

- Le recyclage, c'est toutefois long et fastidieux à démonter et tester. Il faut aussi faire attention aux cours-circuits, car les batteries sont toxiques si elles s'enflamment ou surchauffent.
- Craint les basses températures

#### [Li-Ni-Fe](https://www.google.com/search?q=batterie+lifepo4)

Avantanges :

- Meilleure durée de vie (~26 ans) et coût sur le long terme.
- On peut changer l'électrolyse pour restaurer la capacité originale.
- Il y a moins de risque en cas de court-circuit.
- Émanations non toxiques
- Ne craint pas le Gel

Inconvénients :

- Le prix : environ 30 à 40 % de plus que les batteries Li-ion
- Entretien obligatoire : il faut ajouter de l'eau distillée périodiquement pour que cela reste entre le niveau min. et max.
- ça prend de la place
- C'est très lourd...

## Dimensionner les panneaux photovoltaïques

Plus on met de panneaux, plus les batteries vont durer et donc plus la rentabilité sera au rendez-vous.

On peut surdimensionner les panneaux, mais il faut surtout éviter un mauvais dimensionnement des batteries.

Pour information, les panneaux peuvent durer largement au-delà des 40 ans. Les premières mesures en Savoie, en 1992, montrent 0,3 % de rendement en moins par an.

Le nettoyage est **très important**, plus que la perte de rendement par vieillissement.

## Dimensionner l'onduleur

Il doit permettre de fournir la puissance de l'appareil le plus puissant.

Exemple : le chauffe-eau électrique est l'appareil le plus puissant avec sa résistance de 2000 W. Il faut donc un onduleur de 2000W ou plus.

Il faut aussi penser à limiter son usage simultané de plusieurs appareils. Sinon, ça saute.

## Remarques diverses

### Panneaux photovoltaïques vs Panneaux solaires thermiques

Il y a des avantages et inconvénients aux 2 systèmes :

- il faut 4 fois moins de surface pour chauffer la même quantité d'eau en solaire thermique.
- il y a des contraintes physiques sur le solaire thermique (il faut rester petit).
- la durée de vie du photovoltaïque est bien meilleure et l'entretien réduit.

Personnellement, l’installation PV m’a coûté presque autant que le ballon thermodynamique.

Donc si j’ai la place, je partirai sur la même chose qu’aujourd’hui plutôt que du thermique.

A suivre dans le futur quand je comparerai de plus près les deux systèmes pour l’ECS.

### "On regarde dehors pour faire le choix d'utiliser ceci ou cela"

Il faut consommer quand c'est possible. Il faut choisir quand la production nécessite des choix (mode dégradé).

### Coût d'autonomie

_Note :_ cela coûte 50kE à 60kE de plus pour rendre une maison autonome en rénovation si réalisée par des professionnels.

### Préférence au 12V plutôt que le 230V

Pourquoi ?

Pour éviter de gros onduleurs quand l'éclairage, les PC, etc., on peut utiliser [un Victron Orion](https://www.google.com/search?q=orion+victron) (convertisseur de 48V en 12 V) pour éviter les pertes sur la transformation du courant continu en courant alternatif.

Exemple : un PC peut fonctionner en 12V, moyennant un variateur de tension pour transformer le 12V en ~19 V.

### Photovoltaïque et chauffage électrique

> On oublie.

Dans une maison classique, il faut un terrain de foot de panneaux...
