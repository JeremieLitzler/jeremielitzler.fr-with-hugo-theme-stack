---
title: "Directives personnalisées avec Vue 3 et TypeScript"
description: "Parfois, vous serez amener à créer des directives personnalisées avec Vue.js. Voyons comment vous pouvez le faire en utilisant TypeScript."
image: images/2024-03-22-example-of-a-custom-directive.png
imageAlt: "Exemple d'une directive personnalisée."
date: 2024-03-22
categories:
  - Développment Web
tags:
  - Astuce du jour
  - Vue.js
---

## Le point de départ

J’apprends chaque jour à utiliser et à améliorer mon utilisation de TypeScript.

Aujourd’hui, je vais vous partager comment j’ai converti de JavaScript à TypeScript une directive personnalisée dans Vue 3.

Le code JavaScript était le suivant :

```tsx
const ClickOutsideDirective = {
  mounted(el, binding) {
    el.__clickOutsideHandler__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.__clickOutsideHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.__clickOutsideHandler__);
  },
};
export default (app) => {
  app.directive("click-outside", ClickOutsideDirective);
};
```

## L'explication détaillée

La première chose à traiter est les deux arguments du _hook_ `mounted` et l’argument du _hook_ `unmounted`.

Ce n’est pas bien documenté [dans la documentation officielle](https://vuejs.org/guide/reusability/custom-directives.html), mais si vous creusez dans le code de Vue.js (ou [trouvez les fils de Stackoverflow](https://stackoverflow.com/a/76337333/3910066) 😁), vous pouvez trouver plus d’informations sur l’interface.

Vous devez ainsi typer la directive personnalisée avec `<Directive<T, V>>` où :

- `T` est le type de l’élément DOM où vous utilisez la directive.
- `V` est le type de la valeur passée à la directive dans le modèle.

Dans mon cas, `T` est `HTMLElement` et `V` est une `Fonction`.

Il m’a fallu un moment pour comprendre le type `V`. Mais je l’ai trouvé en pressant `F12` sur `value` dans la ligne `binding.value(event);`.

Vous pouvez alors voir la définition de l’interface `DirectiveBinding` et `value` a le type générique `V`.

Mais comment connaître le type en fonction d’un cas d’utilisation différent ?

Il suffit de regarder ce que vous passez comme valeur à votre directive personnalisée. Dans mon exemple, je passe une fonction :

```html
<!-- closeDropdown is a method defined in the component -->
<a @click.prevent="toggleMenu" v-click-outside="closeDropdown" href="#"
  >Toggle
</a>

<!-- or an anonymous function -->

<a
  @click.prevent="toggleMenu"
  v-click-outside="() => menuOpened = false"
  href="#"
  >Toggle
</a>
```

Ensuite, la bonne pratique pour construire une directive personnalisée nécessite de définir un récepteur d’événement personnalisé pour l’élément DOM. Par conséquent, vous devez définir une interface (dans le fichier de la directive personnalisée puisque vous ne l’utiliserez qu’à cet endroit) :

```tsx
interface ClickOutsideDirectiveHTMLElement extends HTMLElement {
  __clickOutsideHandler__: EventListener;
}
```

Vous avez une propriété typée `EventListener` qui est le nom du récepteur d’événement personnalisé. Vous devez vous assurer que l’interface étend le type `T`, dans notre cas un `HTMLElement`.

Ensuite, il suffit de typer :

- L’argument `event` dans la définition du récepteur d’événement personnalisé en tant que `Event`.
- L’argument `[event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)` doit être converti en `Node` où vous vérifiez si l’élément contient la cible.
- L’argument `app` sur l’export final.

## Le code final

```tsx
import { App } from "vue";

interface ClickOutsideDirectiveHTMLElement extends HTMLElement {
  __clickOutsideHandler__: EventListener;
}

import { Directive } from "vue";

const ClickOutsideDirective = <
  Directive<ClickOutsideDirectiveHTMLElement, Function>
>{
  mounted(el, binding) {
    el.__clickOutsideHandler__ = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.__clickOutsideHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.__clickOutsideHandler__);
  },
};
export default (app: App) => {
  app.directive("click-outside", ClickOutsideDirective);
};
```

Vous êtes maintenant prêt. Allez créer vos propres directives Vue 3 avec TypeScript !
