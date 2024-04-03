---
title: "Mise en garde avec la déstructuration des props Vue"
description: "La déstructuration d'objets en JavaScript est une fonctionnalité très intéressante. L'utiliser avec Vue peut cependant prendre une tournure particulière... Nous allons nous pencher sur une mise en garde à ce sujet."
image: images/2024-04-03-a-box-of-lego-blocks.jpg
imageAlt: "Une boîte renversée de blocs LEGO"
date: 2024-04-03
categories:
  - Développement Web
tags:
  - Astuce du jour
  - Vue
---

Je vais expliquer mon cas d'utilisation : j'avais un composant `PostList` sur une application de forum et j'ai utilisé ce composant dans deux scénarios :

- l'un avait besoin que les messages soient classés dans l'ordre croissant,
- l'autre avait besoin du contraire.

En travaillant sur ce composant, j'ai déclaré mes _props_ de cette façon :

```tsx
interface PostListProps {
  posts: Post[];
  orderBy: OrderByDirection;
}
const { posts, orderBy } = withDefaults(defineProps<PostListProps>(), {
  orderBy: OrderByDirection.Asc,
});
```

Ensuite, j'ai utilisé une `computed` pour ordonner les posts selon les besoins :

```tsx
const orderedPosts = computed(() => {
  if (orderBy === OrderByDirection.Asc) {
    return posts;
  }
  return [...posts].sort((first, next) =>
    first.publishedAt! < next.publishedAt! ? 1 : -1
  );
});
```

Lorsque j'ai testé ce code, l'ajout d'un nouveau message a fonctionné mais il ne s'est pas affiché dans la liste.

En utilisant Vue DevTools, j'ai vu l'état de Pinia se mettre à jour et le composant parent du composant `PostList` a bien fourni la liste complète...

Pourquoi le nouveau message n'apparaît-il pas ?

La déstructuration de l'objet _props_ avait brisé la réactivité et `computed` nécessite une dépendance réactive pour se mettre à jour !

Le code est donc devenu :

```tsx
const props = withDefaults(defineProps<PostListProps>(), {
  orderBy: OrderByDirection.Asc,
});
const orderedPosts = computed(() => {
  if (props.orderBy === OrderByDirection.Asc) {
    return props.posts;
  }
  return [...props.posts].sort((first, next) =>
    first.publishedAt! < next.publishedAt! ? 1 : -1
  );
});
```

La déstructuration est géniale, mais avec Vue, il faut l'utiliser avec précaution, en particulier si vous utilisez des `computed` 🙂.

Crédit : Photo de [Scott McNiel](https://www.pexels.com/photo/lego-blocks-on-white-plastic-container-7662317/) sur [Pexels](https://www.pexels.com/).
