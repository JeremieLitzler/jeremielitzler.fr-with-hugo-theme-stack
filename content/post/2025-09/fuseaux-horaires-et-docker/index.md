---
title: "Fuseaux horaires et Docker"
description: "Selon les besoins métiers, il est essentiel de définir le fuseau horaire approprié. Voyons comment procéder."
image: 2025-06-13-4-clocks-for-london-new-york-moscow-and-tokyo-time.jpg
imageAlt: Quatre horloges pour l’heure de Londres, New York, Moscou et Tokyo
date: 2025-09-12
categories:
  - Développement logiciel
tags:
  - Docker
  - Fuseaux horaires
---

## Le contexte

L’année dernière, j’ai travaillé sur une application Python déployée sur Microsoft Azure. Cette application comprenait un ensemble de tâches récurrentes configurées avec une planification [CRON](https://en.wikipedia.org/wiki/Cron) à l’aide du package _APScheduler_.

Cependant, peu après le déploiement, j’ai remarqué que la tâche s’exécutait avec 2 heures de retard sur mon heure actuelle (GMT+2).

Ce n’était pas un gros problème à l’époque, mais après le changement d’heure du 27 octobre 2025, cela en est devenu un…

En effet, l’application était chargée d’envoyer des SMS de rappel pour un planning donné à une équipe d’astreinte. Cependant, après le changement d’heure, ces notifications, concernant le statut courant d’une personne comme étant d’astreinte ou en fin d’une session, ont été retardées d’un jour complet.

## La raison

J’avais configuré la tâche planifiée pour qu’elle s’exécute à 8 h 15, heure locale, ce qui correspondait à 6 h 15 heure UTC.

Cependant, lors du passage de l’heure d’été à l’heure d’hiver, la tâche s’exécutait à 7 h 15.

Comme les sessions d’astreinte commençaient toujours à 18 h et se terminaient à 7 h 59 le lendemain, lorsque la tâche programmée s’exécutait, elle envoyait le rappel pour la session, qui avait commencé presque un jour auparavant…

## La solution

Un collègue, plus expérimenté sur Docker, m’a demandé : « Indiques-tu à Docker le fuseau horaire lors du montage de l’image ? » Et non, je ne précisais pas !

J’ai donc corrigé mon fichier Docker avec ce qui suit :

```docker
# Installer d'abord les données relatives aux fuseaux horaires
# Il se peut qu'elle ne soit pas incluse dans votre image de base
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*

# Et définir ensuite le fuseau horaire
ENV TZ=Europe/Zurich
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
```

En déployant la nouvelle version, je pouvais programmer la tâche à l’heure réelle à laquelle j’avais besoin qu’elle s’exécute.

Plus important encore, je n’ai pas eu à me soucier du changement d’heure au mois de mars suivant.

## Conclusion

Connaissiez-vous cela ?

Je ne le savais pas et je suis heureux d’avoir été confronté à cette situation. C’est toutefois par le métier que la situation s’est présentée, n’ayant jamais, jusqu’à ce projet, travaillé avec les fuseaux horaires.

De plus, cela m’a obligé à écrire des tests unitaires pour que l’ordonnanceur fonctionne comme prévu.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Pixabay](https://www.pexels.com/photo/london-new-york-tokyo-and-moscow-clocks-48770/).
