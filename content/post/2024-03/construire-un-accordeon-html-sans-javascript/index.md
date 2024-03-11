---
title: "Construire un accordéon HTML sans JavaScript"
description: "Le JavaScript n’est pas toujours indispensable. Par moment, utiliser juste le HTML et un peu de CSS suffit. Regardons comment s’y prendre dans un cas d’utilisation concret."
image: images/2024-02-11-a-vintage-accordeon.jpg
imageAlt: "Un accordéon 'vintage'"
date: 2024-03-11
categories:
  - Développement Web
tags:
  - HTML
  - CSS
  - Astuce du jour
---

Connaissez-vous les éléments HTML `details` et `summary` ?

Vous devriez.

Pour créer un accordéon sans JavaScript, ce sont vos amis.

Mais il se peut que vous souhaitiez en personnaliser l’apparence.

En utilisant la pseudoclasse `::after` sur l’élément `summary`, vous pouvez ajouter du contenu avec la propriété `content`.

Et si vous changiez le contenu en fonction de l’état de l’élément `details` (par exemple, ouvert ou fermé) ?

Appliquez un style différent lorsque l’accordéon est ouvert en utilisant le sélecteur `details[open]`.

Voici la démonstration que j’utilise sur mon blog [sur JSFiddle](https://jsfiddle.net/puzzlout/j09efgpn/).

Amusez-vous bien !

Crédit : Photo de [Gaelle Marcel](https://unsplash.com/@gaellemarcel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/brown-chest-near-wall-MwMmOtj6z2c?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
