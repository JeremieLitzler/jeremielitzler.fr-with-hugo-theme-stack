---
title: "Générer un document Word avec OpenXml PowerTools"
description: "Depuis que Microsoft Office a sorti la version Microsoft Office 2007, les documents de la suite Office sont plus interopérables avec l’OpenDocument et surtout, il n’est pas nécessaire d’utiliser une librairie propriétaire pour éditer programmatiquement les documents .docx"
image: images/exemple-de-modele-word-et-son-equivalent-sans-les-balises.jpg
imageAlt: Exemple de modèle Word et son équivalent sans les balises.
date: 2023-12-12
categories:
  - Tutoriels
---

Pour un projet, j’ai eu la tâche de :

- Prendre un modèle de document Word contenant des balises prédéfinies par un besoin spécifique client,
- Remplacer lesdites balises par des données dynamiquement issues d’une base de données.
- Permettre la préservation des styles du modèle (texte gras, surligné, sous-ligné, de différentes, etc.) même après le remplacement des balises.

Dans cet article, je partage ce que j’ai appris et comment j’ai atteint le but.

## Présentation de `Office Open XML`

Après une petite recherche sur Google, je comprends vite que le format de document Word aujourd’hui respecte _la norme ISO/CEI 29500 créée par Microsoft, destinée à répondre à la demande d’interopérabilité dans les environnements de bureautique et à concurrencer la solution d’interopérabilité OpenDocument soutenue par tous les autres éditeurs de suites bureautiques, notamment Apache et The Document Foundation_ (source : [Wikipedia](https://fr.wikipedia.org/wiki/Office_Open_XML)).

En lisant les divers articles, je comprends que renommer un fichier `mon-document.docx` en `mon-document.docx.zip` permet ensuite de dézipper le fichier et obtenir ceci :

![Exemple de modèle Word « dézippé »](images/exemple-de-modele-word-dezippe.jpg)

Les fichiers `XML` définissent le document Word.

Par exemple, le fichier `document.xml` correspond au contenu au format `XML` .

![Exemple de contenu du document Word en XML](images/exemple-de-contenu-du-document-word-en-xml.jpg)

On voit bien les balises entourées de leurs _doubles moustaches_, par exemple `{{FirstName}} {{LastName}}` .

{{< blockcontainer jli-notice-tip "Au passage...">}}

Le choix de `{{Balise}}` est arbitraire.

J’aurais aussi bien pu utiliser `{Balise}` ou `[Balise]` ou même `%Balise%` .

C’est l’appelant de la librairie de génération qui définit les balises. Le générateur lui-même ne fait que prendre les balises et les remplacer avec la donnée associée.

{{< /blockcontainer >}}

On voit aussi dans l’XML que, pour d’autres balises, on peut se demander comment le remplacement va être possible.

![Balises « non éclatées » vs balises « éclatées »](images/balises-non-eclatees-vs-balises-eclatees.jpg)

Que s’est-il passé sur la balise `{{AddressLane}}` ? En fait, en éditant le document (suppression, ajout de caractères, correction, etc.), le texte qui compose la balise peut être découpée en `<w:t>...</w:t>` par Microsoft Word (`w:t` est défini [ici dans la spécification OOXML](http://www.datypic.com/sc/ooxml/e-w_t-1.html)).

Du coup, quand on veut remplacer`{{AddressLane}}`, comment fait-on ?

## La solution

La théorie est très bien détaillée [dans cette réponse](https://stackoverflow.com/a/59328568) de [Thomas Barnekow](https://stackoverflow.com/users/4654643/thomas-barnekow) sur Stackoverflow.

Thomas utilise deux librairies disponibles sur Nuget.org pour démontrer le remplacement efficace des balises :

- `DocumentFormat.OpenXml` (version 3.0.0 au 12/12/2023)
  - cette librairie est la librairie officielle de Microsoft pour lire les documents`OpenXml` .
  - Voici le dépôt de la librairie [`DocumentFormat.OpenXml`](https://github.com/dotnet/Open-XML-SDK)
- Open-Xml-PowerTools (version 4.5.3.2 au 12/12/2023)
  - Cette librairie étend `DocumentFormat.OpenXml` avec des outils très pratiques, comme le remplacement des balises.
  - Voici le dépôt de la librairie [`Open-Xml-PowerTools`](https://github.com/OpenXmlDev/Open-Xml-PowerTools)

Je me suis inspiré de [l’exemple de génération `TextReplacer02`](https://github.com/OpenXmlDev/Open-Xml-PowerTools/tree/vNext/OpenXmlPowerToolsExamples/TextReplacer02) avec Open-Xml-PowerTools.

## L’algorithme de génération

Pour transformer un modèle de document `.docx` avec des balises personnalisées, l’algorithme est le suivant :

- On lit les données dynamiques.

  - Dans mon exemple, je définis 2 objets en dur pour faire simple. J’utilise l’outil _[Fake Name Generator](https://www.fakenamegenerator.com/)_ pour obtenir deux identités de personnes.
  - Dans le projet que j’ai réalisé, les données provenaient d’une base de données MSSQL avec l’utilisation d’EF Core.

- On réalise une copie du modèle.

  - Dans mon projet d’exemple, le document est copié dans le dossier `bin\GeneratedDocx` du projet de tests.
  - Dans le cas du projet que j’ai réalisé, je devais copier le modèle du dossier source stockant les modèles à un dossier séparé en le nommant par exemple `generated-[GUID].docx` .

- Ouvrir **en écriture** la copie du modèle.

{{< blockcontainer jli-notice-tip "Lire et écriture un fichier `.docx` ?">}}

Au passage, il faut que les modèles soient des vrais `.docx`, `dotx` ou `dotm` (même `magicnumber` égale à`8075` .

Un document `.doc` ne pourra pas être lu.

{{< /blockcontainer >}}

- Remplacer chaque balise à partir de la liste prédéfinie.

- Écrire le fichier.

## Le code

J’ai créé un projet sur GitHub où vous pouvez trouver le code pour démontrer l’algorithme.

Vous trouverez [le code de démonstration sur GitHub](https://github.com/JeremieLitzler/demo-word-doc-generator).

Le projet `Jeremie.Codes.Core.WordGenerator` contient la logique pour transformer le document modèle en document final.

J’ai défini 3 Dto :

- `ProcessedDocumentInputs.cs` contient

  - Le chemin absolu de la copie du modèle à utiliser.
  - Un dictionnaire clé-valeur pour simplifier le plus possible le traitement de remplacement des balises. La clé est la balise (`{{UneBalise}}` par exemple) et la valeur correspond à la donnée qui va remplacer la balise.

- `ProcessedDocumentOutput.cs` contient

  - Le contenu binaire du fichier Word après le remplacement des balises.
  - Une liste de messages indiquant s’il y a eu des erreurs ou si le document contient des erreurs du point de vue `OpenXml`.

- `TemporaryFileInfo.cs` contient le chemin absolu et le nom de la copie du modèle.

Le service se compose de 2 méthodes publiques :

- `CreateTemporaryDocument` réalise la copie du modèle dans un nouveau fichier nommé pour être unique. La méthode vérifie bien sûr que le modèle existe bien et que la copie réussit.

- `ReplacePlaceholders` ouvre le fichier en écriture (Le `true` en second argument de `WordprocessingDocument.Open`) et boucle sur la liste des balises pour les remplacer avec la donnée finale respective.
  - L'écriture est réalisée sur le `Dispose` que nous sommes dans un `Using`.

Le projet `Jeremie.Codes.Core.WordGenerator.Tests` démontre l’usage du service, en particulier la construction du dictionnaire de clé-valeur.

Cette approche du dictionnaire permet à `Jeremie.Codes.Core.WordGenerator` d’être indépendant, ce qui était une obligation dans le projet concret afin d’éviter une dépendance circulaire.

Vous avez aimé ? Partagez !

À bientôt pour un nouvel article.
