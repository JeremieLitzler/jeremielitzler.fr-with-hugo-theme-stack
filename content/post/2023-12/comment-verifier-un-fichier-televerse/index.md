---
title: "Vérifiez vraiment ce qu'est un fichier téléversé"
description: "Lorsque vous créez une application Web, il est très facile pour quelqu'un de téléverser un fichier qui n'est pas ce qu'il semble être. Voyons comment résoudre cette faille de sécurité."
#image: images/.jpg
#imageAlt: 
date: 2023-12-08
categories:
  - Tutoriels
---

Bonjour à tous,

Connaissez-vous le « nombre magique » et à quoi peut-il être utile ?

Vous pouvez le trouver dans les deux premiers octets d’un fichier binaire et il indique quel fichier vous avez entre les mains.

Il est utile de le savoir si vous créez des applications Web dans lesquelles les utilisateurs peuvent téléverser des fichiers.

Saviez-vous que la recherche de l’extension dans le nom du fichier ou dans le type MIME ne suffit pas à s’assurer à 100 % que le fichier est vraiment ce qu’il semble être ?
Quelqu’un peut facilement simuler une image JPEG alors qu’il s’agit en réalité d’un exécutable…

C’est alors que le nombre magique devient utile !

Voici un exemple d’implémentation en C# [dans ce Gist](https://gist.github.com/JeremieLitzler/fb0fb0ec22225947e8bb28817d2ac314)

Qui connaissait cela ?
