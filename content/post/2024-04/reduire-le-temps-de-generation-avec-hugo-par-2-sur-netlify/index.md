---
title: "Réduire le temps de génération avec Hugo par 2 sur Netlify"
description: "Lorsque vous commencez à avoir beaucoup d’articles sur un site web généré par Hugo, le nombre d’images traitées peut ralentir la génération jusqu’à atteindre le temps limite d’exécution par défaut. Bien que vous puissiez l’augmenter, cela ne suffit pas pour éviter de surconsommer les minutes de génération sur Netlify."
image: images/2024-04-15-still-shot-at-night-in-a-city.jpg
imageAlt: "Photo de nuit dans une ville"
date: 2024-04-15
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Hugo
  - Netlify
---

Soudainement, un jour, la génération de mon blog déployé sur Netlify a commencé à échouer. La raison : un dépassement du temps limite d’exécution…

Au début, j’ai pensé que c’était dû au fait que j’avais extrait le thème d’un module Git vers un dossier indépendant et versionné dans mon dépôt. J’ai fait cela parce que la fonction de mise à jour automatique utilisant un module Git avait cassé la génération la veille du jour où j’ai rencontré cet autre problème de génération.

J’ai cherché et après quelques jours de réinitialisation des changements de thème et de validation que la génération fonctionnait localement, j’ai lu attentivement les logs de Netlify.

Sur mon PC (processeur i3 et 8 Go), la commande Hugo s’exécutait en moins de 10 s.
Pour le même dépôt et le même _commit_, elle s’exécutait en 36 secondes sur Netlify.

Voici l’erreur reçue de Netlify :

```log
8:12:14 PM: hugo v0.123.8-5fed9c591b694f314e5939548e11cc3dcb79a79c+extended linux/amd64 BuildDate=2024-03-07T13:14:42Z VendorInfo=gohugoio
8:12:48 PM: ERROR render of "page" failed: "/opt/build/repo/themes/hugo-theme-stack/layouts/_default/single.html:27:7": execute of template failed: template: _default/single.html:27:7: executing "main" at <partial "article/article.html" .>: error calling partial: partial "article/article.html" timed out after 30s. This is most likely due to infinite recursion. If this is just a slow template, you can try to increase the "timeout" config setting.
8:12:48 PM: Total in 33961 ms
8:12:48 PM: Error: error building site: render: failed to render pages: render of "page" failed: "/opt/build/repo/themes/hugo-theme-stack/layouts/_default/single.html:27:7": execute of template failed: template: _default/single.html:27:7: executing "main" at <partial "article/article.html" .>: error calling partial: partial "article/article.html" timed out after 30s. This is most likely due to infinite recursion. If this is just a slow template, you can try to increase the "timeout" config setting.
```

Les statistiques de génération de mon dépôt étaient les suivantes :

```log
8:25:17 PM:                    |  EN
8:25:17 PM: -------------------+-------
8:25:17 PM:   Pages            |  347
8:25:17 PM:   Paginator pages  |   68
8:25:17 PM:   Non-page files   |  499
8:25:17 PM:   Static files     |  113
8:25:17 PM:   Processed images | 1331
8:25:17 PM:   Aliases          |  110
8:25:17 PM:   Cleaned          |    0
8:25:17 PM: Total in 36602 ms
```

Pensant que c’était lié au thème, j’ai demandé à CaiJimmy [dans cette discussion](https://github.com/CaiJimmy/hugo-theme-stack/discussions/975) sur le dépôt de son thème.

Il m’a recommandé [d’utiliser cette extension](https://github.com/cdeleeuwe/netlify-plugin-hugo-cache-resources#readme), parce que le traitement des images est ce qui prend le plus de ressources et de temps pendant la génération.

L’extension met en cache, lors de l’événement _post-build_, le dossier `resources`, s’il n’est pas déjà en cache. C’est ici que Hugo place les images traitées. Ensuite, lors des générations suivantes, il utilise le cache de l’événement _pre-build_.

Le temps de génération est devenu :

```log
6:01:03 AM:                    |  EN
6:01:03 AM: -------------------+-------
6:01:03 AM:   Pages            |  365
6:01:03 AM:   Paginator pages  |   72
6:01:03 AM:   Non-page files   |  517
6:01:03 AM:   Static files     |  113
6:01:03 AM:   Processed images | 1396
6:01:03 AM:   Aliases          |  114
6:01:03 AM:   Cleaned          |    0
6:01:03 AM: Total in 1072 ms
```

Une amélioration de 36 fois, pas mal, n’est-ce pas ? 😁 Quand je dis _réduire par 2_ le temps de génération dans le titre, je parle du temps total que Netlify enregistre. Les 36 fois ci-dessus ne concernent que l’étape de génération par Hugo.

La chose importante à garder à l’esprit : la première génération sera toujours lente, donc vous devez avoir le paramètre `timeout` que vous pouvez le définir dans le fichier `config/_default/config.toml` :

```toml
# valeur par défaut est 30s
# voir https://gohugo.io/getting-started/configuration/#timeout
timeout = "60s"
```

Si vous faites un `Clear cache and deploy site`, vous verrez un temps de construction lent.

{{< blockcontainer jli-notice-note "Vous pouvez reproduire la lenteur en local">}}

Si vous supprimez les dossiers `public` et `resource`, qui ne sont pas versionnés sur le dépôt, vous obtiendrez :

```log
                   |  EN
-------------------+-------
  Pages            |  366
  Paginator pages  |   72
  Non-page files   |  517
  Static files     |  113
  Processed images | 1399
  Aliases          |  114
  Cleaned          |    0

Total in 54072 ms
```

{{< /blockcontainer >}}

Merci d’avoir lu cet article.

Crédit: Photo par [Marc-Olivier Jodoin](https://unsplash.com/@marcojodoin?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/long-exposure-photography-of-road-and-cars-NqOInJ-ttqM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
