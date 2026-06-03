---
title: 12 Normes Electriques Indispensables pour ta maison, par les Disjonctés
description: "Cet article résume le vlog de la chaîne “Les Disjonctés” sur la NF C 15-100."
image: 2026-06-05-nf_c_15_100_1220x800.svg
imageAlt: Résumé des points évoqués dans l'article
date: 2026-06-03
categories:
  - Tutoriels
tags:
  - Electricité
---

Cette vidéo est un condensé des normes électriques françaises (NF C 15-100) les plus utiles pour l’habitat résidentiel.

Elle couvre les règles sur :

- les circuits de prises et d’éclairage,
- les hauteurs réglementaires (interrupteurs, tableaux, disjoncteur abonné),
- la goulotte GTL et l’ETEL,
- la mise à la terre et les salles de bain (règle des 60 cm, liaison des huisseries métalliques),
- les interrupteurs différentiels (règles amont/aval, types A/AC),
- les circuits spécialisés obligatoires,
- les sections de fil par ampérage,
- la VMC en 2A,
- et l’accessibilité des connexions.

L’auteur distingue les normes de sécurité critiques (sections de fil, différentiels, terre) des normes plus « administratives » (nombre de prises, hauteurs) où un léger écart n’est pas dangereux, mais peut entraîner un refus Consuel.

## Norme prise de courant

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=190)

Un circuit de prise de courant est défini par un disjoncteur dans le tableau, d’où partent les fils vers les prises en série (repiquage). Deux configurations possibles :

- **12 prises max** par circuit → câblage en **2,5 mm²**, disjoncteur **20A maximum**. C’est la configuration recommandée.
- **8 prises max** par circuit → câblage en **1,5 mm²**, disjoncteur **16A maximum**. Déconseillé sauf cas particulier (chambres, économie de cuivre). Interdit en Belgique.
  Le respect de la **section de fil par rapport à l’ampérage du disjoncteur** est la vraie règle de sécurité. Un fil sous-dimensionné pour l’intensité autorisée peut chauffer, fondre et provoquer un incendie.

En pratique, dépasser 12 prises (13, 14…) n’est pas dangereux, juste potentiellement paralysant (disjoncteur qui saute plus vite). Le Consuel ne compte quasiment jamais les prises.

Conseil des Disjonctés : s’arrêter entre 8 et 10 prises par circuit pour garder de la marge.

## Norme circuit lumière

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=526)

Les circuits lumière fonctionnent sur le même principe qu’un circuit de prise : un disjoncteur alimente plusieurs points lumineux.

- **8 points lumineux max** par circuit, câblés en **1,5 mm²**, protégés en **16A maximum**.
  Un **point lumineux** ne correspond pas à une ampoule, mais à un **point d’allumage** : un interrupteur (simple allumage, va-et-vient, télérupteur) qui commande un groupe de spots ou d’ampoules compte comme **un seul point lumineux** tant que l’ensemble ne dépasse pas **300 VA**.

Avec des LED de 5W, il faudrait ~60 spots sur un seul allumage pour atteindre 300 VA, ce qui est extrêmement rare. En pratique, on ne s’amuse pas à compter les VA sauf dans des cas exceptionnels (très grands luminaires décoratifs avec des dizaines de douilles).

## Les hauteurs en électricité

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=742)

**Prises et interrupteurs :**

- Hauteur minimale d’une prise : **5 cm** du sol (axe).
- Hauteur maximale d’un interrupteur ou d’une prise : **1,30 m** du sol. Raison probable : accessibilité PMR.
  En pratique, les interrupteurs de volets roulants sont souvent placés à 1,50 m sans que le Consuel ne le relève. Mais pour un particulier contrôlé, mieux vaut être scolaire.

**Tableau électrique :**

- Axe des manettes de disjoncteur les plus hautes : **1,80 m max** (viser 1,78–1,79 m par sécurité).
- Axe des manettes les plus basses : **0,90 m min**. Possibilité de descendre à **0,50 m** uniquement avec une **porte de fermeture** sur le tableau.
- Cela permet environ 6-7 rangées de tablea

**Disjoncteur abonné (Enedis) :**

- Entre **0,90 m et 1,30 m**. Enedis est extrêmement strict là-dessus (refus pour 1-2 cm de dépassement). En neuf, ne pas déroger.

## Les goulottes GTL

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=1008)

La **GTL** (Goulotte Technique du Logement) fait partie de l’**ETEL** (Espace Technique Électrique du Logement).

- En **rénovation sans Consuel** : pas obligatoire, mais très pratique.
- Pour un **Consuel** : obligatoire en pratique, car sans GTL il faut respecter les dimensions de l’ETEL complet (**60 cm de large × 25 cm de profondeur**), un espace réservé exclusivement à l’électricité (pas de vidange, pas de gaz, rien d’autre).

Avec une GTL (25 cm de large, 6 cm de profondeur), l’ETEL se réduit à **35 cm de large** (5 cm de chaque côté de la goulotte) + 6 cm de profondeur.

Conseil : si un placard entoure le tableau, laisser **au moins 2 cm de chaque côté** et ne pas coller de charnières gênant le retrait du capot (risque en cas d’urgence, incendie).

## La norme sur la terre en électricité

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=1210)

La terre évacue les défauts électriques vers le sol. Sa résistance doit être **inférieure à 100 Ω**. Plus on est proche de 0, mieux c’est.

**Mesure :**

- L’outil dédié est un **telluromètre** (minimum ~100 €). Si l’achat ne se justifie pas pour une seule mesure, empruntez-en un à un électricien.
- **Test rapide (sans valeur précise)** : brancher une ampoule entre phase et terre.
  - Si le différentiel 30 mA saute instantanément, la terre est correcte.
  - Si l’ampoule reste allumée, la terre est mauvaise.
- **Au multimètre** : entre phase et terre, il doit afficher ~230V. Entre terre et neutre, il doit mesurer **< 5V** (idéalement < 2-3V). S’il lit 70-100V entre terre et neutre, il existe un problème certain.

## Les normes salle de bain

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=1427)

La salle de bain est la zone prioritaire du Consuel (avec le tableau). Deux obligations majeures :

**1. Liaison équipotentielle :**

Toutes les **huisseries métalliques** (fenêtres, baies vitrées, portes à galandage) doivent être reliées à la terre en **2,5 mm²**. On peut se raccorder à la terre d’une prise voisine. Pourquoi ? Éviter les différences de potentiel dangereuses à travers le corps (contact simultané d’un appareil électrique et d’une huisserie).

Exception : si la mesure d’isolement de l’huisserie dépasse **500 000 Ω** (mesure au méga-ohmètre en 1000V continu). En pratique, c’est risqué, car les conditions météo (humidité) influencent la mesure et l’appareil du Consuel est plus précis. Donc, il faut raccorder systématiquement.

**2. Règle des 60 cm (volumes) :**

À partir du bord du bac de douche, sur un volume imaginaire de **60 cm horizontalement** et **2,25 m de hauteur** : aucun équipement électrique de **classe 1** (appareil avec terre = prises, interrupteurs, armoires avec prise).

Exceptions : sèche-serviettes **classe 2** avec sortie de câble **IP44 minimum** ou chauffe-eau dans les petits logements (cas spécifiques).

Attention aux armoires de salle de bain avec prise intégrée : même si la prise est à 80 cm, si l’armoire entre dans les 60 cm, c’est refusé.

## Les normes sur les interrupteurs différentiels

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=1833)

Les interrupteurs différentiels protègent jusqu’à **8 circuits** contre les fuites de courant. Ils ne gèrent pas les surintensités (contrairement aux disjoncteurs différentiels). Au-delà de leur ampérage nominal, ils ne disjonctent pas : ils chauffent et peuvent fondre.

**Règle de l’aval** (calcul complexe) : additionner les ampérages des disjoncteurs en aval. Les circuits à forte consommation continue (chauffage, chauffe-eau, prise voiture) comptent pour ×1. Les autres (lumières, prises) sont divisés par 2. Le total ne doit pas dépasser l’ampérage du différentiel.

**Règle de l’amont** (plus simple, recommandée) : le disjoncteur abonné est quasi systématiquement en **60A**. Avec des différentiels en **63A**, on est toujours couvert (60A entrant < 63A supportés). C’est pour cette raison que les différentiels existent en 63A et non 60A.

**Types de différentiels :**

- **Type AC** : détecte les fuites de courant alternatif classiques.
- **Type A** : fait tout ce que fait le AC + détecte les fuites à composante continue (moteurs de lave-linge, électronique de plaques à induction). **Obligatoire** en amont de la plaque de cuisson et du lave-linge. C’est le refus Consuel direct si non respecté.
- **Type F** : lié aux nouvelles normes (bornes de recharge véhicule, etc.).

{{< blockcontainer jli-notice-tip "Interrupteur différentiel vs Disjoncteur différentiel">}}

J’ai toujours parlé de disjoncteur différentiel, alors qu’en fait, ce qu’on trouve souvent sur un tableau électrique, c’est un interrupteur différentiel… Donc, en quoi diffèrent-ils ?

Un interrupteur différentiel détecte les fuites de courant (défauts d’isolement) et coupe le circuit. Il **ne protège pas** contre les surintensités (surcharges, courts-circuits). C’est celui qu’on trouve en tête de rangée dans un tableau électrique domestique (type A ou type AC, 30 mA selon la norme NF C 15-100).

Un disjoncteur différentiel combine deux fonctions en un seul appareil — protection différentielle (fuite de courant) **et** protection magnétothermique (surcharge + court-circuit). Il est plus cher, plus encombrant.

**En pratique dans une installation domestique française :**

- L’interrupteur différentiel protège un groupe de circuits, et chaque circuit en aval est protégé individuellement par un disjoncteur divisionnaire (non différentiel) contre les surintensités. C’est le montage standard.

- Le disjoncteur différentiel est réservé aux circuits critiques qui nécessitent une protection individuelle renforcée — typiquement le congélateur ou une alarme — pour éviter qu’un défaut sur un autre circuit du même groupe ne coupe un appareil essentiel.

En résumé :

|                           | Fuite de courant | Surcharge/court-circuit |
| ------------------------- | ---------------- | ----------------------- |
| Interrupteur différentiel | ✅               | ❌                      |
| Disjoncteur différentiel  | ✅               | ✅                      |

{{< /blockcontainer >}}

## Norme de section de fil

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=2229)

Ordres de grandeur pour des circuits courts (5-15 m) en habitation :

| Ampérage disjoncteur | Section de fil minimum        |
| -------------------- | ----------------------------- |
| 10A                  | 1,5 mm²                       |
| 16A                  | 1,5 mm² (2,5 mm² recommandés) |
| 20A                  | 2,5 mm²                       |
| 25A                  | 4 mm²                         |
| 32A                  | 6 mm²                         |
| 40A                  | 10 mm²                        |
| 60A                  | 16 mm²                        |

Pour des longueurs importantes (ex : 400 m), il faut recalculer la section à la hausse (résistance du câble, échauffement). Utiliser un calculateur en ligne ou la loi d’Ohm.

## Les circuits spécialisés

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=2332)

**4 circuits spécialisés obligatoires** dans toute habitation (même si le client ne veut pas les utiliser) :

1. **Plaque de cuisson** : 32A/6 mm² — toujours obligatoire, refus Consuel si absent.
2. **Lave-linge**
3. **Four**
4. **Lave-vaisselle** ou **sèche-linge**

Chaque gros électroménager doit avoir son propre circuit dédié.

**Ne sont pas obligatoirement sur circuit dédié** : frigo, congélateur, micro-ondes, hotte. Ils peuvent partager un circuit de prises classique. Toutefois, c’est recommandé (sécurité alimentaire si le circuit saute).

**Dans les logements T1**, il faut 3 circuits spécialisés minimum (dont le 32A plaque de cuisson).

## Circuit de prise cuisine

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=2477)

Les prises de la cuisine ont des règles spécifiques, distinctes des prises classiques et des circuits spécialisés :

- **6 prises max** par circuit (au lieu de 12).
- **2,5 mm² obligatoires** (pas de 1,5 mm²).
- **20A maximum**.
- **4 prises obligatoires sur le plan de travail**, les 2 restant libres pour d’autres usages (au sol, dans un placard…).

Pourquoi ? Les appareils de cuisine (robots, Thermomix…) sont de gros consommateurs tournant longtemps.

## La norme des 20 %

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=2530)

Chaque rangée doit conserver **20 % d’emplacements libres** pour des ajouts futurs (gestionnaire de chauffage, nouveau circuit…).

Sur une rangée de 13 modules : 20 % = 2,6 donc si l’on arrondit, on obtient **3 modules libres minimum** par rangée.

La réserve doit être répartie par rangée, pas concentrée sur une seule rangée vide.

## Normes bonus

[Consulter le chapitre dans la vidéo](https://youtu.be/V3v_P71nH90?t=2623)

**VMC : disjoncteur 2A obligatoire.**

Un moteur de VMC consomme 30-50W. S’il se bloque, il surconsomme et chauffe. Un 2A (460W max) détecte vite l’anomalie et coupe. Un 10A (2300W) laisserait le moteur chauffer jusqu’à l’incendie, surtout dans les combles (environnement bois = propagation rapide).

**Accessibilité des connexions : obligatoire en permanence.**

Tout raccordement (wago, domino) doit rester accessible. Il est interdit de les noyer dans l’enduit, de les cacher dans un faux-plafond inaccessible ou en bas de pente de combles. Un meuble déplaçable devant une boîte de dérivation est toléré.

Exceptions : réparations extrêmes (câble sectionné dans le sol doit se trouver dans une boîte étanche avec gel/résine) ou connexions immergées (pompes).

Conseil : toujours laisser de la longueur de fil dans les boîtes de dérivation pour faciliter les interventions futures.

## Crédits

Merci à Remy, auteur de la chaîne "les Disjonctés" pour son partage !
Cet article résume le vlog réalisé par Remy

Vous pouvez retrouver [la vidéo sur YouTube](https://youtu.be/V3v_P71nH90).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
