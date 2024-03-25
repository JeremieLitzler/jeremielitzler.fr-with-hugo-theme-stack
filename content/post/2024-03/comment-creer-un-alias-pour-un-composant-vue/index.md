---
title: "Comment créer un alias pour un composant Vue ?"
description: "Parfois, vous utilisez des bibliothèques tierces qui développent des composants utiles. Ce fut le cas pour moi avec VeeValidate. Mais les noms des composants peuvent parfois ne pas vous convenir ou respecter les règles de votre linter. Voyons comment résoudre l’un ou l’autre de ces problèmes."
image: images/2024-03-27-code-example-demonstrating-the-concept.jpg
imageAlt: "Exemple de code démontrant le concept"
date: 2024-03-27
categories:
  - Développement Web
tags:
  - Astuce du jour
  - Vue
---

Je me suis retrouvé à utiliser la bibliothèque VeeValidate dans la [Masterclass de VueSchool.io](https://vueschool.io/courses/the-vuejs-3-master-class).

Alors que le cours était dispensé en JavaScript, j’ai décidé de le suivre en TypeScript. Quel défi !

À un moment donné, nous avons dû importer les composants `Form` et `Field` de la bibliothèque de la manière suivante en utilisant JavaScript et l’API Options :

```jsx
import { Form, Field } from "vee-validate" ;
export default {
  composants : {
    VeeForm : Form,
    VeeField : Field,
}
```

Mais comment faire en utilisant TypeScript dans l’API de composition ?

C’est simple : utilisez les alias d’importation.

```jsx
import { Form as VeeForm, Field as VeeField } from "vee-validate";
```

Vous auriez pu utiliser la même technique avec l’API Options, mais vous devez l’utiliser avec l’API Composition :

- suivre les règles du guide de style de Vue
- nommer le composant de la bibliothèque comme vous le souhaitez.

Ensuite, j’ai pu utiliser les composants dans le modèle :

```tsx
<template>
      <vee-form @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>
        <div class="form-group push-top">
          <label for="name">Full Name</label>
          <vee-field
            name="name"
            v-model="form.name"
            id="name"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <vee-field
            name="email"
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <vee-field
            name="password"
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>
          <label for="username">Username</label>
          <vee-field
            name="username"
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </vee-form>
</template>
```
