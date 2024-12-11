---
title: "Comment enregistrer un fichier avec du JavaScript?"
description: "Parfois, il est pratique de sauvegarder du contenu directement depuis le code JavaScript vers un fichier physique. Voici la solution !"
image: do-something-great-sign.jpg
imageAlt: "Un panneau « Do Something Great » dans l'obscurité"
date: 2024-12-11
categories:
  - Développement Web
tags:
  - JavaScript
---

## Le code

C’est simple :

- Créer un élément d’ancrage (`a`).
- L’ajouter au DOM.
- Simuler un clic sur l’élément.
- Retirer l’élément du DOM.

```javascript
function downloadFile(filename, textData, dataType = "text/plain") {
  const node = Object.assign(document.createElement("a"), {
    href: `data:${dataType};charset=utf-8,${encodeURIComponent(textData)}`,
    download: filename,
    style: "display: none",
  });
  document.body.appendChild(node);
  node.click();
  document.body.removeChild(node);
}
```

## La démo sur jsFiddle

Voici une démonstration en direct [sur jsfiddle](https://jsfiddle.net/puzzlout/ehyqajLr/3/).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : photo de [Clark Tibbs](https://unsplash.com/@clarktibbs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/do-something-great-neon-sign-oqStl2L5oxI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
