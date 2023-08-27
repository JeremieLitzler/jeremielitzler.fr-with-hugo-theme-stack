---
title: "Comment j'organise mon activité digitale ?"
description: 'En 2023, il existe toute une myriade de solutions pour développer sa présence digitale. Dans cet article, je vais présenter mon organisation actuelle.'
date: 2023-03-30
heroImage: /images/2023-03-30-a-laptop-and-notebook-on-a-desk.jpg
heroAlt: Un PC portable et un bloc-notes sur un bureau
head:
  - [
      link,
      {
        rel: canonical,
        href: https://jeremielitzler.fr/2023/03/comment-j-organise-mon-activite-digitale/,
      },
     meta,
     { "og:type": article },
     meta,
     { "og:title": "Comment j'organise mon activité digitale ?" },
     meta,
     {
       "og:description": "En 2023, il existe toute une myriade de solutions pour développer sa présence digitale. Dans cet article, je vais présenter mon organisation actuelle.",
     },
     meta,
     {
       "og:image": /images/2023-03-30-a-laptop-and-notebook-on-a-desk.jpg,
     },
    ]
category:
  - Entreprenariat
---

![Un PC portable et un bloc-notes sur un bureau.](/images/2023-03-30-a-laptop-and-notebook-on-a-desk.jpg 'Photo de [Nick Morrison](https://unsplash.com/@nickmorrison?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) sur [Unsplash](https://unsplash.com/s/photos/digital-business?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)')

En 2023, il existe toute une myriade de solutions pour développer sa présence digitale. Dans cet article, je vais présenter mon organisation actuelle.

<!-- more -->

:::note
For the english version of this article, [continue here](https://iamjeremie.me/2023/03/how-is-setup-my-digital-presence-today/)
:::

## Pour les sites web

J’utilise trois solutions que je privilégie selon les critères qui suivent.

Pour un usage personnel, je suis à fond dans VuePress 2 de plus en plus, car il s’agit de la solution la plus économique en termes d’hébergement.

Toutefois, j’utilise la seconde option pour mes clients et la troisième pour les sites de démonstrations avec WordPress.

Tous mes noms de domaine sont enregistrés auprès d’OVH. J’en ai encore 2 chez Infomaniak, mais je ne vais pas les garder.

### VuePress hébergé avec Netlify et GitHub

Cela m’a pris plusieurs années avant de trouver cette solution qui a l’avantage d’être légère et performante en terme de coût.

Je suis passé par des fichiers HTML confectionnés à la main, des applications PHP _fait maison_ et WordPress.

Même si j’utilise WordPress pour mes clients (car cela leur procure la flexibilité de mettre le contenu du site à jour par eux-mêmes), je n’ai pas fait ce choix pour mon usage personnel.

Je suis ingénieur en développement logiciel et j’ai besoin d’une solution rapide et simple à la mise en œuvre, utilisant le moins de dépendance possible.

J’ai découvert VuePress en 2021 alors que je commençais à me former sur VueJS.

Au début, j’ai construit mon propre thème VuePress 2, basé sur le thème par défaut. Puis, j’ai découvert à l’été 2022 [le thème de Mr Hope](https://theme-hope.vuejs.press/) qui est extrêmement riche en fonctionnalités (en tout cas, j’ai tout ce que je cherchais).

Cette solution me permet de :

- personnaliser les styles, la navigation et les fonctionnalités que je souhaite activer.
- rédiger des articles rapidement [avec Markdown](https://fr.wikipedia.org/wiki/Markdown). VuePress vient ensuite transformer les fichiers Markdown en fichier HTML statique.
- déployer automatiquement le site web sans effort.

J’ai créé un [dépôt modèle avec support multilangue](https://github.com/Puzzlout/TemplateVuepress/) qui fournit la configuration et les étapes minimums pour démarrer. [N’hésitez pas à me contacter si vous souhaitez être accompagné](../../../page/contactez-moi/README.md).

À ce jour, j’utilise cette solution pour :

- ce site web, qui est mon blog personnel
- [ce site de démonstration pour un producteur de quinoa](https://demo-inflorescences.netlify.app/) en Normandie.
- [mon activité pour former les particuliers aux techniques pour réduire leur facture d’électricité](https://www.passonslecap.fr/).
- [mon site historique, pour mon activité de microentreprise,](https://puzzlout.com/fr) que j’ai récemment migré d’un build avec Gulp et des fichiers HTML à plat.

Pour toutes ces applications, le coût est limité à **l’achat du nom de domaine**, sauf quand le domaine `mon-site.netlify.app`est suffisant (`mon-site`est configurable à souhait).

### WordPress avec Divi hébergé chez Infomaniak

Comme je l’ai dit en introduction, j’utilise WordPress et le constructeur de pages Divi avec [l’hébergement Infomaniak](https://www.infomaniak.com/goto/fr/my-easy-site?utm_term=5ff70313bf816) pour mes clients.

Il s’agit d’une solution performante en coût avec un abonnement annuel qui commence à **environ 112 euros** (cela varie selon les offres du moment).

Cela inclut le nom de domaine, un compte email et l’hébergement mutualisé avec le constructeur de pages Divi intégré.

Le panneau de configuration et de gestion est très bien réalisé et bien plus intuitif que celui d’OVH.

Les fonctionnalités disponibles me plaisent beaucoup, car j’aime _scripter_ les déploiements. Même si cela ne permet pas autant de choses que Cloudways ([voir plus ci-dessous](#wordpress-avec-divi-heberge-sur-cloudways)), je peux automatiser assez d’étapes pour déployer rapidement un site web WordPress pour un client.

Aussi, avoir Divi inclus par défaut avec le premier choix d’hébergement se révèle être un très grand avantage.

En termes de coût, vous aurez à payer le nom de domaine et l’hébergement. Pour un nom de domaine `.fr`et l’option minimum d’hébergement, cela revient à environ **112 euros par an**. C’est peut-être plus que des OVH, GoDaddy ou IONOS, toutefois les fonctionnalités et la performance d’Infomaniak les bat à plate couture.

À ce jour, j’utilise cette solution pour :

- [L’Ensemble Instrumental Tournon-Tain](https://ensembleinstrumentaltournontain.fr/).
- [Le site de Gilles Fauriat](https://fauriat-ardeche.fr/), tailleur de pierre près d’Annonay, Ardèche.

:::tip Enfin, Infomaniak met l’accent sur son impact environnemental
Allez lire leur article sur le sujet [disponible sur leur site web](https://www.infomaniak.com/fr/ecologie).
:::

[Contactez-moi](../../../page/contactez-moi/README.md) si vous souhaitez être accompagné pour utiliser cette solution.

### WordPress avec Divi hébergé sur Cloudways

J’utilise WordPress avec Divi (dont je détiens une licence personnelle) et j’héberge sur un [Serveur virtuel privé (VPS en anglais) de Cloudways](https://www.cloudways.com/en/?id=174912) tous mes sites web de démonstrations :

- [Un site pour un groupe musical ou un orchestre](https://music-demo-wp.puzzlout.com/) (que j’ai utilisé pour l’Ensemble Instrumental Tournon-Tain).
- [Un site pour les fleuristes](https://fleuriste-demo.puzzlout.com/)
- [Un site pour une école de danse](https://ecole-de-danse-demo.puzzlout.com/)
- [Un modèle très basique démontrant WordPress et Divi](https://blank-template-fr.madebyjeremie.fr/)
- [Une vitrine pour des producteurs locaux](https://magasin-producteurs-demo.puzzlout.com/)
  - Le terme _vitrine_ signifie que j’utilise Woocommerce, mais que les commandes et les paiements ne sont pas possibles.
- [Une boutique en ligne pour des producteurs locaux](https://boutique-producteurs-demo.puzzlout.com/)

  - Le terme _boutique_ signifie que j’utilise Woocommerce et les commandes et les paiements sont possibles.

- [Un site pour les autoécoles](https://auto-moto-ecole.puzzlout.com/)

Pourquoi Cloudways dans ces cas ? Infomaniak est plus onéreux et moins performant pour une demi-douzaine de sites de démonstrations qu’un VPS.

Cela me revient à **$11.34 par mois** pour maintenir un serveur de taille minimum. Cloudways prend soin de la maintenance du serveur à ma place.

J’ai seulement à réaliser les mises à jour de WordPress et des sites web une fois par mois.

J’ai réalisé un processus de déploiement personnalisé pour ces sites web basé sur des scripts`bash`. Ces scripts sont très similaires à ceux que j’utilise sur Infomaniak.

J’aime beaucoup Cloudways, car j’ai accès à bien plus de fonctionnalités qu’un hébergement mutualisé le permet.

Comparé à la solution mutualisée d’Infomaniak, la différence réside du fait que vous être seul sur votre serveur. Sur Infomaniak, un VPS coûte 30 euros par mois (et oui, il procure plus de puissance, mais dans mon cas, le plus petit serveur de Cloudways est largement suffisant).

[Contactez-moi](../../../page/contactez-moi/README.md) si vous êtes intéressés par les scripts de déploiement sur Infomaniak ou Cloudways.

## Pour les bulletins d’information

À ce jour, j’utilise Substack.

Pourquoi ?

C’est gratuit et personnalisable afin de mettre en avant votre marque.

Les deux inconvénients que j’ai notés jusque là :

- La traduction n’est pas vraiment bonne : quand vous parlez une autre langue que l’anglais dans votre publication, vous ne pouvez pas personnaliser tous les éléments publics dans votre langue.
- Même si la fonctionnalité d’abonnement premium des inscrits est facile à configurer (à travers votre compte Stripe), les dollars américains sont la seule divise disponible.

J’espère vraiment que le premier point sera adressé très bientôt..

Pour les abonnements, lisez la suite

:::center
⏬⏬⏬
:::

## Pour les abonnements ou la vente de produits digitaux

Je n’ai pas d’abonnés premium à ce jour. J’espère que la formation que je suis auprès de [Darius Foroux et son école « Digital Business school »](https://members.dariusforoux.com/digitalbusiness-school) va me permettre de faire grandir cela.

En attendant, j’utilise mon compte Stripe avec des produits en anglais et français. Pour ceux qui souhaitent, un jour, m’aider ou profiter de mes services, ils peuvent [le faire avec un don et un abonnement mensuel ou annuel](../../../page/soutenez-moi/README.md).

Pour le moment, ce site personnel, par exemple, met à disposition des liens de paiements dans 4 monnaies (Euro, Franc suisse, Livres sterling et le dollar américain).

Peut-être qu’en 2023, cela évoluera :)

Si vous souhaitez suivre mes progrès dans la recherche de la meilleure solution, n’hésitez pas à vous abonner à mon bulletin d’information.

:::center
⏬⏬⏬
:::

<!-- markdownlint-disable MD033 -->
<p class="newsletter-wrapper"><iframe class="newsletter-embed" src="https://iamjeremie.substack.com/embed" frameborder="0" scrolling="no"></iframe></p>
