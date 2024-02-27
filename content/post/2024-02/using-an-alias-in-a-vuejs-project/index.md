---
title: "Using path aliases in a Vue.js project"
description: "The developer experience on Vue.js projects can greatly improve using a simple configuration. Here is how you will make sure your imports are not relatively declared."
image: images/2024-02-19-vite.config.ts-contents.jpg
imageAlt: 'Contents of the "vite.config.ts files'
date: 2024-02-19
categories:
  - Web Development
tags:
  - TypeScript
  - JavaScript
  - Tip Of The Day
---

I find this trick very handy once you have set it up.

## In JavaScript projects

Add the alias to jsconfig.json to have intellisense super powers and the advatange of absolute paths:

```json
{
  "compilerOptions": {
     ...
     "paths": {
      "@/*": ["./src/*"]
    }
    ...
}
```

## In TypeScript projects

1. Install the package: `@types/node` as dev dependency.
2. Import the `fileURLToPath` and `URL`

```typescript
import { fileURLToPath, URL } from "node:url";
```

3. Add the `resolve` option in `vite.config.ts` :

```typescript
   resolve: {
       alias: {
         "@": fileURLToPath(new URL("./src", import.meta.url)),
       },
     },
```

4. Add the alias to `tsconfig.json` to avoid ESLint complaints and have intellisense super powers:

```json
{
"compilerOptions": {
  ...
  "paths": {
    "@/*": ["./src/*"]
  }
  ...
}
```
