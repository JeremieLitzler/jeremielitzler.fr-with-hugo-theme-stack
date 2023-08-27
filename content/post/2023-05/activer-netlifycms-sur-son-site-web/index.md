---
title: "Activer l'édition du contenu de son site web"
description: 'À la place d’une solution comme WordPress, NetlifyCMS permet de gérer son contenu sans toutes les difficultés connues du CMS le plus utilisé dans le monde.'
heroImage: /images/2023-04-19-jamstack-javascript-apis-markup.webp
heroAlt: Diagramme expliquant l'organisation de la JAMSTACK
date: 2023-05-18
head:
  - [
      link,
      {
        rel: canonical,
        href: https://jeremielitzler.fr/2023/05/activer-netlifycms-sur-son-site-web/,
      },
     meta,
     { "og:type": article },
     meta,
     { "og:title": "Activer l'édition du contenu de son site web" },
     meta,
     {
       "og:description": "À la place d’une solution comme WordPress, NetlifyCMS permet de gérer son contenu sans toutes les difficultés connues du CMS le plus utilisé dans le monde.",
     },
     meta,
     {
       "og:image": /images/2023-04-19-jamstack-javascript-apis-markup.webp,
     },
    ]
category:
  - Tutoriels
tag:
  - Web
---

![Diagramme expliquant l'organisation de la JAMSTACK](/images/2023-04-19-jamstack-javascript-apis-markup.webp 'Image issue de l\'article ["New to Jamstack? Everything You Need to Know to Get Started"](https://snipcart.com/blog/jamstack) de Snipcart.')

À la place d’une solution comme WordPress, NetlifyCMS permet de gérer son contenu sans toutes les difficultés connues du CMS le plus utilisé dans le monde.

<!-- more -->

## Activer NetlifyCMS

Par défaut, le modèle de site VuePress contient le dossier `admin` de base il faudra mettre à jour quelques éléments.

Les étapes sont assez simples.

### Dans le dépôt Git

On modifie le fichier `config.yml` se trouvant dans le dossier `docs/.vuepress/public/admin` en mettant à jour la valeur du nom du dépôt GitHub et la langue de votre site (`fr` pour Français, `en` pour Anglais, etc).

Je ne détaillerai pas le reste, car la configuration par défaut correspond à un besoin de base. Pour plus d'information, je vous invite à visiter [le site DecapCMS](https://decapcms.org/).

### Dans GitHub

Rendez-vous sur GitHub une fois que vous êtes connectés sur votre compte.

Naviguez sur [https://github.com/settings/developers](https://github.com/settings/developers) pour ajouter une nouvelle `OAuth App`. Cliquez `New OAuth App`.

Fournissez dans le formulaire comme suit :

- Le nom de l’application dans le champ `Application name`. Ex : _Mon site web_.
- L’URL de la page d’accueil de votre site dans le champ `Homepage URL`.
- La description publique de l’application dans le champ `Application description`.
- L’URL d’autorisation dans le champ `Authorization callback URL` avec la valeur `https://api.netlify.com/auth/done`.

![Le formulaire rempli pour la création de l'application OAuth App](./images/le-formulaire-rempli-pour-la-creation-de-lapplication-oauth-app.jpg)

Une fois validé, vous verrez le `Client ID` (1) et le bouton pour générer le `Client Secret` via le bouton `Generate a new client secret` (2).

![Ecran récapitulatif de l'application OAuth avec le bouton pour générer le Client Secret](./images/ecran-recapitulatif-de-lapplication-oauth-avec-le-bouton-pour-generer-le-client-secret.jpg)

Cliquez le bouton pour générer le Client secret et copiez la valeur générée.

![Bouton de copie du Client Secret](./images/bouton-de-copie-du-client-secret.jpg)

### Dans Netlify

Rendez-vous sur Netlify et allez sur `https://app.netlify.com/sites/votre-site/settings/general` et cliquez `Identity`

Cliquez `Enable Identity`.

Modifiez-les `Registration preferences` pour permettre les souscriptions sans ou avec invitations. Par défaut, configurer `Invite only`.

Sans changer de page, descendez jusqu’à `Git Gateway` et cliquez `Enable Git Gateway`.

Dans les `Site settings`, rendez-vous sur `Access Control` tout en bas.

![Configurer "Access Control" du site](./images/configurer-access-control-du-site.jpg)

Allez dans `OAuth` et cliquez `Install provider` en sélectionnant `GitHub`.

Saisissez le _client secret_ copié dans GitHub et copiez-collez le client ID avant de cliquer `Install`.

![Configurer la liaison entre GitHub et le site Netlify](./images/configurer-la-liaison-entre-github-et-le-site-netlify.jpg)

:::tip Si vous n'avez pas copié le _client secret_...
Regénérez-en un, tout simplement :)
:::

Pour finir, rendez-vous sur `https://mon-super-domaine.fr/admin` et cliquez `Se connecter avec GitHub`.

![Ecran de connexion à NetlifyCMS sur votre site](./images/ecran-de-connexion-a-netlifycms-sur-votre-site.jpg)

:::warning Pour accéder à NetlifyCMS de votre site, soyez sûr de pouvoir vous connecter à GitHub.
:::

L’écran suivant s’affiche où il suffit de cliquer `Authorize VotrePseudoGitHub`.

![Écran d’autorisation pour netlify.com vers GitHub.com](./images/ecran-dautorisation-pour-netlify.com-vers-github.com.jpg)

Vous arrivez alors sur la page d’accueil de l’interface de gestion NetlifyCMS de votre site

![Accueil de NetlifyCMS d’un site démonstration](./images/accueil-de-netlifycms-dun-site-demonstration.jpg)

Je n'irai pas dans le détail ici de comment utiliser NetlifyCMS.

## Limitations

### Il faut apprendre la syntaxe _Markdown_

Elle est très simple à maitriser, comme l'explique [Grafikart sur YouTube](https://www.youtube.com/watch?v=6hikjzymd0c).

### Les extensions du thème VuePress ne sont pas affichées correctement

En prévisualisation, les syntaxes étendues du thème de Mister Hope ne sont pas affichées correctement, car il manque leurs interprétations en HTML.

Et il manque les styles CSS.

C'est pour cela que je travaille uniquement sur Visual Studio Code, qui permet de lancer localement le site et de visualiser les pages dans leur rendu final.

### Déploiement après édition dans NetlifyCMS

Une autre limitation est qu'éditer un fichier Markdown d'une page ou un article ne va pas être détecté par Netlify comme un déploiement.

Vous risquez de voir que la mise à jour n'est pas être déployée (le _Build_ est à l'état `Canceled`).

![Une compilation Netlify à l'état "Canceled"](./images/un-build-netlify-a-letat-canceled.jpg)

Pourquoi ? Il semble que modifier uniquement un fichier `.md` ne suffit pas pour lancer une compilation complète (ou _build_).

Il faut alors sélectionner la fameuse compilation et cliquer le menu `Rety` puis `Clear cache and retry with latest branch commit`.

![Forcer un déploiement avec effacement du cache pour un déploiement spécifique](./images/forcer-un-deploiement-avec-effacement-du-cache-pour-un-deploiement-specifique.jpg)

La modification est aussi soumise par NetlifyCMS à GitHub via une requête de tirage, qu'il faut alors accepter pour que le déploiement sur le site de production ait lieu.

L'avantage est de pouvoir vérifier sur une URL de prévisualisation que tout est bon.

Voici [un exemple de requête de tirage](https://github.com/JeremieLitzler/mon-site-demo-tutoriel/pull/1) sur mon site de démo réalisé pour ce tutoriel.

Après la validation de la requête de tirage, il faut aussi forcer une compilation manuellement depuis la liste des déploiements, comme indiqué ci-dessous :

![Forcer un déploiement avec effacement du cache](./images/forcer-un-deploiement-avec-effacement-du-cache.jpg)

Pour lancer une compilation complète, il faut éditer le fichier `docs/.vuepress/config.js` en modifiant le numéro de version en l'incrémentant par exemple.

Je compte réaliser un guide plus complet, dans le futur, sur l'usage de Netlify.

J'espère que vous avez aimé cette série et pour recevoir d'autres articles de ce type, abonnez-vous !

:::center
⏬⏬⏬
:::

<!-- markdownlint-disable MD033 -->
<p class="newsletter-wrapper"><iframe class="newsletter-embed" src="https://iamjeremie.substack.com/embed" frameborder="0" scrolling="no"></iframe></p>
