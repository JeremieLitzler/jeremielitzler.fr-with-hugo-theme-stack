---
title: "Comment formater une durée dans une formule sur Google Sheets"
description: "Oui, vous pouvez utiliser le menu de formatage, mais ce n’est pas suffisant. Et si je vous disais que vous pouvez formater une valeur décimale représentant une heure à l’aide d’une formule. Passons en revue les étapes."
image: 2025-05-16-an-alarm-clock-displaying-23h53.jpg
imageAlt: Un réveil affichant 23h53
date: 2025-08-06
categories:
  - Mes tutoriels
tags:
  - Google Sheets
---

Prenons l’exemple ci-dessous :

|     | A       | B                        | C                    |                       |
| --- | ------- | ------------------------ | -------------------- | --------------------- |
| 1   | Lessons | NumberOfMinutesPerLesson | TotalDurationDecimal | TotalDurationFormated |
| 2   | 50      | 5                        | 4.16                 | 4:10:00               |
| 3   | 35      | 6                        | 3.50                 | 3:30:00               |

## Le problème

Dans Google Sheet, la conversion d’une valeur décimale en une valeur de durée suit certaines règles.

Par exemple,

- `1` est équivalent à `24:00:00`
- `1.35` est équivalent à `32:24:00`
- `0.5` est équivalent à `12:00:00`
- `0.05125` est équivalent à `01:13:48`

Ainsi, si nous formatons les valeurs décimales ci-dessus, le résultat ne sera pas le _4:10:00_ et le _3:30:00_ attendus.

## La solution

Heureusement, il est facile de résoudre ce problème.

Étant donné que nous avons appliqué le formatage _Durée_ à la colonne D, les formules sont les suivantes :

|     | A       | B                        | C                    | D                     |
| --- | ------- | ------------------------ | -------------------- | --------------------- |
| 1   | Lessons | NumberOfMinutesPerLesson | TotalDurationDecimal | TotalDurationFormated |
| 2   | 50      | 5                        | =A2\*B2              | =C2/60/24             |
| 3   | 32      | 6                        | =A3\*B3              | =C3/60/24             |

La colonne C contient un nombre d’heures.

Puisque le formatage appliquera `1 = 24h` , il suffit de diviser la valeur de la colonne C par 60 puis par 24.

Lorsque le formatage _Durée_ est appliqué, cela affiche donc la bonne durée.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [FOX ^.ᆽ.^= ∫](https://www.pexels.com/photo/white-digital-desk-clock-2046808/).
