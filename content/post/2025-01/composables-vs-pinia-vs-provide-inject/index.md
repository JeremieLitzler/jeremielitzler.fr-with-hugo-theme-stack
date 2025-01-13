---
title: "Composables vs Pinia vs Provide/Inject"
description: "Let me break down the key differences and use cases for each approach to state management in Vue 3."
image: 2025-01-13-sea-current-stone-pile.jpg
imageAlt: Sea current stone pile
date: 2025-01-15
categories:
  - Web Development
tags:
  - Vue
draft: true
---

When using Vue, composables, Pinia stores and the provide/inject functionality each play a role in specific use cases.

I’ll share in this article what I’ve learned about them while working on Vue.js projects.

## The Differences

### Composables

They’re best for:

- Reusable stateful logic that is specific to a feature or component.
- Local state management where you need multiple instances of the same state (e.g., multiple news widgets with different categories).
- Performance-critical features, as composables are about 1.5x faster than Pinia for reactive changes and 20x faster for ref changes.
- Simple state management without external dependencies

Read [more here](https://vue-faq.org/en/development/stores.html).

### Pinia Stores

You would use them in:

- Application-wide state that needs to be accessed from multiple components, which is also true for composables.
- Complex state management requiring DevTools integration for debugging.
- Server-Side Rendering (SSR) applications with global state.

### Provide/Inject

Finally, this native Vue feature allows to you:

- To pass data through multiple component layers without prop drilling.
- To avoid making state globally accessible to unrelated components.

### Practical Examples

Let’s start with a composable example:

```ts
// This state valid globally
const menuOpen = ref(false);

export const useMenu = () => {
  // This state would be valid for a single instance
  // const menuOpen = ref(false)
  const toggleMenu = () => (menuOpen.value = !menuOpen.value);

  return {
    menuOpen,
    toggleMenu,
  };
};
```

Next, let’s take a look at a Pinia example:

```ts
// Global page title state using a script setup approach
export const usePageStore = defineStore("page-store", () => {
  const pageData = ref({
    title: "",
  });

  return {
    pageData,
  };
});

// Enable HMR on the store
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot));
}
```

Finally, what about using Provide/Inject When. It’ll seem more complex at first, but read again the use cases above to understand when to use this feature:

- first, we create the file containing the inject keys:

```typescript
import type { InjectionKey } from "vue";
import User from "./types/User";

//create a unique InjectionKey since provide requires that.
// Using a Symbol guaranteed the unicity. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
export const userInjectionKey = Symbol() as InjectionKey<User>;
```

- then, we provide the value in `App.vue`:

```typescript
import { provide } from "vue";
import { userInjectionKey } from "@/injectKeys";

provide(userInjectionKey, user);
```

- and we use it in any component of the application:

```typescript
import { inject } from "vue";
import { userInjectionKey } from "@/injectKeys";

const user = inject(userInjectionKey);
```

NB: by default, TypeScript knows the injected object could be null. So when you use in the template of the component using the value, think about it.

```htm
<span>{{ user?.username || "Anonymous" }}</span>
```

## Best Practice Between Pinia and Composables for API requests

There isn’t a one-size-fits-all solution, but here’s a practical breakdown for handling API requests:

### Composables for API Requests

Composables are often the better choice for API requests when:

- You need multiple independent instances of the same API logic
- The data is scoped to a specific feature or component tree.
- Performance is critical, as composables are significantly faster than Pinia for reactive changes.

### When to Use Pinia Instead

Pinia becomes more valuable for API requests when:

- The data needs to be shared across multiple unrelated components.
- You need built-in DevTools for debugging API calls.
- The data represents global application state.

### Best Practice Pattern

A recommended approach is to use a layered architecture:

```tsx
// apiService.ts
const apiService = {
  users: {
    get: () => axios.get("/users"),
    create: (user) => axios.post("/users", user),
  },
};

// useUsers.ts (composable)
export function useUsers() {
  const users = ref([]);
  const isLoading = ref(false);

  const fetchUsers = async () => {
    isLoading.value = true;
    users.value = await apiService.users.get();
    isLoading.value = false;
  };

  return { users, isLoading, fetchUsers };
}
```

### Hybrid Approach

For larger applications, consider:

- Using composables for feature-specific API calls and data management.
- Using Pinia for global state that needs to persist across the application.
- Separating API calls into dedicated service layers.
- Using composables within Pinia stores when needed. I haven’t used that so far, but I read about it [in the Pinia documentation](https://pinia.vuejs.org/cookbook/composables.html).

The key is to avoid duplicating API calls across multiple components and to keep the data fetching logic organized and maintainable. If you’re building a small to medium-sized application, composables might be sufficient. For larger applications with complex state management needs, combining both approaches often yields the best results.

## Conclusion

Thanks for reading this far! Did you learn something? If so, share it!

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}

Credit: photo by [Pixabay](https://www.pexels.com/photo/cairn-stones-and-body-of-water-in-distance-235990/)
