---
title: "Secrets expirés sur les services de connexion Azure DevOps"
description: "J'ai passé une demi-journée à résoudre un problème de secret expiré dans une application enregistrée automatiquement par Azure DevOps dans Microsoft Azure. Voici comment résoudre le problème et ce que j'en retiens."
image: 2025-06-16-expired-secrets-on-azure-devops.jpg
imageAlt: Secrets expirés sur Azure DevOps
date: 2025-06-20
categories:
  - Développement logiciel
tags:
  - Azure DevOps
  - Microsoft Azure
---

Dans l’article où je décris [le déploiement d’une application Python sur Microsoft Azure](../../2024-08/deployer-une-api-rest-python-sur-microsoft-azure/index.md), j’explique brièvement comment configurer la poussée d’une image Docker vers un registre de conteneurs azur (ACR dans les paragraphes suivants).

## Le problème

Lors de la création d’un pipeline DevOps, une connexion de service est créée automatiquement. Cela représente l’identité qui a la permission de pousser l’image vers l’ACR.

Sous le capot, Azure DevOps crée un enregistrement d’application dans Microsoft Entra ID avec un secret qui expire par défaut après 3 mois.

Et vous ne le remarquez pas vraiment… jusqu’à ce qu’il expire.

Soudain, le 91e jour, vous apportez une modification à votre application, poussez le code et construisez la nouvelle image Docker.

Puis le pipeline se termine par une erreur :

```bash
 unauthorized: Invalid clientid or client secret
```

D’abord, vous ne comprenez pas parce que trois mois, c’est long. Mais surtout, vous ne savez pas pourquoi aux premiers abords.

## La solution

La première question qui vient à l’esprit est « quel est ce secret invalide et où se trouve-t-il ? ».

Vous essayez peut-être avec l’identifiant du service de connexion (trouvée sous _Project settings > Service Connections_) mais vous ne trouverez aucune référence à cela dans les ressources Azure.

Après cela, utiliser le CLI Azure constitue un bon point de départ pour lire les données complètes du service de connexion.

Tout d’abord, créez-vous un PAT token dans le menu à côté de votre avatar dans DevOps et sélectionnez « *Personal Access Tokens* ».

Sélectionnez l’autorisation de lire les services de connexion.

Ensuite, ouvrez le portail Azure puis le CLI intégré disponible à gauche de l’icône de notifications dans le menu en haut à droite.

Exécutez ensuite les commandes suivantes :

```bash
az devops login
# Saisissez votre jeton PAT lorsque cela vous est demandé

# Disponible dans l'interface DevOps sur la connexion de service sélectionnée
SERVICE_ENDPOINT_ID="MY_SERVICE_CONNECTION_ID"
ORGA_NAME="MY_ORGA"
PROJECT_NAME="MY_PROJECT"
az devops service-endpoint show --id $SERVICE_ENDPOINT_ID --organization https://dev.azure.com/$ORGA_NAME --project $PROJECT_NAME
```

Nous obtenons ce qui suit.

{{< blockcontainer jli-notice-note "Les valeurs sensibles ont été remplacées par des « {} » contenant ce qu'elles représentent.">}}

{{< /blockcontainer >}}

```json
{
  "administratorsGroup": null,
  "authorization": {
    "parameters": {
      "loginServer": "crmycontainer.azurecr.io",
      "scope": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ContainerRegistry/registries/{repository-name}",
      "servicePrincipalId": "{registered-application-id}",
      "servicePrincipalKey": null,
      "tenantId": "{tenant-id}"
    },
    "scheme": "serviceprincipal"
  },
  "createdBy": {
    "descriptor": "aad.{description-id}",
    "directoryAlias": null,
    "displayName": "John Doe",
    "id": "user-id",
    "imageUrl": "https://dev.azure.com/{devops-organisation-name}/_apis/GraphProfile/MemberAvatars/aad.{description-id}",
    "inactive": null,
    "isAadIdentity": null,
    "isContainer": null,
    "isDeletedInOrigin": null,
    "profileUrl": null,
    "uniqueName": "user@email.com",
    "url": "https://spsprodneu1.vssps.visualstudio.com/{some-id}/_apis/Identities/{id}"
  },
  "creationDate": "2024-07-17T09:22:44.087Z",
  "data": {
    "appObjectId": "{app-object-id}",
    "azureSpnPermissions": "[{\"roleAssignmentId\":\"{role-assignment-id}\",\"resourceProvider\":\"Microsoft.RoleAssignment\",\"provisioned\":true}]",
    "azureSpnRoleAssignmentId": "{azure-spn-role-assignment-id}",
    "registryId": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ContainerRegistry/registries/{repository-name}",
    "registrytype": "ACR",
    "spnObjectId": "{spn-object-id}",
    "subscriptionId": "{subscription-id}",
    "subscriptionName": "My Subscription name"
  },
  "description": "Allows to push the generated Docker image to the ACR.",
  "groupScopeId": null,
  "id": "{service-connection-id}",
  "isOutdated": false,
  "isReady": true,
  "isShared": false,
  "modificationDate": "2024-11-19T09:49:04.997Z",
  "modifiedBy": {
    "displayName": null,
    "id": "00000002-0000-8888-8000-000000000000"
  },
  "name": "{service-connection-name}",
  "operationStatus": {
    "errorCode": null,
    "severity": "",
    "state": "Ready",
    "statusMessage": ""
  },
  "owner": "Library",
  "readersGroup": null,
  "serviceEndpointProjectReferences": [
    {
      "description": "Allows to push the generated Docker image to the ACR.",
      "name": "{acr-name}",
      "projectReference": {
        "id": "{project-id}",
        "name": "My DevOps project"
      }
    }
  ],
  "serviceManagementReference": null,
  "type": "dockerregistry",
  "url": "https://management.azure.com/"
}
```

La partie la plus intéressante de tout cela est le `{registered-application-id}`. Avec cette valeur, si vous possédez le rôle _Application Administrator_ dans Microsoft Entra ID, vous pouvez visualiser l’application sous la lame _Application Registrations_.

Si vous avez un secret expiré, vous remarquez rapidement une barre de notification rouge en haut de la ressource vous invitant à « *créer un nouveau secret* ».

Ce n’est pas la bonne solution.

Au lieu de cela, rendez vous dans Azure DevOps et chargez à nouveau le service de connexion et passez en mode édition.

En cliquant sur _Save_, DevOps créera un nouvel enregistrement d’application avec une nouvelle clé/valeur secrète (et remplacera celle que vous avez peut-être créée manuellement).

À partir de là, vous pouvez reprendre en déclenchant un build manuel du pipeline. Il construira et poussera la nouvelle image Docker vers l’ACR.

Malheureusement, en novembre 2024, je n’ai pas trouvé d’autre moyen. Ne vous fiez pas au « Click the _Verify_ button » dont parlent certains articles et même la documentation officielle de Microsoft, car il est devenu obsolète. Le bouton _Save_ s’occupe de tout.

Vous devrez effectuer cette action manuelle tous les trois mois.

À moins que Microsoft ne la rende automatique ou **plus explicite** ?

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
