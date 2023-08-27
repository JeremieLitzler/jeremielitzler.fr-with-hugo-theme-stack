---
title: Un meilleur calcul du retour sur investissement d'une installation photovoltaïque
description: "Le calcul du retour sur investissement n'était pas juste dans mon article du 31 décembre 2022. Cet article corrige le tir"
heroImage: /images/2023-01-08-production-reel-vs-theorique-vs-autoconsommation-2022.jpg
heroAlt: Production théorique vs Production réelle vs Autoconsommation
date: 2023-01-08
head:
  - [
      link,
      {
        rel: canonical,
        href: https://jeremielitzler.fr/2023/01/calculer-le-retour-sur-investissement-pv/,
      },
     meta,
     { "og:type": article },
     meta,
     { "og:title": "Un meilleur calcul du retour sur investissement d'une installation photovoltaïque" },
     meta,
     {
       "og:description": "Le calcul du retour sur investissement n'était pas juste dans mon article du 31 décembre 2022. Cet article corrige le tir",
     },
     meta,
     {
       "og:image": /images/2023-01-08-production-reel-vs-theorique-vs-autoconsommation-2022.jpg,
     },
    ]
category:
  - Energie
tag:
  - Photovoltaique
---

![Production théorique vs Production réelle vs Autoconsommation](/images/2023-01-08-production-reel-vs-theorique-vs-autoconsommation-2022.jpg)

OK, c'est vrai. J'ai sûrement _abusé_ en prenant le coût moyennant du kWh incluant l'abonnement en me basant sur le montant de la facture divisé par le nombre de kWh consommés.

Le prix du kWh est alors plus bas en hiver qu'en été vu que la consommation est inversée.

Je vais donc réaliser un meilleur calcul. Voici la formule.

<!-- more -->

:::center
⏬⏬⏬
:::

<!-- markdownlint-disable MD033 -->
<p class="newsletter-wrapper"><iframe class="newsletter-embed" src="https://iamjeremie.substack.com/embed" frameborder="0" scrolling="no"></iframe></p>

## Calcul original

Pour rappel, dans la section _Quelle économie sur 9 mois_ de [la partie 2 de mon retour d'expérience après 9 mois](../../../2022/12/retour-d-experience-sur-une-installation-pv-9mois-partie-2/README.md#quelle-économie-sur-9-mois), j'ai avancé le fait que j'avais économisé 300 euros.

Seulement, j'ai pris le coût moyen du kWh sur les deux mois (par exemple : avril et mai) calculé par`montant de la facture (*) divisé par la somme des kWh consommés (**)` :

- (\*) : cela inclut l'abonnement, les taxes et la consommation.
- (\*\*) : cela inclut les heures creuses et les heures pleines.

## Nouveau calcul

En réalité, en consommant l'électricité produite par notre installation familiale, on déporte la consommation de la nuit à la journée.

En faisant cela, l'été, nous consommerons plus en heures pleines (HP) qu'en heures creuses (HC).

En moyenne,

- d'octobre à avril, nous consommons 60 % de kWh en HC et 40 % de kWh en HP.
- de mai à septembre, nous inversons la tendance.

Cela est dû à la consommation très réduite du cumulus en été par rapport à l'hiver.

Il semble qu'avec l'installation photovoltaïque, les mois d'octobre et d'avril vont basculer _en mois estivaux_.

Toutefois, je ne dirai pas que le calcul de l'économie réalisée correspond à`le coût du kWh en HC multiplié par la somme de la production autoconsommée`.

==Pourquoi ?==

Faire tourner le lave-linge et le lave-vaisselle nous fait consommer un peu chaque jour et cela correspond à facilement 50 % de la consommation.

Il est difficile d'être plus précis, car si l'on prend en compte qu'on se trouve en autoconsommation de 9h à 20h, il ne reste pas beaucoup d'heures sous le régime _d’heures pleines_.

Toutefois, on va calculer :

-`le coût du kWh en HC multiplié par la somme de la production autoconsommée`.

-`le coût du kWh en HP multiplié par la somme de la production autoconsommée`.

-`le coût moyen du kWh en HC + HP multiplié par la somme de la production autoconsommée`.

### Le résultat du calcul sur 9 mois

| Mois          | Prix kWh HP | Économie HP | Prix kWh HC    | Économie HC | Économie moyenne HP+HC |
| ------------- | ----------- | ----------- | -------------- | ----------- | ---------------------- |
| 1             | 0,18826 €   | 0,00 €      | 0,12766 €      | 0,00 €      | 0,00 €                 |
| 2             | 0,18826 €   | 0,00 €      | 0,12766 €      | 0,00 €      | 0,00 €                 |
| 3             | 0,18826 €   | 1,37 €      | 0,12766 €      | 0,93 €      | 1,15 €                 |
| 4             | 0,18826 €   | 27,79 €     | 0,12766 €      | 18,84 €     | 23,31 €                |
| 5             | 0,18826 €   | 35,09 €     | 0,12766 €      | 23,80 €     | 29,44 €                |
| 6             | 0,18826 €   | 34,51 €     | 0,12766 €      | 23,40 €     | 28,95 €                |
| 7             | 0,18826 €   | 38,48 €     | 0,12766 €      | 26,09 €     | 32,29 €                |
| 8             | 0,18826 €   | 29,12 €     | 0,12766 €      | 19,75 €     | 24,44 €                |
| 9             | 0,18826 €   | 27,84 €     | 0,12766 €      | 18,88 €     | 23,36 €                |
| 10            | 0,18826 €   | 20,39 €     | 0,12766 €      | 13,83 €     | 17,11 €                |
| 11            | 0,17496 €   | 10,78 €     | 0,13788 € (\*) | 8,49 €      | 9,64 €                 |
| 12            | 0,17496 €   | 6,18 €      | 0,13788 € (\*) | 4,87 €      | 5,52 €                 |
| Total général | -           | 231,55 €    | -              | 158,88 €    | 195,21 €               |

(\*) :

- Dans [la partie 2 de mon retour d'expérience après 9 mois](../../../2022/12/retour-d-experience-sur-une-installation-pv-9mois-partie-2/README.md#quelle-économie-sur-9-mois), j'indiquais un prix moyen du kWh très différent entre Engie (jusqu'à octobre 2022) et EDF (à partir de novembre 2022).
- Cela était dû à la séparation en deux factures par EDF de la première facture, n'incluant pas l'abonnement avec la consommation.
- Toutefois, la hausse de 25 % sur le renouvellement du contrat annuel 2022-2023 d’Engie est bien réelle et largement supérieure à celle d'EDF à la fin du mois.

### La nouvelle conclusion sur l'économie réalisée

J'aurai rentabilisé mon routeur en un peu moins de 18 mois au lieu qu'il le soit déjà.

Cela va aussi impacter le retour sur investissement et la date à laquelle l'installation deviendra rentable.

## Retour sur investissement recalculé

Du côté de la production, rien ne change (voir _Mon calcul de la production annuelle estimée_ dans [la partie 2 de mon retour d'expérience après 9 mois](../../../2022/12/retour-d-experience-sur-une-installation-pv-9mois-partie-2/README.md#quelle-économie-sur-9-mois))

Du côté de la date de rentabilité, on peut s'attendre à une date deux plus éloignée.

Toutefois, entre 2021 et 2022, le prix du kWh, que ce soit en heures creuses ou en heures pleines, a augmenté de

| Mois | 2014 | 2015   | 2016    | 2017    | 2018   | 2019   | 2020   | 2021    | 2022    | Moyenne |
| ---- | ---- | ------ | ------- | ------- | ------ | ------ | ------ | ------- | ------- | ------- |
| HP   | -    | 0,00 % | -0,33 % | -1,68 % | 1,66 % | 8,19 % | 3,65 % | 21,49 % | 14,57 % | 5,28 %  |
| HC   | -    | 0,00 % | 3,53 %  | 17,05 % | 0,48 % | 2,38 % | 2,81 % | 17,42 % | 17,63 % | 6,81 %  |

Je pense que les 8 % d'origine sont toujours appropriés.

==Si l'on prend une augmentation de 8 % seulement du coût de l'électricité (optimiste), on obtient ceci :==

| Année | Production annuelle | Prix du kWh HC (optimiste) | Économie annuelle | Cumul     |
| ----- | ------------------- | -------------------------- | ----------------- | --------- |
| 2023  | 1503,69             | 0,16 €                     | 238,43 €          | 238,43 €  |
| 2024  | 1503,69             | 0,17 €                     | 257,50 €          | 495,93 €  |
| 2025  | 1503,69             | 0,18 €                     | 278,10 €          | 774,03 €  |
| 2026  | 1503,69             | 0,20 €                     | 300,35 €          | 1074,38 € |
| 2027  | 1503,69             | 0,22 €                     | 324,38 €          | 1398,76 € |
| 2028  | 1503,69             | 0,23 €                     | 350,33 €          | 1749,09 € |
| 2029  | 1225,00             | 0,25 €                     | 308,23 €          | 2057,32 € |

==Si l'on prend une augmentation de 15 % du coût de l'électricité (comme en février 2023), on obtient ceci :==

| Année | Production annuelle | Prix du kWh (optimiste) | Économie annuelle | Cumul     |
| ----- | ------------------- | ----------------------- | ----------------- | --------- |
| 2023  | 1503,69             | 0,16 €                  | 238,43 €          | 238,43 €  |
| 2024  | 1503,69             | 0,18 €                  | 274,19 €          | 512,62 €  |
| 2025  | 1503,69             | 0,21 €                  | 315,32 €          | 827,94 €  |
| 2026  | 1503,69             | 0,24 €                  | 362,62 €          | 1190,56 € |
| 2027  | 1503,69             | 0,28 €                  | 417,01 €          | 1607,57 € |
| 2028  | 1410,00             | 0,32 €                  | 449,68 €          | 2057,26 € |

### Conclusion de la date de rentabilité

Avec une augmentation annuelle du prix du kWh acheté à EDF à 8 %, l’installation devient rentable en plus de **==7 ans et demi environ, soit courant septembre 2029==**.

Avec une augmentation annuelle du prix du kWh acheté à EDF à 15 %, l’installation devient rentable en plus de **==6 ans et 8 mois environ, soit début novembre 2028==**.

Cela fait entre 1 an et demi et 2 ans et demi de plus que par le calcul précédent.

**Qu'en pensez-vous ?**

En tout cas, merci d'avoir lu cet article.

Et comme toujours, si vous voulez lire mes prochains articles, n'hésitez pas à souscrire à ma newsletter gratuite. Je publie une fois par semaine, le lundi.

:::center
⏬⏬⏬
:::

<!-- markdownlint-disable MD033 -->
<p class="newsletter-wrapper"><iframe class="newsletter-embed" src="https://iamjeremie.substack.com/embed" frameborder="0" scrolling="no"></iframe></p>
