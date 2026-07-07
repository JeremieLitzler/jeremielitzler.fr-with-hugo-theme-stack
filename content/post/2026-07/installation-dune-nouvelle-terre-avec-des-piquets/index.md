---
title: Installation d’une nouvelle terre avec des piquets, par les Disjonctés
description: "La mise à la terre est essentiel pour notre sécurité."
image: 2026-07-01-un-homme-enterrant-un-cable-de-terre.jpg
imageAlt: Un homme enterrant un câble de terre
date: 2026-07-01
categories:
  - Tutoriels
tags:
  - Electricité
  - Chaîne Les Disjonctés
seoNoIndex: true
---

Rémy démontre, étape par étape et mesures à l’appui, comment fabriquer une prise de terre générale à coups de piquets enfoncés dans le sol, jusqu’à passer sous la barre fatidique des **100 ohms**.

## Introduction : une prise volontairement privée de terre

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=0)

Rémy ouvre sa vidéo sur un cas d’école qu’il a monté lui-même : une prise câblée exprès sans terre, pour reproduire la situation d’un logement où aucune terre n’arrive.

Il rappelle que, normalement, la terre générale remonte jusqu’au tableau principal et se raccorde directement sur le bornier, mais avec une particularité : le tout premier câble venu de la terre n’est pas isolé, c’est un **gros cuivre brut**.

Il replace aussi le rôle d’Enedis, qui amène l’alimentation (souvent un câble aluminium jusqu’au Linky, puis un **2x16** vers le tableau), mais **jamais la prise de terre** : c’est à l’électricien de la créer.

## Comment et où faire sa prise de terre

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=87)

Le principe porte très bien son nom : on enfonce simplement un conducteur dans la terre.

Rémy distingue deux contextes.

Dans le neuf, on déroule une **câblette de terre de 25 mm²** au fond d’une tranchée, raccordée aux ferraillages du maçon avant le coulage de la dalle.

Dans le cas qui l’intéresse ici — une rénovation sans aucune arrivée de terre — pas question de rouvrir les fondations : on plante des piquets. Il précise une limite : en immeuble parisien, sur une rue pavée, planter un piquet peut être impossible, et la norme autorise alors de s’en passer en s’appuyant sur le **différentiel 30 mA**. Mais chez lui, sur l’île de Ré et à La Rochelle, on trouve toujours un carré de terre pour planter le piquet.

## Comment savoir si la prise de terre est présente

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=211)

Pour vérifier sans l’appareil professionnel — coûteux pour un usage ponctuel — Rémy propose la méthode au multimètre. On ouvre la prise, on mesure d’abord la tension entre phase et neutre (**230 V** alternatif), puis on déplace la broche du neutre vers la borne de terre. Si la terre est présente, on doit retrouver **230 V** (à ±5 V près) entre phase et terre. Sur sa prise piégée, l’appareil n’affiche que **9 V** : la preuve qu’il n’y a pas de terre.

{{< blockcontainer jli-notice-warning "Attention">}}

Il met en garde sur la prudence nécessaire pour ce type de mesure sous tension.

{{< /blockcontainer >}}

## Les piquets de terre et la câblette : à quoi ça sert ?

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=309)

Les piquets existent en **1 m, 1,50 m ou 2 m** ; on peut aussi utiliser des piquets cuivre ou des profilés en acier galvanisé d’au moins **60 mm de largeur**. La norme veut un enfoncement à **2 mètres**, mais, avec des piquets plus courts, on peut atteindre déjà des valeurs suffisantes. Aussi, et on a le droit de combiner les méthodes (fond de fouille + piquets).

L’objectif reste le même : interconnecter toutes les prises et lumières par un fil de terre **1,5/2,5 mm²** qui retourne au tableau, puis repart vers la barrette de terre, d’où un **25 mm²** de cuivre file vers les piquets.

Tout ce qu’on demande à une terre, c’est une **conductivité maximale** pour évacuer les courants de fuite — soit, en pratique, **moins de 100 ohms** de résistance.

## Mise en place et branchement du premier piquet

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=395)

Rémy enfonce son premier piquet d’un mètre, sans aller jusqu’au bout, en rappelant qu’on prévoit normalement un **regard** pour accéder à la connexion. Cette connexion se fait dans une cage galvanisée — une sorte de gros domino.

Le matériau ne doit pas rouiller : la rouille fait perdre la conductivité et **dégrade la valeur de terre dans le temps** — au point qu’on finit par prendre des coups de jus sur les carcasses métalliques.

Il coupe la câblette à la bonne longueur en gardant **un bon mètre de marge** (utile pour un éventuel deuxième piquet) et serre la cage le plus fort possible pour maximiser le contact cuivre/piquet/terre.

Le sol étant ici plutôt mou, la massette suffit, mais il existe des embouts SDS+/SDS Max pour perceuse.

## Branchement sur la barrette de coupure

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=606)

La barrette de coupure — un morceau de cuivre sur support plastique ou porcelaine sert à isoler la terre du reste de l’installation. Rémy explique son utilité pour le Consuel : en ouvrant la barrette, le contrôleur coupe tout lien entre la vraie terre et les prises, puis vérifie que chaque prise « bipe » bien avec le bornier ; une prise qui ne bipe pas trahit une **deuxième terre oubliée**.

La règle d’or rappelée ici : **on ne fait pas d’interconnexion**, c’est-à-dire qu’on ne coupe pas la câblette pour repartir vers un autre piquet — un seul fil traverse la borne d’un seul tenant.

On remonte ensuite vers le bornier du tableau avec un fil isolé de **16 mm²**. Rémy précise qu’il préfère toujours remonter en câble isolé plutôt que de laisser du cuivre nu, même si la norme l’autorise.

{{< blockcontainer jli-notice-warning "Attention">}}

Pour la démonstration, il raccorde malgré tout un fil de **2,5 mm²** directement sur la barrette — un raccourci à ne surtout pas reproduire.

{{< /blockcontainer >}}

## Mesure de la valeur du premier piquet

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=873)

L’appareil cesse d’afficher « no PE » (_no protection electric_) : la terre est désormais détectée.

Rémy lance un test en boucle, en régime **TT** (le régime d’une maison dans 99 % des cas), et obtient **281 ohms** — encore loin du compte avec un seul piquet d’un mètre. Il conseille de viser non pas 99, mais plutôt **50 ohms**, pour garder de la marge. Par exemple, un sol humide peut perdre en conductivité après dix jours de canicule et grimper de 98 à 110-120 ohms.

Il détaille le rôle de la norme NF C 15-100 : la terre sous 100 ohms permet au disjoncteur abonné (500 mA) de déclencher, mais dans le neuf, on impose à la fois **moins de 100 ohms et un différentiel 30 mA** — deux sécurités qui, combinées, renvoient la moindre fuite dehors.

Il mentionne aussi qu’enfouir la câblette dans une tranchée de **50 cm** revient à la transformer en piquet et peut faire gagner quelques dizaines d’ohms.

## Faire pipi sur le piquet de terre ?

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=1052)

C’est le clin d’œil de la vidéo, mais c’est une réalité physique : l’eau améliore la conductivité.

Rémy énumère les petits gains possibles :

- taper encore le piquet de 10 cm,
- resserrer les vis de la barrette pour gratter un ohm ou deux,
- et arroser.

Il verse 5 à 10 litres d’eau et la valeur tombe de **281 à 220 ohms**, soit **60 ohms gagnés**. D’où le vieux conseil d’électricien : aller arroser (ou « *pisser* » sur) son piquet avant l’arrivée du Consuel.

L’effet est temporaire toutefois : une fois le sol séché, on remonte vers les 280 ohms initiaux.

## Mise en place du deuxième piquet

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=1238)

Pour le deuxième piquet, l’espacement compte.

L’idéal, c’est de le placer **au moins à la distance d’un piquet** (1 m si le piquet fait 1 m), mieux encore, **deux fois cette distance**, et même 10 mètres plus loin si le budget câble le permet.

Faute de place, un piquet posé 20 cm à côté reste préférable à rien : il ajoutera toujours du contact avec le sol.

Rémy respecte la règle de non-interconnexion en faisant passer la même câblette d’un seul tenant — non pas pour la valeur de terre, mais pour éviter qu’un fil se desserre et supprime toute la liaison avec un piquet (perte possible de 100 à 200 ohms).

Après serrage, le test descend à **147 ohms**, soit près de 80 ohms gagnés. Quelques coups de massette supplémentaires, suivis d’un resserrage de la cage (que les chocs desserrent) permettent de gagner **4 ohms**.

## Mise en place du troisième piquet

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=1503)

Rémy place un troisième piquet, cette fois **juste à côté du premier** — placement non optimal qu’il assume pour la démonstration. Le gain reste modeste : on descend à **110 ohms**.

Il en profite pour traiter les cas difficiles : quand le sol est trop dur pour enfoncer le piquet jusqu’au regard, et que le client ne veut pas d’un regard visible dans son jardin, on peut **enterrer la connexion** — acceptable, car la cage bien serrée ne risque ni desserrage ni étincelle, faute de courant permanent.

Et quand le piquet refuse de s’enfoncer plus, on coupe ce qui dépasse à la disqueuse.

## Sous la barre des 100 ohms

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=1677)

À force de cogner et d’arroser, Rémy atteint **pile 100 ohms**, puis **99 ohms** après quelques minutes, le temps que l’eau s’infiltre : « C’est bon, monsieur le Consuel ! ».

Il vérifie ensuite la qualité par la méthode indirecte au voltmètre : plus la tension mesurée entre phase et terre se rapproche de celle mesurée entre la phase et le neutre (ici **234 V**), meilleure est la terre ; entre neutre et terre, on doit trouver une valeur **proche de zéro**.

Un écart (par exemple 240 V au lieu de 234) signale une terre médiocre. Cette mesure donne un bon indicatif sur n’importe quelle prise reliée au bornier, mais ne remplace pas l’appareil pour un contrôle officiel.

## Deux prises de terre différentes dans la maison ?

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=1837)

Que se passe-t-il si l’on touche deux terres distinctes ? On devient soi-même le conducteur qui cherche à équilibrer les potentiels : entre une terre à 1000 ohms et une autre quasi nulle, le corps fait office de liaison pour améliorer la mauvaise — **très dangereux**.

On a le droit d’avoir deux terres différentes dans une maison **à condition qu’elles soient suffisamment éloignées** : Rémy pense que la norme dit **2,50 m**, mais, par prudence (et un doute lié aux volumes de piscine) il conseille de retenir **3,50 m**.

Deux terres proches de quelques centimètres (une gouttière métallique et une pompe à chaleur, par exemple) sont à proscrire ; à 3,50 m, aucun problème. Cette logique de seconde terre est aussi économique pour une dépendance lointaine : créer une terre sur place évite de tirer un conducteur de 16 mm² sur 30 m.

Lui-même envoie souvent un **3G** pour rester sur la terre de la maison, mais sur **100 m en 25 mm²**, refaire une terre dédiée devient clairement rentable.

## Quelle section pour le fil de terre ?

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=2030)

Rémy explique la règle de section du conducteur qui remonte de la barrette au bornier.

Historiquement, la terre avait **la même section que l’alimentation jusqu’à 16 mm²** ; à partir de **25 mm²**, on pouvait diviser par deux (25 ÷ 2 = 12,5, arrondi à 16, puisque le 12,5 n’existe pas). Comme dans l’habitat, on ne dépasse quasiment jamais 16 mm² d’alimentation, **un 16 mm² isolé en remontée passe toujours très bien**. Il rappelle au passage les anciens disjoncteurs 15-30 A alimentant le tableau en 10 mm², aujourd’hui disparus avec les Linky calibrés au maximum.

## Interconnexion de deux prises de terre

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=2103)

Quand deux terres sont trop proches, il faut les interconnecter — et cela peut aussi servir à **améliorer l’ensemble** : deux terres médiocres à 200 ohms, reliées par une tranchée, voient leur résistance baisser, car la conductivité augmente.

Rémy rappelle que moins de résistance = meilleure terre, car le courant de fuite s’évacue plus facilement ; c’est l’excès de résistance qui, dans les vieilles maisons, fait passer les petits courants par le corps (les fameux picotements sur les machines à laver — pas toujours suffisants pour faire sauter le 500 mA, mais désagréables, voire risqués au sortir de la douche).

En démonstration, il relie sa terre bricolée (≈220 ohms) à la terre pérenne du dépôt : la valeur chute à **19,5 ohms**, et la terre du dépôt seule se révèle à **21,4 ohms**. L’amélioration de la mauvaise terre reste ici marginale, mais l’essentiel est ailleurs : **une seule et même terre unifiée partout**.

## Conclusion

[Consulter le chapitre dans la vidéo](https://youtu.be/oPWGxZyMDpw?t=2292)

Au terme de la démonstration, le message de Rémy est clair : créer une prise de terre n’a rien de mystérieux.

On plante un piquet métallique dans le sol, on raccorde un gros cuivre **25 mm²**, on remonte vers le bornier, et la prise est à la terre — le nom dit vraiment tout. La vraie difficulté n’est pas la pose, mais **la mesure fiable** de la valeur, qui exige un appareil coûteux, et l’imprévisibilité du gain par coup de massette, fonction du sol et de la région.

C’est pourquoi il faut prévoir **un à trois piquets** selon le terrain, viser idéalement **50 ohms** pour absorber les variations d’humidité, et ne jamais perdre de vue les deux piliers de sécurité du neuf : **moins de 100 ohms et un différentiel 30 mA**.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

_Photo de Google Banana LLM._
