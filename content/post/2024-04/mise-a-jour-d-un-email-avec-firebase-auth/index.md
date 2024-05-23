---
title: "Mise à jour d'un email avec Firebase Auth"
description: "Il y a quelques années, le processus de modification d’une adresse e-mail avec Firebase Authentification était simple, mais moins sécurisé. Avec Firebase 9, cela a changé et vous devez vérifier l’adresse e-mail lorsque vous la mettez à jour. Je vais vous montrer comment cela fonctionne."
image: images/2024-04-10-a-few-mailboxes.jpg
imageAlt: "Quelques boîtes aux lettres physiques de différents styles"
date: 2024-04-12
categories:
  - Développement Web
tags:
  - Astuce du jour
  - Firebase
---

La réalisation de cette tâche n’a pas été facile.

Pour être honnête, Google n’a pas documenté très clairement l’API Firebase Authentification. Cependant, grâce à Stackoverflow (comme toujours !), j’ai réussi à résoudre ce problème et à mettre à jour l’adresse e-mail d’un utilisateur authentifié existant (méthode e-mail et mot de passe).

## Introduction

Bien que l’API fournisse toujours une méthode `updateEmail`, elle ne met pas à jour une adresse e-mail non vérifiée. Vous devez donc effectuer un processus en deux étapes :

- L’utilisateur demande à modifier son adresse électronique.
- L’utilisateur confirme la modification de l’adresse électronique.

## Comment créer un compte de messagerie à des fins de test ?

Pour tester cela, vous avez besoin d’un compte e-mail.

Pour les tests uniquement, je recommande **Yopmail**. Il vous permet de créer des adresses e-mail _jetables_ en quelques secondes.

Il suffit d’aller sur [leur site web](https://yopmail.com/) et d’utiliser [le générateur d’adresses e-mail aléatoires](https://yopmail.com/email-generator).

Vous avez ainsi la garantie que personne n’utilisera la même adresse électronique que vous.

{{< blockcontainer jli-notice-warning "Attention tout de même si vos e-mails contiennent des informations sensibles.">}}

{{< /blockcontainer >}}

### Le code et le flux métier

### Envoyer la demande de modification de l’adresse électronique

Le flux métier peut différer d’une application à l’autre, c’est pourquoi je vais seulement partager le code qui appelle l’API Firebase Authentification :

```tsx
/**
 * Ceci instancie l'application firebaseApp
 * @see https://github.com/JeremieLitzler/vueschool-course/blob/forum-vite/src/services/fireBaseConnector.ts
 */
import { firebaseApp } from "@/services/fireBaseConnector";

import { getAuth, verifyBeforeUpdateEmail } from "firebase/auth";

const auth = getAuth(firebaseApp);

/**
 * Envoyer à Firebase une requête pour obtenir un lien verifyAndUpdateEmail pour un utilisateur.
 *
 * Le `continueUrl` contient le lien vers la route /account/edit
 * à partir de laquelle la demande est faite.
 *
 * Les paramètres de la chaîne de requête sont utilisés pour avoir une expérience utilisateur fluide et guidée :
 * - `verifiedEmail` : utilisé sur la page de connexion (/account/edit qui nécessite une authentification) et la page /account/edit
 * une fois réauthentifié.
 * - `showReconnectMessage` : utilisé sur la page de connexion pour afficher un message clair sur l'adresse email à utiliser pour se connecter.
 * - `oobCode` : non utilisé mais pourrait l'être pour sécuriser la requête si le code a été sauvegardé dans le document firestore correspondant à l'utilisateur mis à jour.
 *
 * Le try&catch est nécessaire pour afficher un formulaire de connexion sur /account/edit si Firebase demande une réauthentification.
 *
 * N'oubliez pas d'ajouter la variable d'environnement VITE_BASE_URL dans votre CD.
 *
 * @param newEmail Le nouvel email à définir pour l'utilisateur authentifié
 * @returns Le résultat de la requête : succès (booléen) et l'erreur Firebase (s'il y en a une).
 */
const secureUpdateEmail = async (newEmail: string) => {
  const oobCode = uniqueIdHelper().newUniqueId;
  const continueUrl = `${import.meta.env.VITE_BASE_URL}/account/edit?${
    AppQueryStringParam.verifiedEmail
  }=${newEmail}&${AppQueryStringParam.oobCode}=${oobCode}&${
    AppQueryStringParam.showReconnectMessage
  }=true`;
  console.log("secureUpdateEmail>continueUrl", continueUrl);

  return verifyBeforeUpdateEmail(auth.currentUser!, newEmail, {
    url: `${continueUrl}`,
    handleCodeInApp: true,
  })
    .then(() => {
      return { success: true, errorMessage: null };
    })
    .catch((error) => {
      return { success: false, errorMessage: error };
    });
};
```

### Confirmer la modification de l’adresse e-mail

Une fois que l’utilisateur a demandé la vérification, Firebase envoie un e-mail à la nouvelle adresse e-mail.

{{< blockcontainer jli-notice-note "">}}

Bien que vous puissiez configurer le modèle d’e-mail, dans la version gratuite, vous êtes limité à ce que vous pouvez personnaliser.

{{< /blockcontainer >}}

Lorsque l’utilisateur clique sur le lien, il est dirigé vers une page Firebase. Une fois que Firebase a terminé la vérification et la mise à jour, l’utilisateur peut cliquer sur _Continue_. C’est là que le `continueUrl` est utilisé.

Dans l’application de démonstration ci-dessous, le `continueUrl` personnalisé permet de guider l’utilisateur à travers les étapes de la mise à jour.

Bien que Firebase met à jour l’adresse e-mail dans la base de données des utilisateurs, vous devrez probablement mettre à jour le document Firestore dans lequel vous stockez les autres informations de l’utilisateur.

## Application de démonstration

Vous pouvez visiter le [site web du projet](https://vueschool-masterclass-vite.netlify.app/) que j’ai construit en participant à [la Masterclass de Vueschool.io (version 1)](https://vueschool.io/the-vuejs-master-class).

Pour le tester, vous aurez besoin de :

- Créer un compte avec une adresse e-mail Yopmail.
- Aller sur _Voir profil_ dans le coin supérieur droit en cliquant sur le menu utilisateur.
- Cliquez sur _Modifier le profil_ et modifiez l’adresse e-mail dans le formulaire.

Pour les étapes suivantes, je vous laisse suivre le déroulement des actions.

Vous devrez ouvrir la boîte aux lettres Yopmail en utilisant l’adresse e-mail fournie dans la demande de mise à jour. Là, vous pourrez ouvrir l’e-mail de vérification.

Le code complet est disponible [sur GitHub](https://github.com/JeremieLitzler/vueschool-course/tree/forum-vite).

J’espère que vous avez apprécié cet article. Si vous avez des questions, comme toujours, [contactez-moi](../../../page/contactez-moi/index.md) et je verrai si je peux vous aider.

Crédit : photo d’entête par [Mathyas Kurmann](https://unsplash.com/@mathyaskurmann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/six-assorted-color-mail-boxes-fb7yNPbT0l8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
