---
title: "Déployer une API REST Python sur Microsoft Azure"
description: "C'est bien de créer une application. C'est encore mieux de la déployer et de voir qu'elle fonctionne. Voyons comment faire cela avec Microsoft Azure."
image: images/2024-07-24-logos-ms-azure-and-python.jpeg
imageAlt: "Logos de Microsoft Azure et de Python"
date: 2024-08-12
categories:
  - Web Development
tags:
  - Python
---

## Introduction

Au cours des derniers mois, j’ai commencé mon parcours de programmation avec Python, en construisant une API REST qui utilise Flask, SQLAlchemy, Alembic et Docker.

J’ai eu l’opportunité au travail de construire une autre API et à un moment donné, il était temps de déployer le MVP sur Microsoft Azure.

Ci-dessous, vous trouverez les étapes détaillées sans image, car Microsoft déplace souvent les choses et une capture d’écran devient rapidement obsolète…

Je laisse les noms des lames et des onglets en anglais, car j’ai écrit l’article anglais en premier. Ils peuvent également changer, alors soyez patient et regardez bien autour de vous ;)

Pour le nommage des ressources, vous pouvez utiliser le [guide officiel](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations) à ce sujet.

## Configuration du coffre-fort

### Créer le _Key Vault_ (coffre-fort de clés)

Via la recherche sur le portail Azure, créez une ressource _Key Vault_ avec :

- Onglet _Basic_ : son nom doit être `kv-[project name]-[env]`.
- Onglet _Access config_ : on ne change rien.
- Onglet _Networking_ : on ne change rien.

### Contrôler de l’accès à la _Key Vault_

Sous le _Contrôle d’accès (IAM)_, vous devrez donner le _Role permission_ suivant :

- ajouter une attribution de rôle _Key Vault Administrator_ pour pouvoir définir les secrets.

{{< blockcontainer jli-notice-tip "Astuce : ajoutez un membre en tapant l'email complet.">}}

{{< /blockcontainer >}}

### Configurer le _Key Vault_

Une fois créé, dans la lame _Objets_, créez chaque secret manuellement.

Le nom de la clé doit être **kebab-case.**

## Configuration du registre des conteneurs

### Créer le _Container Registry_ (registre des conteneurs ou IC)

Dans la barre de recherche, tapez « *Container Registry* » et sélectionnez le type de ressource.

Lors de la configuration, utilisez le plan _Basic_ pour des prix plus bas.

{{< blockcontainer jli-notice-note "Note">}}

Le pipeline Azure _DevOps_ créera le référentiel lorsque l’IC sera en place.

{{< /blockcontainer >}}

### Configurer le _Container Registry_

Sous le _Access Control (IAM)_, vous devrez donner les _Role permissions_ suivants :

- _ACR Registry Catalog Lister_
- _AcrPull_
- _AcrPush_

Ces autorisations permettent :

- de lister les images dans le registre lorsque vous les parcourez sur le portail Azure.
- de configurer le pipeline Azure pour pouvoir dire au _DevOps_ de pousser les images dans le registre.
- au _Container App_, que nous créerons plus tard, de lire les images.

## Pipeline Azure

### Prérequis pour le Pipeline

Dans Azure, vous devez ajouter à votre compte utilisateur le **Application Administrator Role** dans _Azure AD_ ou _Microsoft Entra ID_ pour permettre la création du pipeline dans _Azure DevOps_ (ci-après _DevOps_ pour plus succinct).

Si vous n’êtes pas administrateur, vous devrez demander à un administrateur de vous accorder cette permission. Ce n’est pas quelque chose que vous pouvez recevoir comme les autorisations basées sur les rôles.

Vous aurez également besoin d’un _DevOps_ où votre projet réside. L’article ne détaille pas la création du _DevOps_ et suppose que vous en avez un et que vous avez créé un dépôt Git pour stocker le code de votre application.

### Configurer le pipeline

Allez sur le _DevOps_ puis la lame _Pipelines > Pipelines_.

Ensuite,

- dans l’onglet _Connect_, sélectionnez _Azure Repositories_.
- sur l’onglet _Select_, sélectionner le référentiel cible.
- sur l’onglet _Configure_, sélectionnez le conteneur de registre créé ci-dessus.

Une fois que vous avez confirmé la création du pipeline, ajoutez le tag `latest` dans le fichier de configuration généré afin que vous puissiez sélectionner ce tag sur le _Container App_ plus tard.

Sinon, vous devrez mettre à jour l’image à déployer dans le _Container App_ après chaque nouvelle version.

Aussi, dans le fichier `azure-pipelines.yml` généré, vous avez besoin de réaliser quelques modifications pour préparer le déploiement de l’image Docker vers l’App_Container :

- ajouter une variable `projectPath` pour définir le chemin du projet :

```yaml
variables:
  # Connexion au service de registre des conteneurs établie lors de la création du pipeline
  dockerRegistryServiceConnection: "e5979aa7-383a-4ddb-9aff-6e531f3d023a"
  imageRepository: "my-app"
  containerRegistry: "mycontainerregistry.azurecr.io"
  dockerfilePath: "$(Build.SourcesDirectory)/docker/Dockerfile"
  projectPath: "$(Build.SourcesDirectory)"
  tag: "$(Build.BuildId)"
```

- et définir spécifiquement le `buildContext` pour utiliser `projectPath` :

```yaml
inputs:
command: buildAndPush
repository: $(imageRepository)
dockerfile: $(dockerfilePath)
buildContext: $(projectPath)
containerRegistry: $(dockerRegistryServiceConnection)
```

Pourquoi ? Si vous avez structuré votre projet avec un `Dockerfile` dans un sous-dossier `docker`, vous devez effectuer les étapes ci-dessus pour éviter une erreur sur `docker build`.

```yaml
project
│   config.py
│   requirements.txt
│   run.py
├── app
│   └── some files ...
└── docker
│   └── Dockerfile
│   └── docker-compose.yml
└──
```

## Configuration du _Storage Account_ et des _File Share_

### Créer le _Storage Account_

Créez bien le _Storage Account_ dans la même zone que toutes les autres ressources.

Il n’y a pas d’instructions spécifiques pour créer la ressource à l’exception du nom qui commence par `st` et qui n’autorise pas les traits d’union.

Retournez au guide cité dans l’introduction.

### Configurer le _Storage Account_

Sous la lame _Data Storage > File shares_,

- Créer un _File share_. Dans l’application que nous construisions, nous avions besoin de stocker le fichier de la base de données SQLLite. Activez une sauvegarde si nécessaire.
- Créez un autre _File share_ pour stocker les traces applicatives. Pas besoin de sauvegardes.
- Créer un autre _File share_ pour les fichiers de configuration et autres fichiers de données que vous devez pouvoir modifier sans mettre à jour le code.

Je nomme mes _File shares_ de la façon suivante : `fileshare-[designation]-[project]-[env]` où `[designation]` correspond soit `db` pour la base de données, soit `logs` ou `json` pour les fichiers que j’ai besoin d’éditer à la volée.

Vous devrez ensuite lier le _Container app environment_ et le _Container App_ à chaque _File share_.

## Configuration du _Container App_

### Prérequis pour le _Container App_

Vous avez besoin de :

- Un pipeline existe dans le _DevOps_ avec une image prête.
- Vous avez besoin d’un rôle _Contributor role_ sur l’abonnement Azure pour votre compte d’utilisateur. Par conséquent, vous devrez peut-être fournir les instructions de création à quelqu’un ayant cette permission si vous ne pouvez pas recevoir ce droit selon la politique de votre organisation.

### Créer le _Container App_

Dans la barre de recherche principale, tapez _Container App_ et sélectionnez le type de ressource.

Dans l’onglet _Basics_,

- Configurer le groupe de ressources, le nom et la région
- Personnaliser le _Container Apps Environment_ (qui peut contenir de nombreux _Container Apps_) en en créant un nouveau.
  - Cliquez sur _New_
  - Ensuite, dans l’onglet _Basics_, donnez un nom selon la convention dans l’introduction et laissez le reste des options avec les valeurs par défaut.
  - Ensuite, dans l’onglet _Monitoring_, désactivez les logs. L’application Container fournit un flux de logs de console qui peut être utile. Votre application devrait stocker les logs de fichiers dans le _File share_ dédié.
  - Laissez les onglets _Workload profiles_ et _Networking_ tels quels.

Dans l’onglet _Container_,

- Sélectionnez la source d’image pour être _Azure Container Registry_ (ACR).
- Sélectionnez l’ACR que vous avez créé précédemment.
- Sélectionnez l’image.
- Sélectionnez le tag `latest` de l’image.
- Ajustez le CPU et la mémoire à vos besoins.
- Vous pouvez configurer les variables d’environnement maintenant, mais nous verrons cela à l’étape _Configurer_ plus loin. De toute façon, il est fort probable que vous ayez besoin de les ajuster au cours de la durée de vie de votre application.

Dans l’onglet _Bindings_, laissez-le vide.

Dans l’onglet _Ingress_, vous devrez configurer la partie TCP pour que l’API REST soit accessible via HTTP :

- Cochez la case _Ingress_.
- Sélectionnez _Ingress Traffic_ comme étant _Accepting traffic from anywhere_.
- Sélectionnez HTTP pour le _Ingress type_.
- Laisser le mode de certificat client par défaut (aucune option sélectionnée)
- Définir le _Target port_ à 5000, le port par défaut de l’application Flask que nous déployons.
- Confirmer la création dans l’onglet _Review + create_.

Note : si l’examen de la configuration échoue avec l’erreur suivante, cela signifie probablement que vous n’avez pas la permission de créer la ressource :

> Le client `youraccount@example.com` avec l’objet id « xxx » n’a pas l’autorisation d’effectuer l’action « **Microsoft.App/register/action** » sur l’étendue « /subscriptions/yyy » ou l’étendue n’est pas valide. Si l’accès a été récemment accordé, veuillez rafraîchir vos informations d’identification. (Code : AuthorizationFailed) (Code : AuthorizationFailed)

### Configurer le _Container Apps Environment_

Une fois qu’Azure a créé le _Container Apps Environment_, allez directement dedans pour y lier les _File shares_.

Pour ce faire, récupérez le nom et la clé d’accès sous le _Storage account_.

- Allez dans _Security + networking_ et sélectionnez la lame _Access keys_.
- Copier

  - l’une des clés.
  - le nom du _Storage account_.
  - les noms des _File shares_ créés précédemment (sous la lame _File shares_).

De retour sur _Container Apps Environment_ :

- Se rendre dans _Settings_ et dans la lame _Azure Files_.
- Définisser le nom avec ce modèle : `azure-files-[designation]` (`designation` serait `db`, `logs`, etc.)
- AJouter une nouvelle entrée et remplissez le champ en collant les valeurs copiées précédemment du _Storage account_.
- Définisser le _Access mode_ sur _Read/Write_ ou _Read only_ (je le fais pour les fichiers que l’application ne doit pas écrire).
- Répéter l’opération pour tous les _File shares_ que l’application _Container App_ utilise.

À quoi cela va-t-il servir ? Dans l’API REST, vous pouvez utiliser une base de données SQLLite lorsque la base de données est un fichier et que vous devez la conserver.

Il en va de même pour l’enregistrement des fichiers.

Vous pourriez écrire les fichiers dans l’image du conteneur. Mais, lorsqu’il redémarre lors d’un nouveau déploiement, vous perdrez les données…

### Configurer les paramètres de déploiement du _Container App_

Ensuite, rendez-vous dans _Container App_ pour configurer les paramètres de déploiement.

Pour ce faire, sélectionnez la lame _Revisions and replicas_ sous _Application_ et cliquez sur _Creation new revision_.

Nous allons configurer l’onglet _Container_ en dernier. Vous comprendrez bientôt pourquoi.

Allez dans l’onglet _Scale_ et ajustez les _Min replicas_ et _Max replicas_ à utiliser en fonction d’une règle d’échelle que vous définissez. Je n’ai pas utilisé de règle dans mon scénario, je vais donc sauter cette étape. J’ai simplement fixé les valeurs min. et max. à 1.

Dans l’onglet _Volumes_,

- sélectionnez _Azure file volume_ comme _Volume type_.
- Donnez un nom au volume. Par exemple, je nommerais le volume des bases de données `databases`. Vous aurez besoin d’un volume pour chaque partage de fichiers que vous avez créé.

**Note importante : le nom du volume** doit correspondre au nom du volume que vous créez dans le fichier Docker. Par exemple, le nom du volume correspond à ce qui suit la valeur `WORKDIR` dans les commandes `VOLUME` ci-dessous :

```yaml
# Définir le répertoire de travail de l'image docker
WORKDIR /project-container

# Créer des points de montage avec des chemins d'accès absolus
VOLUME /project-container/databases
VOLUME /project-container/logs
```

- Sélectionner le _File share_ cible (qui est en fait la valeur du _Azure file_ que vous avez créée sous _Container App Environment_).
- Définir les options de montage à `nobrl` si le volume contient un fichier de base de données SQLLite. Pourquoi ? Le problème est que Docker monte le volume en tant que système de fichiers CIFS qui ne peut pas gérer le verrou SQLite3. Voir [cette réponse](https://stackoverflow.com/a/54051016) et [cette réponse](https://stackoverflow.com/a/61077705) sur Stackoverflow. La [documentation Microsoft](https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/storage/mountoptions-settings-azure-files#other-useful-settings) le confirme également.
- Assurez-vous de cliquer sur le bouton _Add_ avant de continuer.

Retournez à l’onglet _Container_ pour ajouter les volumes basés sur les partages de fichiers que vous avez créés.

Dans notre exemple, nous devons :

- laisser la section _Détails de la révision_ telle quelle.
- Dans la section _Image du conteneur_, cliquez sur l’image existante.

Un volet droit s’ouvre :

- sous l’onglet _Basics_, vous trouverez les détails que vous avez spécifiés lors de la création de la ressource _Container App_. C’est ici que vous pouvez ajouter vos variables d’environnement (descendre tout en bas). Nous y reviendrons lorsque nous aurons lié le _Key Vault_ au _Container App_ pour en extraire les valeurs secrètes.
- sous les _Health probes_, laisser tel quel.
- sous l’onglet _Volumes mounts_, ajoutez tous les volumes mounts dont vous avez besoin :
  - le nom du volume sera égal au nom que vous avez défini ci-dessus dans l’onglet _Volumes_.
  - Le chemin de montage doit être la même valeur que celle que vous avez définie dans le _Dockerfile_ comme je l’ai expliqué ci-dessus.
  - laissez le _Sub path_ vide.
- Cliquez sur _Save_
- Assurez-vous de cliquer sur _Create_ pour lancer le déploiement.

Sous la lame _Revisions and replicas_, vous devriez voir, au bout de quelques minutes, si le déploiement s’est déroulé avec succès lorsque le _Running status_ est _Running_ et qu’une coche verte est affichée.

Si ce n’est pas le cas, cliquez sur le lien de révision dans la première colonne et cliquez sur _Console log stream_.

Par moment, les journaux n’apparaissent pas toujours, alors essayez plusieurs fois en rechargeant la page. La consistance d’affiche du flux des traces dans la console est très aléatoire… Parfois, j’ai vu des journaux, et à d’autres moments, il n’y avait rien.

### Lier le _Key Vault_ au _Container App_

Il s’agit d’une condition préalable à la configuration des variables d’environnement.

Tout d’abord, sous la lame _Identity_ de la ressource _Container App_, activez l’identité assignée par le système en basculant le statut sur _On_.

Vous avez besoin de cela pour pouvoir fournir l’identité du _Container App_ pour lui assigner une permission basée sur un rôle dans l’IAM du _Key Vault_.

Ensuite, allez dans la ressource _Key Vault_ et naviguez jusqu’à la lame _Access control (IAM)_.

Cliquez sur _Add_ puis sur _Add role assignment_.

Sous l’onglet _Role_, recherchez _Key Vault Secrets User_ et sélectionnez-le.

Sous l’onglet _Members_, sélectionnez _Managed identity_ puis :

- Sélectionnez _Managed identity_.
- Cliquez sur _Select members_.
- Dans le volet de droite qui s’ouvre,
  - Sélectionnez votre abonnement,
  - Sélectionnez l’_Managed identity_ : vous devriez avoir une valeur appelée _Container App (1)_ (`1` est le nombre de _Container App_ configuré avec une identité système).
  - Sélectionnez la liste des membres cibles sous _Select_. Elle devrait afficher un membre avec le nom de votre _Container App_.
  - Assurez-vous de cliquer sur _Select_.
  - Terminez par _Review + assign_.

### Configurer les variables d’environnement secrètes du _Container App_

Pour commencer cette section, vous devrez copier la valeur _Vault URI_ qui se trouve sous la lame _Overview_ de la ressource _Key Vault_.

Notez également les noms des secrets créés.

Préparez une URL pour chacun d’entre eux avec le format suivant : `{vault_uri}/secrets/{nom_du_secret}`.

De retour à l’application _Container App_, naviguez jusqu’à la lame _Settings_ et _Secrets_.

À partir de là, ajoutez votre secret depuis le _Key Vault_ en cliquant sur le bouton _Add_. Ensuite :

- Saisissez la valeur _Key_ avec le nom du secret que vous ajoutez en la préfixant `kv_`.
- Définissez le _Type_ sur _Référence au coffre-fort de clés_.
- définissez la valeur _Value_ sur l’URL correspondante que vous avez préparée.
- Cliquez sur _Add_ et attendez que le secret apparaisse.

{{< blockcontainer jli-notice-warning "Attention">}}

Si le secret n’apparaît pas, même si l’Azure Portal donne un retour positif dans les notifications, le problème est que vous n’avez pas terminé correctement l’étape « *Linking the Key Vault and the Container App* ».

{{< /blockcontainer >}}

### Configurer les variables d’environnement

Une fois que vous avez terminé, créez une nouvelle révision à partir de la lame _Applications > Revisions and replicas_.

Sélectionnez votre image de conteneur et descendez jusqu’à la section _Environment Variables_ dans le panneau qui s’est ouvert à droite

Premièrement, ajoutez les variables qui ne sont pas secrètes en utilisant la _Source_ égale à _Manual entry_.

Deuxièmement, ajoutez la variable dont les valeurs proviennent du coffre-fort de la clé en utilisant la _Source_ égale à _Reference a secret_. Sélectionnez ensuite comme _Valeur_ la référence secrète correspondante.

Assurez-vous de cliquer sur _Save_ et de créer la révision.

Vous avez terminé la configuration ! 🏆

## Tester l’API

En utilisant Visual Studio Code et l’extension REST Client, vous pouvez créer un petit fichier pour tester vos points d’extrémité :

```rest
### Créer un événement
POST https://capp-myproject-prod.cravesea-7fd7d8d0b6.myregion.azurecontainerapps.io/event
Content-Type : application/json

{
  "id" : 1234
}

### GET tous les événements
GET https://capp-myproject-prod.cravesea-7fd7d8d0b6.myregion.azurecontainerapps.io/event/all
Content-Type : application/json
```

## Résoudre des problèmes

### Impossible d’appeler l’application REST API même si le déploiement est réussi

Si vous obtenez le message suivant lorsque vous appelez votre application alors que le déploiement est réussi et qu’Azure vous indique qu’il est en cours d’exécution :

```text
azure upstream connect error or disconnect/reset before headers. retried and the latest reset reason : remote connection failure, transport failure reason : delayed connect error : 111
```

Assurez-vous d’utiliser un serveur de niveau de production, et non le serveur Flask par défaut.

Pour corriger cela, vous devez :

- installer le paquet `gunicorn` : c’est un serveur web de niveau production.
- configurer le `Dockerfile` avec la commande suivante

  ```docker
  # Commande d'exécution pour démarrer le serveur
  CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
  ```

Pour exécuter la commande ci-dessus, vous avez besoin d’un fichier `run.py` à la racine qui contient quelque chose comme ceci :

```python
import os

from app import MyApp

config_name = os.getenv("FLASK_CONFIG") or "default"
app = MyApp.create_app(config_name)

if __name__ == '__main__' :
    app.run(host="0.0.0.0", port=5000)
```

## Conclusion

Si vous avez lu jusqu’ici, bravo et merci !

Je continuerai à partager mes expériences Python et Azure au fur et à mesure que je travaille avec eux.

{{< blockcontainer jli-notice-tip "Follow me">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Les logos des images d’en-tête proviennent de WorldVectorLogo et SVGRepo. Vous pouvez trouver les images originales [ici](https://worldvectorlogo.com/logo/azure-2) et [là](https://worldvectorlogo.com/logo/python-4) : J’ai créé l’image avec [Sketchpad](https://sketch.io/sketchpad/) de Sketch.io.
