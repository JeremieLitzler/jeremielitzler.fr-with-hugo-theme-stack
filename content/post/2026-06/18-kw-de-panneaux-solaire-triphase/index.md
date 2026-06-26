---
title: 18 kW de Panneaux Solaire TRIPHASÉ, par les Disjonctés
description: "Cet article résume le vlog de la chaîne “Les Disjonctés” sur la sécurisation d’une installation électrique avec du photovoltaïque."
image: 2026-06-19-centre-d-energie-assemble-par-remy.png
imageAlt: Centre d'énergie assemblé par Rémy
date: 2026-06-19
categories:
  - Tutoriels
tags:
  - Electricité
  - Chaîne Les Disjonctés
seoNoIndex: true
---

Je tiens à remercier Rémy, auteur de la chaîne « les Disjonctés » pour son partage sur le sujet !

Dans sa vidéo, il se rend chez « Le Sequoia » (île de Ré) pour raccorder 36 panneaux solaires sur une installation électrique triphasée.

Le défi : assembler un centre d’énergie triphasé Schneider qui n’existe pas encore en référence commerciale, avec un câble 5G25 aluminium de près de 100 mètres, des fouets bimétal, un parafoudre, et une bascule complète de l’alimentation — le tout en limitant la coupure de courant au minimum.

Il avait réalisé une vidéo similaire pour expliquer pourquoi le gestionnaire d’énergie est indispensable sur toute installation électrique. Il est le seul que j’ai vu en parler !

C’est parti !

## Introduction et contexte du projet

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=0)

Le projet se déroule chez Le Sequoia, un domaine de 1000 m² sur l’île de Ré qui compte plus de 170 000 abonnés sur Instagram. L’installation comprend 36 panneaux solaires (des modules de 400 Wc) répartis sur 3 phases, soit 12 panneaux par phase. Cela représente environ 20 ampères par phase, pour un total potentiel de 60 ampères de production solaire. L’objectif est de raccorder cette production au tableau électrique triphasé existant de manière sécurisée, en évitant tout risque de surintensité et d’incendie.

## Visite de l’installation photovoltaïque existante

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=123)

Avec Stéphane (le propriétaire), Rémy fait le tour de la propriété pour comprendre le câblage en place.

Il découvre le **tableau AC** (courant alternatif) où arrivent toutes les sorties des micro-onduleurs.

Un câble **5G25 mm² en aluminium** a été passé sur la distance entre le tableau AC et le tableau principal — le choix de l’aluminium étant justifié par la longueur du passage (près de 100 mètres de gaine).

Ce câble n’est pas encore connecté de part et d’autre : c’est le travail à réaliser.

## Montage du coffret centre d’énergie (Schneider Prisma)

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=196)

Le centre d’énergie triphasé n’existant pas encore comme produit fini chez Schneider, il faut l’assembler soi-même. Le coffret choisi est un **Prisma de chez Schneider**, idéal pour le petit tertiaire et les installations triphasées grâce à son espace généreux.

La hauteur de fixation est contrainte par le câble 5G25 alu (trop rigide pour le tirer davantage) tout en respectant la norme : la rangée la plus basse ne doit pas descendre en dessous de 90 cm du sol. La fixation se fait avec des **chevilles Duo Power de Fischer** en diamètre 10.

## Le rôle du centre d’énergie : le brassage électrique

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=313)

Le centre d’énergie a un rôle central : **brasser les flux électriques**.

Concrètement, il réorganise les sens de circulation du courant entre trois sources/destinations : le disjoncteur abonné (réseau Enedis), la production solaire, et le tableau de la maison.

Au lieu que le disjoncteur abonné alimente directement l’installation, tout passe désormais par le centre d’énergie qui distribue intelligemment le courant.

L’explication est tellement simple que Rémy l’illustre à son fils de 5 ans : « Le soleil passe là, redescend là, et arrive dans les prises. »

## Protection contre la surintensité : pourquoi le disjoncteur C63 est indispensable

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=403)

C’est le cœur du sujet de sécurité. Le disjoncteur abonné est calibré à 60 ampères par phase.

Si la maison tire 60 A du réseau et que les panneaux solaires ajoutent 20 A, ce sont **80 ampères** qui circulent dans l’installation.

Sans centre d’énergie, vous n’avez aucune détection de cette surintensité : l’interrupteur différentiel 63 A en tête de tableau ne sautera pas (ce n’est pas un disjoncteur, il ne coupe pas en cas de surintensité). Le **disjoncteur C63** placé dans le centre d’énergie joue ce rôle : il bride l’installation à 63 A maximum, peu importe que le courant vienne du réseau, du solaire, ou des deux combinés.

C’est comme un airbag : on espère qu’il ne se déclenchera jamais, mais on est content qu’il soit là.

## Dénudage et préparation du câble 5G25 aluminium

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=590)

Le dénudage d’un câble 5G25 alu se fait au cutter, faute de couteau spécial (ce type de câble ne se dénude pas tous les jours). Il faut percer trois couches — isolant du câble, isolant du fil, et gaine — avant d’atteindre le conducteur.

La pince à dénuder classique s’arrête au 16 mm², donc la pince Knipex prend le relais.

Un point important : les câbles aluminium ont des **rayons de courbure** différents (et plus contraignants) que le cuivre, ce qui influence le positionnement des éléments dans le tableau.

Un câble trop courbe peut générer des arcs électriques à l’intérieur du câble, cachés dans la gaine, et donc cela échauffera le câble.

## Préparation des câbles 16 mm² et repérage des phases

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=696)

Faute de câble 5G16 souple en stock, Rémy utilise des chutes de 2×16 mm² et identifie les phases avec du scotch : phase 1 = tout blanc, phase 2 = un scotch, phase 3 = deux scotches.

Le même code est reproduit à chaque extrémité.

Il rappelle la règle Consuel : on peut modifier la couleur d’un fil **uniquement s’il provient d’un câble** (pas d’une couronne de fil). Cependant, une exception s’applique : **la terre** ne doit jamais être repeinte.

## Serrage dynamométrique et fouets de raccordement bimétal

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=774)

Le serrage se fait au **tournevis dynamométrique réglé à 3,5 Nm** (pour les bornes de 14 mm). Cela présente un avantage : après avoir serré plusieurs fois, votre poignet se fatigue et vous serrez moins fort, sans vous en rendre compte. Le tournevis dynamométrique garantit qu’on sert toujours comme il se doit.

Le « clac » caractéristique du dynamomètre assure un serrage optimal à chaque fois, car un serrage insuffisant est la principale cause de départ d’incendie électrique.

Les **fouets** sont des morceaux de fil souple 16 mm² en cuivre, serrés via des connecteurs bimétal sur le câble alu. Ils remplissent deux fonctions : rendre le raccordement plus pratique (on ne peut pas courber du 25 mm² rigide dans une cage de disjoncteur) et surtout **éviter le contact direct aluminium-cuivre**.

Schneider l’indique clairement : les bornes de leurs disjoncteurs contiennent du cuivre, et le contact alu-cuivre provoque une oxydation accélérée, entraînant échauffement, arc électrique et risque d’incendie. L’écrou des fouets casse à un couple défini, ce qui confirme que le serrage est bon.

## Câblage vers la maison et règles de couleur Consuel

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=1068)

Deux câbles 2×16 mm² sont passés entre le centre d’énergie et le tableau existant pour raccorder le disjoncteur C63 au tableau général.

Rémy souligne la nuance qu’il a apprise auprès de Consuel : il est autorisé de teindre ou d’enduire d’adhésif un fil provenant d’un câble, mais jamais la terre. Il suggère également de couvrir complètement le fil de peinture (plutôt que d’appliquer une bande d’adhésif) pour faciliter son traçage dans le tableau.

## Installation du parafoudre et raccordement des terres

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=1316)

Bien que non obligatoire dans cette région, un **parafoudre** est installé.

La terre principale remonte de la barrette de coupure directement dans le parafoudre, puis repart vers le bornier de terre. La liaison entre le bornier du nouveau tableau et celui de l’ancien se fait en 16 mm² (section équivalente à ce qui sort de la barrette de coupure).

Le bornier fourni n’avait pas assez de bornes pour les grosses sections : un bornier supplémentaire a été ajouté. Le principe : en cas de coup de foudre, le courant doit emprunter le chemin le plus court vers le parafoudre avant de traverser l’installation.

Un problème inattendu : le **neutre se situe à droite** sur le parafoudre (normes allemandes), alors que le peigne est prévu pour qu’il soit à gauche. Il faut recouper le peigne et adapter. Rémy a pris contact avec Schneider et leur a demandé de déplacer le neutre sur le côté gauche.

## Préparation de la bascule et rayon de courbure

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=1742)

La « bascule » est le moment où le courant est coupé sur tout le domaine afin de réorganiser le câblage (disjoncteur abonné > centre d’énergie > tableau). Tout est préparé pour minimiser la durée de coupure.

Rémy en profite pour expliquer le **concept de rayon de courbure**. En pliant un câble trop serré, l’isolant se fissure à l’intérieur de la courbe, ce qui crée un risque d’arc électrique entre les conducteurs. Même en le redressant, il ne retrouvera jamais sa forme initiale.

Le fil souple a l’avantage de se plier davantage. Contrairement à une idée reçue, **il est autorisé** dans une installation fixe : il faut simplement mettre des cosses (embouts de sertissage) à chaque extrémité.

## Jour 2 : Raccordement côté tableau AC

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=2171)

Le deuxième jour est consacré au raccordement du câble 5G25 alu dans le **tableau AC** (côté panneaux solaires).

L’architecture est expliquée : chaque groupe de 3 à 5 panneaux est branché sur un micro-onduleur, et chaque micro-onduleur sort en courant alternatif dans ce tableau. Les protections (différentiels, disjoncteurs) remontent ensuite sur le câble 5G25 alu.

Un tube de protection IRL est posé sur le câble dans la zone de passage (terrain de pétanque). Les fouets bimétal sont à nouveau utilisés côté alu, avec un peu moins de confort que dans le coffret Prisma (moins de place).

## La bascule : coupure et routage de l’installation

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=2382)

Voici l’étape cruciale : avant de procéder au découpage, une** vérification de continuit**é estnécessaire pour confirmer l’enchaînement des phases (de gauche à droite : phase 1, phase 2, phase 3). Rémy insiste sur l’importance de tout vérifier dans une installation équipée de plusieurs tableaux, d’autant plus que Le Sequoia a déjà rencontré des problèmes de sens de phase et qu’un deuxième compteur Linky a été découvert pendant l’intervention.

Les anciens câbles en aval du disjoncteur abonné sont retirés (laborieux dans la vieille platine en bois percée trou par trou) et remplacés par les 16 mm² souples qui repartent vers le centre d’énergie. Une Fein (multi-tool) est requise pour élargir les passages. Chaque phase est soigneusement connectée et vérifiée en continuité avant que le disjoncteur C63 soit activé.

## Mise en route et vérifications des panneaux solaires

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=2700)

Avant de remonter les protections, des vérifications manuelles sont effectuées :

- 230 V entre phase et neutre,
- tensions inter-phases correctes,
- test de différentiel.

Un à un, les disjoncteurs du tableau AC sont remontés, tout comme les micro-onduleurs, qui passent au vert un à un — signe que les panneaux produisent.

Le système est équilibré sur les trois phases : 6 panneaux par disjoncteur, soit 20 ampères par phase.

## Récapitulatif du fonctionnement du centre d’énergie triphasé

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=2992)

Rémy refait le schéma complet :

- **Du disjoncteur abonné**, on arrive sur l’**interrupteur général** du centre d’énergie (calibré supérieur au disjoncteur abonné, ici 4×63 A, pour ne pas fondre)
- L’interrupteur remonte dans le **peigne triphasé** (100 A par phase)
- Du peigne, le courant est distribué vers : un **départ réserve (pour un besoin futur)**, le **disjoncteur C63** (qui alimente la maison et bride l’intensité totale), et l’**arrivée/départ solaire** via un autre interrupteur
- Le **parafoudre** est alimenté en amont, directement depuis le disjoncteur abonné
- Le câble 5G25 alu fonctionne en **bidirectionnel** : il envoie du courant aux micro-onduleurs (qui en ont besoin pour fonctionner) et reçoit la production solaire en retour

L’avantage supplémentaire : les équipements futurs (borne de recharge véhicule, pompe à chaleur) peuvent être alimentés directement par le solaire via le centre d’énergie, sans allers-retours inutiles dans les peignes.

Enfin, la sécurité des micro-onduleurs garantit aussi qu’en cas de coupure réseau, les panneaux cessent d’injecter — protégeant ainsi les agents Enedis qui interviendraient sur la ligne.

## Conclusion et résultats

[Consulter le chapitre dans la vidéo](https://youtu.be/3XJwP2_1lmQ?t=3308)

L’installation est terminée. Au moment de la mise en route, les panneaux produisaient **13 kW** (13 000 VA), soit une consommation Enedis de zéro sur le compteur Linky. La production relevée sur l’application de Stéphane correspondait exactement à l’index d’injection du compteur Linky. Le domaine était en « tout gratuit » jusqu’au soir.

Ce montage démontre qu’un **centre d’énergie assemblé soi-même** est tout à fait réalisable avec des composants Schneider standard (interrupteurs 4×63, coffret Prisma, peignes 100 A), même si la référence commerciale n’existe pas encore. Schneider a d’ailleurs participé au projet et fourni le matériel.

Je sais que pour mon installation à venir, le centre d’énergie sera présent !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : l'image de l'article est une capture de la vidéo de Rémy. Merci à lui.
