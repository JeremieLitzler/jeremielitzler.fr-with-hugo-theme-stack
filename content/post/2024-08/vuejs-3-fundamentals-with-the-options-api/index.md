---
title: "Vue.js 3 Fundamentals with the Options API"
description: "This article summarizes the notes from the Vue.js 3 Fundamentals with the Options API at VueSchool"
image: images/.jpg
imageAlt: ""
date: 2024-07-01
categories:
  - Développement Web
  - Tutorials
tags:
  - Vue
draft: true
---

{{< blockcontainer jli-notice-tip "If you're interested...">}}

The course is **free** and available [here](https://vueschool.io/courses/vuejs-3-fundamentals?utm_source=JLI_Blog_EN&utm_medium=recommandations).

{{< /blockcontainer >}}

{{< blockcontainer jli-notice-warning "Composition API is nicer">}}

Though the Options API is still usable in Vue 3, I recommend the Composition API. You can learn more about it this [other fundamental course](https://vueschool.io/courses/vue-js-fundamentals-with-the-composition-api?utm_source=JLI_Blog_EN&utm_medium=recommandations).

**However, some concepts explained here are similar in both API style.**

{{< /blockcontainer >}}

## The Two Ways Data Binding

Let's take the example of an array from a list of checkbox when they are all bound to the same data property.

When check a checkbox as declared below, the value is added to `iceCreamFlavors` that is an array in the Vue instance.

```htm
<label>
  <input
    type="checkbox"
    v-model="iceCreamFlavors"
    name="flavorVanilla"
    value="vanilla"
  />
  Vanilla
</label>
<label>
  <input
    type="checkbox"
    v-model="iceCreamFlavors"
    name="flavorCookieCream"
    value="cookies and cream"
  />
  Cookie and cream
</label>
<label>
  <input
    type="checkbox"
    v-model="iceCreamFlavors"
    name="flavorChocolate"
    value="chocolate"
  />
  Chocolate
</label>
<label>
  <input
    type="checkbox"
    v-model="iceCreamFlavors"
    name="flavorStrawberry"
    value="strawberry"
  />
  Strawberry
</label>
```

{{< blockcontainer jli-notice-note "The above code could be improved...">}}

Using the directive `v-for` and an array of options to declare the input, which wasn't the goal here.

{{< /blockcontainer >}}

## User events

We can listen to events using `v-on` directive (shorthand `@`).

- in the script tag:

  ```js
  data() {
    return {
      count: 0
    }
  }
  ```

- in the template:

  ```htm
  <button @click="count++">Add 1</button>
  <p>Count is: {{ count }}</p>
  ```

## Methods

Declared in the script tag, you add them in the option `methods`:

```js
data() {
  return {
    fuel: 'Petrol'
  }
},
methods: {
  startEngine(event) {
    // `this` inside methods points to the current active instance
    alert(`Pumping ${this.fuel}!`)
    // `event` is the native DOM event
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

In the template, you call the method like so:

```htm
<button @click="startEngine">Start</button>
```

Note: the method receive an `event` parameter in the script but it isn't provide in the template. Implicitly, Vue passes on the `$event` object. So the following is the same.

```htm
<button @click="startEngine($event)">Start</button>
```

{{< blockcontainer jli-notice-warning "We cannot use arrow function on methods.">}}

Why? Because of the scope of methods and the `this` keyword.

In an arrow function `this` would not refer to the view application instance.

{{< /blockcontainer >}}

## Conditional rendering

Vue doesn't render the HTML if the code tells Vue not display something.

It is cleaner than a `display: none`!

Using the `v-if` directive behave this way.

However, the `v-show` directive render the HTML and applies the `visibility` CSS property to hide the HTML when the condition is `false`.

## v-bind special cases

What are they? CSS Classes.

For those, we use an object syntax:

```htm
<li
  v-for="{id, label, purchased, highPriority} in items"
  :key="id"
  :class="{strikeout: purchased, priority: highPriority}"
></li>
```

We add as many dynamic classes as we want.

For static classes, simply use the `class` attribut: `<li class="class1 class2"></li>`. In addition, we can add to the binded `:class` attribut.

We can also use the array syntax using `v-bind`, but that results in the same output as native way in HTML.

However, it can become useful in the following usecase:

```htm
<li
    :class="[
        item.purchased ? "some-class-when-true less-bold" : "some-class-when-false",
        item.highPriority ? "highlight" : "regular",
    ]"
>
...
</li>
```

Finally, we can combine the array and object syntax and add static classes, like so:

```htm
<li
    :class="[
        {strikeout: purchased},
        {priority: highPriority},
        "static-class"
    ]"
>
...
</li>
```

Stay tuned for more about Vue. I've a lot of notes to share.
