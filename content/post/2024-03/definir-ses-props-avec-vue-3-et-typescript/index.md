---
title: "Définir ses “props” avec Vue 3 et TypeScript"
description: "Avec Vue 3 et TypeScript, la déclaration de vos “props” s’écrit assez différemment et n’est peut-être pas intuitive si vous ne connaissez pas TypeScript. Laissez-moi vous expliquer en détail."
image: images/2024-03-08-example-prop.jpg
imageAlt: "Exemple de la définition d'une “prop”"
date: 2024-03-08
categories:
  - Développement Web
tags:
  - Vue 3
  - TypeScript
  - Astuce du jour
---

Voici ce que j’ai appris après avoir passé pas mal de temps à essayer et à utiliser `defineProps` avec Vue 3 et TypeScript.

Pour rappel, en JavaScript, les _props_ sont définis de la manière suivante:

```javascript
//Options API
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
//Composition API
const props = defineProps({ id: String });
```

En revanche, avec TypeScript, cela devient :

```tsx
const props = defineProps<{ id: string }>();
```

Remarquez que le type _prop_ n’est pas le même : `String` en JavaScript contre `string` en TypeScript.

Il est important de respecter cet usage pour que le code fonctionne. Et si vous ne faites pas attention, ESLint s’assurera de vous informer de l’erreur lorsque vous écrirez en TypeScript.

Et lorsque vous avez besoin de définir une _prop_ comme non requis (implicitement, elles sont requises…), utilisez-le `?` qui suit le nom de la _prop_ :

```tsx
const props = defineProps<{ id?: string }>();
```

Maintenant, cela va devenir plus complexe lorsque vous aurez besoin de définir des valeurs par défaut.

Auparavant, en utilisant JavaScript et l’API Option, vous deviez écrire :

```javascript
props : {
  id : {
    type : String,
    default : null
  }
}
```

Ou si vous préférez l’API Composition, cela ressemblerait à ceci :

```javascript
const { id } = defineProps({
  id: {
    type: String,
    default: null,
  },
});
```

{{< blockcontainer jli-notice-tip "Astuce">}}

Vous pouvez déstructurer les _props_ facilement avec `{ propName }` comme montré ci-dessus.

{{< /blockcontainer >}}

En utilisant TypeScript et l’API Composition, vous devrez utiliser la macro `withDefaults` **et** créer une interface pour définir les _props_ :

```typescript
interface ThreadEditorPageProps {
  title? : string ;
  body? : chaîne de caractères ;
}

const props = withDefaults(defineProps<ThreadEditorPageProps>(), {
  title : "",
  body : "",
}) ;
```

Décomposons le code :

1. `title` et `body` sont des _props_ de type `string` et elles sont optionnelles.
2. ensuite (1) instanciez les _props_ en fournissant à la macro `withDefaults` la macro `defineProps` typée avec l’interface et (2) ajoutez un objet avec les _props_ pour lesquels vous avez besoin de définir une valeur par défaut.

Dans l’exemple, ne pas fournir de valeur par défaut signifierait que les _props_ seraient toutes deux égales à `undefined` à cause du `?`.

Avec des valeurs par défaut explicites, elles valent une chaîne vide.

Vous n’avez pas besoin de définir une valeur par défaut pour toutes les _props_ et elles n’ont pas besoin d’être marquées comme optionnelles pour recevoir une valeur par défaut.

Enfin, je recommande d’utiliser la déclaration d’interface lorsque vous avez de nombreuses _props_. Extraire cette interface dans un fichier séparé rend le code du composant plus propre. Vous importerez simplement dans votre composant l’interface.

Pour moi, cela rend le code du composant plus propre.

Vous avez des questions sur le sujet ? Allez lire [la documentation officielle](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) ou [posez vos questions !](../../../page/contactez-moi/index.md)
