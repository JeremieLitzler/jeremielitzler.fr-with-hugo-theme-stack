---
title: "Modèle de conception Command vs. Bus de messages"
description: "Alors que je passais en revue certains concepts de la programmation orientée objet, j’ai lu un article sur le modèle de conception **Command**, ce qui m’a fait penser aux messages de bus. Cependant, ils ne représentent pas la même chose."
image: 2025-11-17-a-waiter-taking-an-order-from-two-men.jpg
imageAlt: Un serveur prenant la commande de deux hommes
date: 2025-11-21
categories:
  - Développement logiciel
tags:
  - Modèles De Conception
---

Lorsque les développeurs parlent d’architecture logicielle, deux concepts reviennent souvent : le modèle de conception **Command** (Command Pattern) et les systèmes de bus de messages.

Bien qu’ils présentent certaines similitudes, ils sont conçus pour résoudre des problèmes différents. Par exemple, un vélo et une voiture vous permettent tous deux de vous rendre d’un point A à un point B, mais vous ne les utiliseriez pas dans les mêmes situations.

Regardons ça en détail.

## Le modèle de conception *Command* : votre télécommande personnelle

Imaginez que vous disposiez d’une télécommande universelle pour votre maison. Lorsque vous appuyez sur le bouton « soirée cinéma », elle ne se contente pas d’allumer votre téléviseur, elle tamise les lumières, ferme les stores, règle le thermostat et démarre votre appareil de streaming. La télécommande n’a pas besoin de savoir comment chaque appareil fonctionne en interne, elle sait simplement réaliser chacune de ces sous-tâches.

C’est essentiellement ce que fait le modèle de conception _Command_ dans un logiciel. Il regroupe une demande, telle que « allumer la télévision », dans un ensemble bien organisé (un objet) qui contient tout ce qui est nécessaire pour exécuter cette demande ultérieurement. Cet ensemble est portable, réutilisable et peut être transmis dans votre code comme une note contenant des instructions.

### Les acteurs clés de ce modèle

Tout d’abord, nous avons la **commande elle-même**. Elle représente la note d’instructions qui indique ce qui doit être fait.

Ensuite, nous trouvons l’**invocateur**, c’est-à-dire la personne (ou le code) qui tient la télécommande et décide quand appuyer sur les boutons.

Ensuite, nous avons le **récepteur**. Il s’agit du dispositif (ou de l’objet) qui exécute le travail.

Enfin, les **commandes concrètes** peuvent représenter d’autres boutons spécifiques de votre télécommande, chacun étant configuré pour effectuer une action spécifique.

Ce qui rend le modèle de conception **Command** spécial, c’est qu’il peut faire plus que simplement exécuter des actions. Comme chaque commande est un objet, vous pouvez les stocker dans une liste (créant ainsi un historique des annulations), les programmer pour plus tard (comme un enregistrement sur un magnétoscope numérique) ou même les rejouer dans l’ordre. C’est comme avoir un enregistreur de macros pour votre logiciel.

## Systèmes de bus de messages : le tableau d’affichage du bureau

Maintenant, changeons de sujet et imaginons un autre scénario.

Imaginez un bureau très actif avec différents services : ventes, marketing, comptabilité et informatique. Au lieu que les employés courent dans tous les sens et s’interrompent constamment, l’entreprise utilise un système de tableau d’affichage central.

Lorsque le service commercial conclut une grosse affaire, il affiche un mémo sur le tableau : « Nouveau client acquis ! » Le service comptabilité consulte régulièrement le tableau et voit le mémo, puis crée une facture. Le service marketing le voit également et envoie un dossier de bienvenue. Enfin, le service informatique crée un nouveau compte lorsqu’il prend connaissance du mémo. Personne n’a eu à frapper à la porte de qui que ce soit.

C’est ainsi que fonctionne un système de bus de messages. Il s’agit d’une autoroute de communication où les différentes parties de votre logiciel peuvent communiquer entre elles sans savoir qui écoute, ni même si quelqu’un écoute.

### Les principaux composants

Tout d’abord, nous trouvons les **producteurs de messages**, dans l’exemple ci-dessus, chaque service publiant des notes de service (composants qui envoient des messages).

Ensuite, nous avons le **bus de messages** que nous avons décrit comme le tableau d’affichage lui-même (l’infrastructure qui achemine les messages).

Enfin, les **consommateurs de messages** représentent les composants qui s’abonnent aux messages. Dans l’exemple ci-dessus, les services qui lisent les mémos correspondent à ces consommateurs. Il est important de noter que chaque service consommateur _sait_ quels messages il doit lire ou pas.

Les bus de messages excellent dans la coordination de plusieurs systèmes qui doivent rester faiblement liés. Lorsqu’un nouveau service rejoint l’entreprise, il commence simplement à lire les mémos pertinents **pour lui-même** à partir du tableau, sans qu’il soit nécessaire de reconnecter les téléphones de tout le monde. De même, si un service quitte l’entreprise, les autres continuent de fonctionner normalement, même si dans la réalité, il y aurait un ajustement à mettre en place dans l’entreprise.

## Points communs et divergences

Ces deux modèles reconnaissent une vérité fondamentale dans la conception de logiciels : le couplage fort est l’ennemi de la flexibilité.

Lorsqu’un élément de code en sait trop sur un autre, modifier l’un peut très souvent endommager l’autre.

Le modèle de conception **Command** et les bus de messages coupent ce lien, mais d’une manière différente :

**La commande** est comparable à un serveur qui prend votre commande dans un restaurant. Le serveur (invoker) ne cuisine pas votre repas ; il note votre demande (objet de commande) et la transmet à la cuisine (receiver). Vous pouvez peut-être modifier votre commande avant qu’elle ne soit préparée, le restaurant peut mettre les commandes en attente pendant les heures de pointe et, en cas d’erreur, il peut se référer à votre bon de commande initial. L’accent est mis sur l’encapsulation des actions individuelles afin qu’elles puissent être manipulées, retardées ou annulées.

**Un bus de messages** est comparable à un système de diffusion radio. Le DJ (producteur) ne sait pas qui l’écoute ni combien de personnes sont à l’écoute. Les auditeurs (consommateurs) peuvent se connecter ou se déconnecter quand ils le souhaitent. Plusieurs stations peuvent diffuser simultanément et vous pouvez vous connecter à plusieurs stations. L’accent est mis sur la facilitation de la communication entre de nombreux composants indépendants, souvent en même temps, sans qu’ils aient besoin de se connaître les uns les autres.

## Les différences clés qui comptent

Alors que le modèle de conception **Command** vous aide à organiser et à contrôler ce que fait votre code, un bus de messages vous aide à organiser la manière dont votre code communique.

Les commandes s’exécutent généralement de manière synchrone, comme lorsque vous confiez une liste de tâches à votre assistant et que vous attendez qu’il les accomplisse. Les bus de messages s’exécutent généralement de manière asynchrone, comme lorsque vous envoyez des e-mails et que vous consultez votre boîte de réception plus tard pour voir qui a répondu.

Le modèle de conception **Command** est particulièrement utile lorsque vous devez contrôler l’exécution : fonctionnalité d’annulation dans un éditeur de texte, systèmes de transaction dans les bases de données ou planificateurs de tâches qui doivent réessayer les opérations ayant échoué. Chaque commande est un élément à part entière qui peut être inspecté, modifié ou annulé.

Les bus de messages excellent dans les systèmes distribués où plusieurs composants doivent réagir à des événements : les plateformes de e-commerce où une commande déclenche des mises à jour des stocks, des notifications d’expédition et des écritures comptables, le tout de manière indépendante. Le bus garantit la livraison des messages, mais ne se soucie pas de l’ordre de traitement ni de qui répond.

## Quand utiliser chacun d’entre eux ?

Choisissez le modèle de conception **Command** lorsque vous développez des fonctionnalités qui nécessitent :

- Des capacités d’annulation et de rétablissement
- La mise en file d’attente des tâches pour une exécution ultérieure
- L’enregistrement des opérations pour les journaux d’audit
- Un comportement transactionnel avec prise en charge de la restauration

Optez pour un bus de messages lorsque vous avez affaire à :

- Plusieurs systèmes qui doivent répondre au même événement
- Des flux de travail asynchrones où des réponses immédiates ne sont pas nécessaires
- Des exigences de scalabilité où les composants peuvent se trouver sur différents serveurs
- Des architectures en évolution où de nouvelles fonctionnalités doivent être intégrées sans perturber le code existant

## Conclusion

Considérez le modèle de conception **Command** comme un système sophistiqué de liste de tâches pour votre application : chaque élément est soigneusement regroupé avec toutes les informations nécessaires à sa réalisation, et vous pouvez les réorganiser, les retarder ou les annuler selon vos besoins.

Un bus de messages, en revanche, s’apparente davantage à un crieur public dans un village médiéval, annonçant les nouvelles à tous ceux qui veulent bien les écouter, sans se soucier de qui se présente ou ce qu’ils font de ces informations.

Il ne s’agit pas de concurrents, mais d’outils destinés à des tâches différentes. En fait, de nombreux systèmes sophistiqués utilisent les deux. Vous pouvez utiliser un bus de messages pour répartir le travail entre plusieurs serveurs et utiliser le modèle de conception **Command** au sein de chaque serveur pour gérer la manière dont ce travail est exécuté.

À l’instar d’une boîte à outils bien équipée, les meilleurs architectes logiciels savent quand utiliser chaque outil.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de [RDNE Stock project](https://www.pexels.com/photo/waiter-getting-the-customer-s-orders-4921154/).
