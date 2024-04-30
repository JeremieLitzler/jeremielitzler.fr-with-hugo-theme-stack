---
title: "Composants fonctionnels avec Vue"
description: "J’ai découvert les composants fonctionnels lors de ma préparation à la certification officielle de niveau 1 à Vue.js. Bien que je ne l’utilise pas tous les jours, car il est très verbeux, j’aimerais partager un exemple dans cet article."
image: images/2024-05-01-neon-sign-saying-do-something-great.jpg
imageAlt: "Une enseigne lumineuse affichant « Do Something Great » (Faites quelque chose de grand)"
date: 2024-05-01
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Vue
---

Je vais être 100 % honnête : le composant fonctionnel se situe à un autre niveau. Il utilise la fonction _render_ `h()` dans Vue.js.

Je crois que c’est ce que Vue utilise sous le capot pour convertir votre SFC (Single File Component) ou votre code In-Template en nœuds _Virtual DOM_.

Je vais partager un exemple que j’ai rencontré [dans la série de défis Vue.js](https://vuejs-challenges.netlify.app/questions/21-functional-component/README.html), où j’ai appris à utiliser cette fonctionnalité.

Lisez tous les commentaires dans le code ci-dessous.

```tsx
// Utilisation de TypeScrit et de l'API de composition
import { ref, h } from "vue";

// Pour typer la liste des éléments
type User = {
  name: String;
};
// Pour types les `props`
type Props = {
  list: User[];
  activeIndex: number;
};
// Pour typer les événements ( e.g. emit)
type Events = {
  toogle(index: number): void;
};

/**
 * Le défi > Implémenter un composant fonctionnel :
 * 1. Afficher les éléments de la liste (ul/li) avec les données de la liste
 * 2. Changer la couleur du texte de l'élément de liste en rouge lorsqu'il est cliqué.
 */
const ListComponent = (props: Props, { emit }) => {
  return h(
    "ul", // créer un élément <ul>
    props.list.map((item: User, index) =>
      h(
        // boucler sur la `prop` liste (équivalent au v-for)
        "li", // ... pour créer un élément <li> pour chaque élément
        {
          // ... avec l'attribute 'key' obligatoire
          key: index,
          // ...  avec le style en ligne pour afficher le texte
          // en rouge quand l'index courant est égal à l'index
          // spécifié dans la `prop` activeIndex
          style: index == props.activeIndex ? { color: "red" } : null,
          // ... avec l'assignement de la valeur `innerText`
          innerText: item.name,
          // ... et l'enregistrement de l'emit `toggle`
          // sur le `onclick`
          onClick: () => emit("toggle", index),
        }
      )
    )
  );
};

// Ceci liste les `props` du composant,
// mais ne les définit pas. Voir le type ci-dessus.
ListComponent.props = ["list", "active-index"];

// Ceci liste les `emits` du composant,
// mais ne les définit pas. Voir le type ci-dessus.
ListComponent.emits = ["toggle"];

const list: User[] = [
  {
    name: "John",
  },
  {
    name: "Doe",
  },
  {
    name: "Smith",
  },
];
const activeIndex = ref(0);

function toggle(index: number) {
  activeIndex.value = index;
}
```

Maintenant, vous comprenez Vue.js un peu plus en profondeur.

En ce qui concerne la _template_, l’utilisation reste identique à un composant _SFC_ classique.

```html
<template>
  <list-component :list="list" :active-index="activeIndex" @toggle="toggle" />
</template>
```

N’hésitez pas à [me contacter](../../../page/contactez-moi/index.md) si vous voyez des erreurs ou si vous voulez simplement [dire merci](../../../page/soutenez-moi/index.md).

Crédit: Photo par [Clark Tibbs](https://unsplash.com/@clarktibbs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/do-something-great-neon-sign-oqStl2L5oxI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
