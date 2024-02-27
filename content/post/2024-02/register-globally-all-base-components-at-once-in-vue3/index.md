---
title: "Register globally components in Vue3 and TypeScript"
description: "While going through the courses on VueSchool.io, I had to figure out how to register globally available components with Vue 3 and TypeScript. Here is how it is done."
image: images/preview-of-main.ts-file.jpg
imageAlt: "Screenshot of main.ts where the global components are registered"
date: 2024-02-27
categories:
  - Tutorials
tags:
  - Vue
  - TypeScript
#draft: true
---

While the Vue 2 style guide gave the code to do it, the Vue 3 style guide took it off.

So I dug and came across [this post](https://zerotomastery.io/blog/how-to-auto-register-components-for-vue-with-vite/).

The issue with the solution is that the method `globEager` didn’t exist anymore.

To do the same, you can use `.glob(regexString, {eager: true}`.

It gives you a list of object `[string, unknown][]`.

Using JavaScript, ESLint wouldn’t complain, but with TypeScript, you will run into an issue about `unknown`.

The broken code looks like this:

```tsx
//Inspired by:
// - https://zerotomastery.io/blog/how-to-auto-register-components-for-vue-with-vite/
// - https://dev.to/jakedohm_34/auto-registering-all-your-components-in-vue-3-with-vite-4884

const componentFiles = import.meta.glob("@/components/App*.vue", {
  eager: true,
});
const componentFilesEntries = Object.entries(componentFiles);

for (const [componentPath, moduleImport] of componentFilesEntries) {
  const componentName: string | undefined = componentPath
    .split("/")
    .pop()
    ?.replace(".vue", "");

  if (!componentName) {
    console.warn(
      `The componentName couldn't be extracted from path > ${componentPath} `
    );
    continue;
  }
  app.component(componentName!, moduleImport.default);
  console.info(`Registered component <${componentName!}> globally.`);
}
```

Where is the issue? On the `moduleImport.default`.

To solve it, you need to type it.

Using a few `console.log`, I saw that `moduleImport` is of type `Object` with one property `default`, also of type `Object`.

So the solution is to declare an interface of `moduleImport` and you’re good to go:

```tsx
interface ModuleImportInterface {
  default: Object;
}
```

No need to be more specific about `default` in this use case.

Finally, you need to cast the `moduleImport` of `unknown` type to `ModuleImportInterface`:

```tsx
app.component(componentName!, (moduleImport as ModuleImportInterface).default);
```

TypeScript is happy and it works!

This is a great use case casting an unknown-typed variable.

Enjoy!
