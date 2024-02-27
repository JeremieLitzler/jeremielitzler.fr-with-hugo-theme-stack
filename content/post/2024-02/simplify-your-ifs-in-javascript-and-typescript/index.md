---
title: "Simplify your ifs in JavaScript and TypeScript"
description: "Code quality, is that something you take care of in your everyday tasks? I do. But sometimes, it is not simply just about saving keystrokes or a number of characters. Let’s dive into it"
image: images/2024-02-23-code-sample.jpg
imageAlt: "Contents of a TypeScript file"
date: 2024-02-23
categories:
  - Web Development
tags:
  - TypeScript
  - Tip Of The Day
---

Let’s suppose you have the following:

```jsx
const result = value1;
if (result === null || result === undefined) {
  result = value2;
}
```

How can you reduce it to one line without writing `if` ?

```jsx
const result = value1 ?? value2;
```

OK, you gain 3 lines, but before you use it everywhere, think about 2 things for your use cases:

1. Is it changing something to the performance of your application?
2. Is it going to be as readable as the 3 lines to anyone, senior and junior?

Maybe, in the example, it’s OK to use the Nullish coalescing operator.

I would say it isn’t always the case.

Please read the [MDN article on the _Nullish coalescing operator_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) on the topic.

Also check out this [_javascripttutorial.net_ article](https://www.javascripttutorial.net/es-next/javascript-nullish-coalescing-operator/) which I liked because it goes in detail with nice use cases.

Thanks for reading.
