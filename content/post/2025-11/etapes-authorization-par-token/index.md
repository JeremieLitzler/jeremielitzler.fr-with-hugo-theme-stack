---
title: "Les étapes de l'authentification par jeton"
description: "L'authentification par jeton est une méthode permettant de vérifier l'identité des utilisateurs à l'aide d'un jeton. Voici une explication simple."
image: 2025-06-25-a-person-signing-a-document.jpg
imageAlt: Une personne signant un document.
date: 2025-11-12
categories:
  - Développement web
tags:
  - Sécurité
  - OAuth 2.0
---

## Explication en quelques étapes simples

**Lors de la connexion (1),** l’utilisateur envoie ses identifiants (2), tels que son nom d’utilisateur et son mot de passe, au serveur.

**La délivrance du jeton (3)** suit et le serveur vérifie les identifiants. S’ils sont corrects, il génère un jeton, appelé jeton d’accès, et le renvoie à l’utilisateur.

**À l’aide du jeton d’accès** renvoyé par le serveur, l’utilisateur inclut ce jeton dans l’en-tête de ses requêtes (4) pour accéder aux ressources protégées.

**Le serveur vérifie** le jeton d’accès (5) à chaque requête. Si le jeton est valide, le serveur traite la requête (6). Sinon, la requête est refusée (HTTP 403) (7).

### Diagramme de séquence

```plaintext
App Utilisateur                                           Serveur
      |                                                      |
      |--(1)--- Fournit les identifiants ------------------->|
      |                                                      |
      |                                (2) Vérifie les identifiants
      |                                                      |
      |<--(3)--- jeton d'accès ------------------------------|
      |                                                      |
      |--(4)--- Envoie une requête avec le jeton d'accès -->|
      |                                                      |
      |                    (5) Vérifie le jeton et traite la requête
      |                                                      |
      |<--(6)--- Retourne le résultat de la requête ---------|
      |                       ou                             |
      |<--(7)--- Retourne HTTP 403 --------------------------|
      |                                                      |
```

De cette façon, l’utilisateur n’a pas besoin d’envoyer son nom d’utilisateur et son mot de passe à chaque requête, mais seulement le jeton, ce qui rend le processus plus sûr et plus efficace.

## Serveur d’autorisation vs serveur de ressources

La séparation du serveur d’autorisation et du serveur de ressources est une décision de conception clé dans OAuth 2.0, qui permet à chaque composant d’être mis à l’échelle indépendamment pour les raisons suivantes :

- Avec les **applications d’entreprise/à grande échelle**, nous pouvons avoir plusieurs serveurs de ressources (comme les services de Google avec des dizaines de serveurs de ressources). Ces serveurs partagent le même serveur d’autorisation (voir cette page de documentation [OAuth](https://www.oauth.com/oauth2-servers/the-resource-server/) sur le sujet).
- Pour l’**extensibilité** d’un système, en construisant le serveur d’autorisation comme un composant autonome, vous pouvez éviter de partager une base de données avec les serveurs API. Cela facilite la mise à l’échelle indépendante des serveurs API (voir l’autre page de documentation [OAuth](https://www.oauth.com/oauth2-servers/differences-between-oauth-1-2/separation-of-roles/) sur le sujet).
- Pour assurer la **sécurité et l’isolation**, il est préférable d’isoler le serveur d’authentification dans son propre domaine fonctionnel et sa propre base de code. Si les modifications sont apportées à une application, elles n'auront pas d’incidence sur le serveur d’authentification utilisé par d’autres applications (voir [ce fil de discussion sur StackExchange](https://security.stackexchange.com/questions/128646/does-the-auth-server-have-to-be-separate-from-the-resource-server-when-using-oau) pour plus de détails).

Par conséquent, le diagramme de séquence ressemblerait à ceci :

```plaintext
App Utilisateur           Serveur d'Autorisation         Serveur de Ressources
   |                              |                            |
   |--(1)--- Envoie les        -->|                            |
   |         identifiants         |                            |
   |                              |                            |
   |                     (2) Vérifie les identifiants          |
   |                              |                            |
   |<--(3)--- Retourne le      ---|                            |
   |         jeton d'accès        |                            |
   |         + jeton de           |                            |
   |         rafraîchissement     |                            |
   |         si nécessaire        |                            |
   |                              |                            |
   |--(4)--- Envoie une requête avec le jeton ---------------->|
   |                              |                            |
   |                              |               (5) Valide le jeton
   |                              |                 avec le serveur
   |                              |                        d'auth
   |                              |                            |
   |                              |<--(6)--- Vérifie le     ---|
   |                              |         jeton              |
   |                              |                            |
   |                              |                  (7) Contrôle le
   |                              |                         jeton
   |                              |                            |
   |                              |---(8)--- Jeton valide ? -->|
   |                              |                            |
   |                              |               (9) Autorise la
   |                              |                      requête
   |                              |                            |
   |<--(10)-- Retourne la ressource ou HTTP 403 ---------------|
   |                              |                            |
```

## Quelles sont les bonnes pratiques en matière d’expiration dans l’authentification par jeton ?

La mise en œuvre de l’expiration dans l’authentification par jeton est cruciale pour maintenir la sécurité. Voici quelques bonnes pratiques :

### 1. **Définir des délais d’expiration appropriés**

Une solution consiste à générer des **jetons à courte durée de vie**. Définissez les jetons pour qu’ils expirent dans un court laps de temps (par exemple, quelques minutes à quelques heures) afin de limiter les possibilités d’attaque si un jeton est compromis.

Mais la technique la plus utilisée est celle des **jetons de rafraichissement**. Les jetons de rafraichissement ont une durée d’expiration plus longue (par exemple, de quelques jours à quelques semaines). Ils peuvent être utilisés pour obtenir de nouveaux jetons à courte durée de vie sans que l’utilisateur ait à s’authentifier à nouveau. Cela ajoutera quelques étapes à la séquence ci-dessus.

En général, un point de terminaison spécifique est fourni par le serveur d’autorisation.

Voici les étapes supplémentaires de la séquence :

```plaintext
App Utilisateur             Serveur d'Autorisation         Serveur de Ressources
   |                                |                            |
   |<--(10)-- Retourne HTTP 401 ---------------------------------|
   |           (jeton expiré)       |                            |
   |                                |                            |
   |--(11)-- Envoie le jeton de  -->|                            |
   |         rafraîchissement       |                            |
   |                                |                            |
   |                     (12) Vérifie le jeton                   |
   |                       de rafraîchissement                   |
   |                                |                            |
   |<--(13)-- Retourne le nouveau---|                            |
   |           jeton d'accès        |                            |
   |           (+ optionnel nouveau |                            |
   |           jeton de             |                            |
   |           rafraîchissement)    |                            |
   |                                |                            |
   |----(14)-- Réessaie la requête avec le nouveau jeton ------->|
   |                                |                            |
   |                                |               (15) Valide le
   |                                |                 nouveau jeton
   |                                |                            |
   |<----(16)-- Retourne la      --------------------------------|
   |            ressource           |                            |
   |                                |                            |
```

À l’étape 10, le serveur de ressources peut renvoyer une réponse HTTP 401 (non autorisé) au lieu d’une réponse 403 lorsque le jeton est expiré.

Les étapes 11 à 13 se déroulent ensuite comme suit : l’application utilisateur demande un nouveau jeton d’accès au serveur d’autorisation à l’aide du jeton de rafraichissement.

Et aux étapes 14 à 16, l’application utilisateur réitère la demande initiale avec un nouveau jeton d’accès (et éventuellement un nouveau jeton de rafraichissement pour prolonger la session utilisateur).

### 2. **Révocation des jetons**

Il est important de mettre en place un mécanisme permettant de révoquer les jetons avant leur expiration dans des cas tels que les changements de mot de passe, le piratage de compte ou la déconnexion de l’utilisateur.

De plus, la mise en place d’une liste noire ou l’utilisation d’un identifiant de jeton pouvant être vérifié par rapport à une liste de jetons révoqués permet d’éviter la falsification des jetons.

### 3. **Utilisation d’un stockage sécurisé**

Stockez les jetons de manière sécurisée du côté client, généralement dans des cookies `HTTP-only` ou dans des mécanismes de stockage sécurisés fournis par la plateforme (tels que Keychain pour iOS ou Keystore pour Android).

Évitez de stocker les jetons dans le stockage local ou le stockage de session, où ils sont plus vulnérables aux attaques XSS.

### 4. **Faites tourner les secrets**

Faites tourner périodiquement les clés secrètes utilisées pour signer les jetons. Mettez en œuvre une stratégie de rotation des clés afin de garantir que les jetons puissent être validés pendant et après la période de transition.

### 5. **Utilisez des algorithmes de signature puissants**

Utilisez des algorithmes cryptographiques, comme le RS256 ou HS256, pour signer les jetons afin d’empêcher toute falsification.

### 6. **Prendre en compte les audiences et les portées**

Incluez `aud` (audience) et `scope` (portée) pour limiter l’utilisation du jeton à des applications ou des opérations spécifiques.

### 7. **Mettre en œuvre une expiration glissante**

Vous pouvez également mettre en œuvre une expiration glissante, qui prolonge la durée de vie du jeton à chaque demande validée. Cela permet de maintenir les sessions actives tout en minimisant le risque de vol de jetons.

### 8. **Sensibiliser les utilisateurs**

Enfin, sensibilisez les utilisateurs aux bonnes pratiques en matière de gestion des jetons. Par exemple en leur expliquant qu’ils ne doivent pas les partager et en leur faisant comprendre l’importance de se déconnecter, en particulier sur les appareils partagés ou publics.

### Remarque finale concernant le jeton de rafraichissement

Un jeton de rafraichissement est un jeton à longue durée de vie qui sert à obtenir un nouveau jeton d’accès à courte durée de vie lorsque celui en cours expire.

Les jetons de rafraichissement doivent être stockés et protégés de manière sécurisée, avec plus de soin que les jetons d’accès, car ils ont une longue durée de vie.

Si le jeton de rafraichissement est expiré, le client ne pourra pas obtenir un nouveau jeton d’accès à l’aide du jeton de rafraichissement. Cette situation nécessite généralement que l’utilisateur se réauthentifie en fournissant à nouveau ses informations d’identification.

## Conclusion

Nous reviendrons plus en détail sur les meilleures pratiques énumérées ci-dessus. Pour l’instant, vous devriez avoir une bonne compréhension des étapes de l’authentification par jeton.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
