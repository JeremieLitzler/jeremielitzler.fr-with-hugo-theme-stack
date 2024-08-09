---
title: "Déployer une API REST Python sur Microsoft Azure"
description: "C'est bien de créer une application. C'est encore mieux de la déployer et de voir qu'elle fonctionne. Voyons comment faire cela avec Microsoft Azure."
image: images/2024-07-24-logos-ms-azure-and-python.jpeg
imageAlt: "Logos de Microsoft Azure et de Python"
date: 2024-08-09
categories:
  - Web Development
tags:
  - Python
draft: true
---

## Introduction

Au cours des derniers mois, j'ai commencé mon parcours de programmation avec Python, en construisant une API REST qui utilise Flask, SQLAlchemy, Alembic et Docker.

J'ai eu l'opportunité au travail de construire une autre API et à un moment donné, il était temps de déployer le MVP sur Microsoft Azure.

Ci-dessous, vous trouverez les étapes détaillées sans image car Microsoft déplace souvent les choses et une capture d'écran devient rapidement obsolète...

Je laisse les noms des lames et des onglets en anglais, car j'ai écris l'article anglais en premier. Ils peuvent également changer, alors soyez patient et regardez bien autour de vous ;)

Pour le nommage des ressources, vous pouvez utiliser le [guide officiel](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations) à ce sujet.

## Configuration du coffre-fort

### Créer le _Key Vault_ (coffre-fort de clés)

Via la recherche sur le portail Azure, créez une ressource _Key Vault_ avec :

- Onglet _Basic_ : son nom doit être `kv-[project name]-[env]`.
- Onglet _Access config_ : on ne change rien.
- Onglet _Networking_ : on ne change rien.

### Contrôler de l'accès à la _Key Vault_

Sous le _Contrôle d'accès (IAM)_, vous devrez donner le _Role permission_ suivant :

- ajouter une attribution de rôle _Key Vault Administrator_ pour pouvoir définir les secrets.

{{< blockcontainer jli-notice-tip "Astuce : ajoutez un membre en tapant l'email complet.">}}

{{< /blockcontainer >}}

### Configurer le _Key Vault_

Une fois créé, dans la lame _Objets_, créez chaque secret manuellement.

Le nom de la clé doit être **kebab-case.**

## Configuration du registre des conteneurs

### Créer le _Container Registry_ (registre des conteneurs ou IC)

Dans la barre de recherche, tapez "_Container Registry_" et sélectionnez le type de ressource.

Lors de la configuration, utilisez le plan _Basic_ pour des prix plus bas.

{{< blockcontainer jli-notice-note "Note">}}

Le pipeline Azure _DevOps_ créera le référentiel lorsque l'IC sera en place.

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

Si vous n'êtes pas administrateur, vous devrez demander à un administrateur de vous accorder cette permission. Ce n'est pas quelque chose que vous pouvez recevoir comme les autorisations basées sur les rôles.

Vous aurez également besoin d'un _DevOps_ où votre projet réside. L'article ne détaille pas la création du _DevOps_ et suppose que vous en avez un et que vous avez créé un dépôt Git pour stocker le code de votre application.

### Configurer le pipeline

Allez sur le _DevOps_ puis la lame _Pipelines > Pipelines_.

Ensuite,

- dans l'onglet _Connect_, sélectionnez _Azure Repositories_.
- sur l'onglet _Select_, sélectionner le référentiel cible.
- sur l'onglet _Configure_, sélectionnez le conteneur de registre créé ci-dessus.

Une fois que vous avez confirmé la création du pipeline, ajoutez le tag `latest` dans le fichier de configuration généré afin que vous puissiez sélectionner ce tag sur le _Container App_ plus tard.

Sinon, vous devrez mettre à jour l'image à déployer dans le _Container App_ après chaque nouvelle version.

Aussi, dans le fichier `azure-pipelines.yml` généré, vous avez besoin de réaliser quelques modifications pour préparer le déploiement de l'image Docker vers l'App_Container :

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

Il n'y a pas d'instructions spécifiques pour créer la ressource à l'exception du nom qui commence par `st` et qui n'autorise pas les traits d'union.

Retournez au guide cité dans l'introduction.

### Configurer le _Storage Account_

Sous la lame _Data Storage > File shares_,

- Créer un _File share_. Dans l'application que nous construisions, nous avions besoin de stocker le fichier de la base de données SQLLite. Activez une sauvegarde si nécessaire.
- Créez un autre _File share_ pour stocker les traces applicatives. Pas besoin de sauvegardes.
- Créer un autre _File share_ pour les fichiers de configuration et autres fichiers de données que vous devez pouvoir modifier sans mettre à jour le code.

Je nomme mes _File shares_ de la façon suivante : `fileshare-[designation]-[project]-[env]` où `[designation]` est soit `db` pour la base de données, soit `logs` ou `json` pour les fichiers que j'ai besoin d'éditer à la volée.

Vous devrez ensuite lier le _Container app environment_ et le _Container App_ à chaque _File share_.

## Configuration du _Container App_

### Prérequis pour le _Container App_

Vous avez besoin de :

- Un pipeline existe dans le _DevOps_ avec une image prête.
- Vous avez besoin d'un rôle _Contributor role_ sur l'abonnement Azure pour votre compte d'utilisateur. Par conséquent, vous devrez peut-être fournir les instructions de création à quelqu'un ayant cette permission si vous ne pouvez pas recevoir ce droit selon la politique de votre organisation.

### Créer le _Container App_

Dans la barre de recherche principale, tapez _Container App_ et sélectionnez le type de ressource.

Dans l'onglet _Basics_,

- configurer le groupe de ressources, le nom et la région
- personnaliser le _Container Apps Environment_ (qui peut contenir de nombreux _Container Apps_) en en créant un nouveau.
  - cliquez sur _New_
  - ensuite, dans l'onglet _Basics_, donnez un nom selon la convention dans l'introduction et laissez le reste des options avec les valeurs par défaut.
  - ensuite, dans l'onglet _Monitoring_, désactivez les logs. L'application Container fournit un flux de logs de console qui peut être utile. Votre application devrait stocker les logs de fichiers dans le _File share_ dédié.
  - Laissez les onglets _Workload profiles_ et _Networking_ tels quels.

Dans l'onglet _Container_,

- sélectionnez la source d'image pour être _Azure Container Registry_ (ACR).
- sélectionnez l'ACR que vous avez créé précédemment.
- sélectionnez l'image.
- sélectionnez le tag `latest` de l'image.
- Ajustez le CPU et la mémoire à vos besoins.
- Vous pouvez configurer les variables d'environnement maintenant, mais nous verrons cela à l'étape _Configurer_ plus loin. De toute façon, il est fort probably que vous ayez besoin de les ajuster au cours de la durée de vie de votre application.

Dans l'onglet _Bindings_, laissez-le vide.

Dans l'onglet _Ingress_, vous devrez configurer la partie TCP pour que l'API REST soit accessible via HTTP :

- cochez la case _Ingress_.
- sélectionnez _Ingress Traffic_ comme étant _Accepting traffic from anywhere_ (Accepter du trafic de n'importe où)
- sélectionnez HTTP pour le _Ingress type_.
- laisser le mode de certificat client par défaut (aucune option sélectionnée)
- définir le _Target port_ à 5000, le port par défaut de l'application Flask que nous déployons.
- confirmer la création dans l'onglet _Review + create_.

Note : si l'examen de la configuration échoue avec l'erreur suivante, cela signifie probablement que vous n'avez pas la permission de créer la ressource :

> Le client `youraccount@example.com` avec l'objet id "xxx" n'a pas l'autorisation d'effectuer l'action "**Microsoft.App/register/action**" sur l'étendue "/subscriptions/yyy" ou l'étendue n'est pas valide. Si l'accès a été récemment accordé, veuillez rafraîchir vos informations d'identification. (Code : AuthorizationFailed) (Code : AuthorizationFailed)

### Configurer le _Container Apps Environment_

Une fois qu'Azure a créé le _Container Apps Environment_, allez directement dedans pour y lier les _File shares_.

Pour ce faire, récupérez le nom et la clé d'accès sous le _Storage account_.

- allez dans _Security + networking_ et sélectionnez la lame _Access keys_.
- copier

  - l'une des clés.
  - le nom du _Storage account_.
  - les noms des _File shares_ créés précédemment (sous la lame _File shares_).

De retour sur _Container Apps Environment_ :

- se rendre dans _Settings_ et dans la lame _Azure Files_.
- définisser le nom avec ce modèle : `azure-files-[designation]` (`designation` serait `db`, `logs`, etc.)
- ajouter une nouvelle entrée et remplissez le champ en collant les valeurs copiées précédemment du _Storage account_.
- définisser le _Access mode_ sur _Read/Write_ ou _Read only_ (je le fais pour les fichiers que l'application ne doit pas écrire).
- répéter l'opération pour tous les _File shares_ que l'application _Container App_ utilise.

À quoi cela va-t-il servir ? Dans l'API REST, vous pouvez utiliser une base de données SQLLite lorsque la base de données est un fichier et que vous devez la conserver.

Il en va de même pour l'enregistrement des fichiers.

Vous pourriez écrire les fichiers dans l'image du conteneur. Mais, lorsqu'il redémarre lors d'un nouveau déploiement, vous perdrez les données...

### Configure the _Container App_ Deploy Settings

Next, to go the _Container App_ to configure the deploy settings.

To do so, go to the _Revisions and replicas_ blade under _Application_ and click _Creation new revision._

We’ll set up the _Container_ tab last. You’ll understand why soon.

Go to the _Scale_ tab and adjust the _Min replicas_ and _Max replicas_ to use based on a scale rule you define. I’ve not used any rule in my scenario so I’ll skip that. I simply set the min. and max. values to 1.

On the _Volumes_ tab,

- select _Azure file volume_ as _Volume type_.
- give the volume a name. For example, I’d name the databases volume `databases`. You’ll need one volume for each file share you created.

**Important note: the volume name** must match the name of the volume you need to create in the Dockerfile. The volume name corresponds to what follows the `WORKDIR` value under the `VOLUME` commands below:

```yaml
# Set work directory of the docker image
WORKDIR /project-container

# Create mount points with absolute paths
VOLUME /project-container/databases
VOLUME /project-container/logs
```

- select the target file share (which is really the Azure file value you created under the _Container App Environment_).
- set the mount options to `nobrl` if the volume contains a SQLLite database file. Why? The problem is that Docker mounts the volume as CIFS file system which can’t deal with SQLite3 lock. See [this answer](https://stackoverflow.com/a/54051016) and [that answer](https://stackoverflow.com/a/61077705) in Stackoverflow. The [Microsoft documentation](https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/storage/mountoptions-settings-azure-files#other-useful-settings) also confirm this.
- make sure to click the _add_ button before continuing.

Go back to the _Container_ tab, add the volumes based on the File shares you create. On our example so far, we need:

- leave the _Revision details_ section as it is.
- Under the _Container image_ section, click of the existing image. It’ll open a right pane:
  - under the _Basics_ tab, you find the details you specified at the creation of the _Container App_ resource. This is where you can add your environment variables (scroll to the very bottom). We’ll come back to it when we will link the _Key Vault_ to pull the secret values from it.
  - under the _Health probes_, leave as it is.
  - under the _Volumes mounts_ tab, add all the volume mounts you need:
    - the Volume name will equal to the name you defined above.
    - the Mount path should be the same value as you defined in the _Dockerfile_ as explained above.
    - leave the _Sub path_ empty.
  - click _Save_
- make sure to click _Create_

Under the _Revisions and replicas_ blade, you should see within a couple of minutes if the deploy was successful when it displays the _Running status_ as _Running_ and a green check mark.

If not, click the revision link on the first column and click _Console log stream_. Somehow, the logs may not always appear so try a few times… Consistency in what the console log stream displays is random... On that end, I saw logs, and sometimes, I didn’t.

### Linking the Key Vault and the Container App

This is a prerequisite to configuring the environment variables.

First, under the _Identity_ blade in the _Container App_ resource, enable the System assigned identity by toggling the status to _On_.

You need this so you can provide the identify of the _Container App_ a role-based permission in the _Key Vault_ IAM.

Then, go to _Key Vault_ resource and browse to the _Access control (IAM)_ blade.

Click _Add_ and then _Add role assignment_.

- under the _Role_ tab, search for _Key Vault Secrets User_ and select it.
- under the _Members_ tab,
  - select _Managed identity_.
  - click _Select members_.
  - on the right pane that opens,
    - select your subscription,
    - select the _Managed identity_: you should have a value called _Container App (1)_ (`1` is the number of _Container App_ you have configured with a system identity).
    - select the target member list under _Select_. It should display a member with the name of your _Container App_.
    - make sure to click _Select_.
    - finish with _Review + assign_.

### Configure the _Container App_ Secrets Environment Variables

To start this section, you’ll need to copy the _Vault URI_ found under the _Overview_ blade of the _Key Vault_ resource.

Also make note of the secret names you created.

Prepare a URL for each with the following format: `{vault_uri}/secrets/{secret_name}`

Back to the _Container App_, browse to the _Settings_ and _Secrets_ blade.

From there, add your secret from the _Key Vault_ by clicking _Add_ button. Then:

- set the _Key_ value to the secret name you’re adding.
- set the _Type_ to _Key Vault reference_.
- set the _Value_ to the corresponding URL you prepared.
- click _Add_ and wait that the secret does appear.

{{< blockcontainer jli-notice-warning "Attention">}}

If the secret doesn’t appear, even if the Azure Portal gives a positive feedback in the notifications, the problem is that you didn’t complete properly “_Linking the Key Vault and the Container App_” step properly.

{{< /blockcontainer >}}

### Configure the Environment Variables

Once you’re done, create a new revision from the _Applications > Revisions and replicas_ blade.

Select your container image and scroll down to the _Environment Variables_ section and:

- first, add the variables that aren’t a secret using the _Source_ as _Manual entry_.
- second, add the variable whose values come from the Key vault using the _Source_ as _Reference a secret_. Then select as the _Value_ the corresponding secret reference.

Make sure to click _Save_ and create the revision.

You’re done configuring! 🏆

## Testing the API

Using Visual Studio Code and the REST Client extension, you can create a little file to test your endpoints:

```rest
### Create an event
POST https://capp-myproject-prod.cravesea-7fd7d8d0b6.myregion.azurecontainerapps.io/event
Content-Type: application/json

{
  "id": 1234
}

### GET all events
GET https://capp-myproject-prod.cravesea-7fd7d8d0b6.myregion.azurecontainerapps.io/event/all
Content-Type: application/json
```

## Troubleshooting

### Can’t Call The REST API App Even If Deploy Is Successful

If you get the following message when calling your app while the deploy is successful and Azure tells you it’s running:

```logs
azure upstream connect error or disconnect/reset before headers. retried and the latest reset reason: remote connection failure, transport failure reason: delayed connect error: 111
```

Make sure you use a production-grade server, not the default Flask server.

To fix that, you need to:

- install `gunicorn` package: it’s a production-grade webserver.
- configure the `Dockerfile` with the following command

  ```docker
  # Runtime commmand to start server
  CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
  ```

To run the above command, you need a `run.py` file at the root that contains something like this:

```python
import os

from app import MyApp

config_name = os.getenv("FLASK_CONFIG") or "default"
app = MyApp.create_app(config_name)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

```

## Conclusion

If you read thus far, well done and thank you!

I’ll continue sharing more about Python and Azure as I work with it.

Save my website in your bookmarks!

Credit: Logos of the header images are from WorldVectorLogo and SVGRepo. You can find the original images [here](https://worldvectorlogo.com/logo/azure-2) and [there](https://worldvectorlogo.com/logo/python-4): I built the image with [Sketchpad](https://sketch.io/sketchpad/) of Sketch.io.
