---
title: 'Déployer votre site web moderne pour moins de 10 euros !'
description: "Avec les services de Netlify, le déploiement n'a jamais été aussi simple."
heroImage: /images/2023-04-19-jamstack-javascript-apis-markup.webp
heroAlt: Diagramme expliquant l'organisation de la JAMSTACK
date: 2023-05-15
head:
  - [
      link,
      {
        rel: canonical,
        href: https://jeremielitzler.fr/2023/05/deployer-son-site-moderne-rapide/,
      },
     meta,
     { "og:type": article },
     meta,
     { "og:title": "Déployer votre site web moderne pour moins de 10 euros !" },
     meta,
     {
       "og:description": "Avec les services de Netlify, le déploiement n'a jamais été aussi simple.",
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

![Diagramme expliquant l’organisation de la JAMSTACK](/images/2023-04-19-jamstack-javascript-apis-markup.webp 'Image issue de l\'article ["New to Jamstack? Everything You Need to Know to Get Started"](https://snipcart.com/blog/jamstack) de Snipcart.')

Avec les services de Netlify, le déploiement n’a jamais été aussi simple.

<!-- more -->

## Compiler et pousser les modifications sur GitHub

Maintenant que le contenu est prêt :

1. Lancer le terminal avec `CTRL+ù`dans Visual Studio Code, s’il n’est pas déjà ouvert.
2. Lancer la commande suivante :

```sh
npm run docs:build
```

3. Si vous avez une erreur, [contactez-moi](../../../page/contactez-moi/README.md) en fournissant l’URL du dépôt. Sinon, continuez avec :

```sh
git add -A && git commit "pousser le contenu sur GitHub" && git push
```

## Commande du domaine personnalisé

Sauf si vous avez besoin de mon aide, le seul coût sera celui du domaine personnalisé. Ex : `mon-super-domaine.fr`.

Je ne décris pas les étapes ici. Je vous invite à faire une petite recherche Google. Pour mes sites web, [j’utilise OVH](https://www.ovhcloud.com/fr/domains/).

### Mettre à jour la zone DNS chez votre registar de domaines.

Une fois que le domaine est provisionné, il faut paramétrer Netlify pour que le site web pointe sur le domaine.

Pour un domaine de base, il faut préalable supprimer les entrées DNS `A`sur le domaine `mon-super-domaine.fr`et `wwww.mon-super-domaine.fr`.

:::warning Sur OVH…
J’ai eu une fois un temps de propagation de la suppression de l’entrée `A`sur le sous-domaine `www` qui a pris plus des dizaines de minutes.

Soyez patients ;)
:::

## Déployer le site sur Netlify

Rendez-vous sur [app.netlify.com](https://app.netlify.com) en vous connectant avec votre compte GitHub.

![Connexion netlify via github sso](./images/connexion-netlify-via-github-sso.jpg 'Crédits: image extraite du site Netlify')

Vous devez alors autoriser l’accès à votre compte par Netlify (pour lire la liste des dépôts).

Une fois connecté, sélectionnez `Add new site` puis `Import an existing project` :

![Ajouter un site](./images/ajouter-un-site.jpg 'Crédits: image extraite du site Netlify')

Sélectionnez `GitHub` :

![Sélectionner GitHub](./images/selectionner-github.jpg 'Crédits: image extraite du site Netlify')

Rechercher et sélectionner votre dépôt :

![Rechercher et sélectionner votre dépôt](./images/recherche-et-selectionner-votre-depôt.jpg 'Crédits: image extraite du site Netlify')

Configurez le déploiement en modifiant :

- `Base directory` par `docs/.vuepress`.
- `Build command` par `yarn && npm run docs:build`.
- `Publish directory` en ajouter `dist` à la valeur.

![Configurer le déploiement](./images/configurer-le-deploiement.jpg 'Crédits: image extraite du site Netlify')

Le déploiement ne devrait pas prendre plus de 2 minutes.

En attendant, allez dans `Site settings` et cliquez `Change site name`.

La valeur par défaut est aléatoire. Je mets en général une valeur plus sympa.

Dans mon cas, ce sera `mon-site-demo-tutoriel`. Le site est alors disponible sur `https://mon-site-demo-tutoriel.netlify.app`.

## Mettre à jour l’application sur Netlify avec un domaine personnalisé

Une fois la zone DNS prête,

- ajouter le domaine dans Netlify en sélectionnant votre site depuis [app.netlify.com](https://app.netlify.com), puis en cliquant `Site settings` puis `Domain management`.
  - dans`Production domains` , cliquer `Add domain` et confirmer l’ajout sans passer par `Netlify DNS`

:::warning Netlify DNS

Vous verrez sûrement l’alerte suivante :

> .fr domains can’t be registered through Netlify.
> You can still add mon-site.fr to your Netlify site if you already own the domain. Select Add domain to add it to your site. You can configure Netlify DNS for this domain later.

Cliquer `Add domain` ou `Add subdomain` quand même.
:::

- une fois sur l’écran ci-dessous :
  ![Écran suite à l’ajout du domaine personnalisé](./images/ecran-suite-a-lajout-du-domaine-personnalise.jpg 'Crédits: image extraite du site Netlify')

- Cliquez `Awaiting External DNS` et suivez les instructions :

  - pour un domaine _racine_,
    - ajouter l’entrée `A` en utilisant l’adresse IP du loadbalancer que Netlify vous fournit.
    - ajouter l’entrée `CNAME` en utilisant le DNS que Netlify vous fournit.
      ![Instructions de Netlify pour une configuration par entrée CNAME](./images/instructions-de-netlify-pour-une-configuration-par-entree-cname.jpg 'Instructions de Netlify pour une configuration par entrée CNAME. Crédits: image extraite du site Netlify')
  - pour un sous-domaine,
    - vous aurez seulement l’entrée `CNAME` à ajouter.

- Rendez-vous sur votre registar de domaines (ex : OVH) et dans la section`Domain > mon-site.fr > DNS Zone` , sélectionner `Ajouter un entrée` et le type selon votre besoin.

  - pour une entrée`CNAME` , ça ressemble à ceci :

  ![Choix du type d’entrée DNS](./images/choix-du-type-dentree-dns.jpg 'Choix du type d’entrée DNS. Crédits: image extraite du site OVGCloud')

  ![Configurer l’entrée DNS](./images/configurer-lentree-dns.jpg 'Crédits: image extraite du site OVGCloud')

  ![Confirmer l’ajout de l’entrée DNS](./images/confirmer-lajout-de-lentree-dns.jpg 'Confirmer l’ajout de l’entrée DNS. Crédits: image extraite du site OVGCloud')

  - confirmez et attendez quelques minutes (voire plus si votre registar de domaine est lent)
  - rafraichissez la page sur Netlify : quand tout est bon, le message `Awaiting external DNS` doit avoir disparu.

  ![Netlify a bien détecté la mise à jour DNS](./images/netlify-a-bien-detecte-la-mise-a-jour-dns.jpg 'Netlify a bien détecté la mise à jour DNS. Crédits: image extraite du site Netlify')

  - Netlify provisionne ensuite un certificat _Let's encrypt_ automatiquement pour vous.

![Certificat Let’s Encrypt en cours de provisionnement](./images/certificat-lets-encrypt-en-cours-de-provisionnement.jpg)

:::warning Temps de provisionnement du certificat HTTPS
Cela prend un peu plus de temps sur un domaine racine qu’un sous-domaine seulement.
:::

Une fois que le certificat est déployé, vous pourrez accéder à votre site web sécurisé ! Ex : `https://mon-super-domaine.fr`.

![Certificat Let’s Encrypt est actif. Votre site web est sécurisé.](./images/certificat-lets-encrypt-est-actif-votre-site-web-est-securise.jpg 'Certificat Let’s Encrypt est actif. Votre site web est sécurisé ! Crédits: image extraite du site Netlify')

Si vous souhaitez éditer le contenu depuis n’importe quel PC, cela est possible avec NetlifyCMS. Je vous explique [comment l’activer sur votre site web](../activer-netlifycms-sur-son-site-web/README.md).

## Limitations

Pour un blog de très grande taille (plus de 400 pages générées incluant les pseudos liens si vous utilisez les catégories et les tags), l’hébergement sur Netlify risque d’être limite.

Toutefois, l’astuce serait de déployer le dossier `dist` généré sur votre PC et de le pousser sur GitHub ensuite. Cela donne le même résultat.

Je ne l’ai toutefois pas encore testé.
