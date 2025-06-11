---
title: "Expressions régulières sur le remplacement dans Visual Studio Code"
description: "Un jour, j’ai eu l’occasion de devoir remplacer de nombreux [n] par des [^n] dans un document."
image: 2025-04-16-vsc-with-regex-on-string-replacement.svg
imageAlt: Visual Studio Code et Expressions Régulières Pour le Replacement de Chaînes de Caractères
date: 2025-06-18
categories:
  - Développement Web
tags:
  - Expressions régulières
  - IDE
  - Visual Studio Code
---

C’est un excellent exemple d’utilisation de Regex (ou Expressions Régulières) dans la fonction _Rechercher et Remplacer_ de Visual Studio Code.

Pour remplacer toutes les occurrences de `[n]` par `[^n]` dans Visual Studio Code, où `n` est un nombre quelconque, suivez ces étapes :

## Étape 1. Ouvrez le panneau Rechercher et Remplacer

- Appuyez sur `Ctrl + H` (Windows/Linux) ou `Cmd + Option + F` (Mac).

## Étape 2. Activer la recherche par expression régulière

- Cliquez sur l’icône `.*` (ou appuyez sur `Alt + R`) pour activer le mode regex.

## Étape 3. Saisir la valeur de recherche

- Utilisez l’expression régulière suivante pour trouver `[n]` où `n` est un nombre :

  ```plaintext
  \[(\d+)\]
  ```

  - `\[` et `\]` correspondent aux crochets.
  - `(\d+)` capture un ou plusieurs chiffres.

## Étape 4. Saisir la valeur de remplacement

- Utilisez cette chaîne de remplacement :

  ```plaintext
  [^$1]
  ```

Note : `$1` fait référence au numéro capturé à l’intérieur des crochets.

## 5. Remplacer toutes les occurrences

- Cliquez sur « Remplacer tout » (ou appuyez sur `Alt + Enter` pour sélectionner toutes les occurrences, puis sur `Ctrl + Shift + L` pour remplacer).

## Exemple

| Texte original | Regex de recherche | Valeur de remplacement | Résultat            |
| -------------- | ------------------ | ---------------------- | ------------------- |
| [1],,[456]     | \[(\d+)\]          | [^$1]                  | [^1], [^23], [^456] |

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
