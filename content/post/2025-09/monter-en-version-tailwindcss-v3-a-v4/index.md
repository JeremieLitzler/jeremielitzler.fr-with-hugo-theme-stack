---
title: "Upgrading TailwindCSS v3 to v4"
description: "Though the TailwindCSS team provides a great tool to upgrade, it is likely that some of you will not fit in that box because of customization. Let’s check out how I did it."
image: 2025-06-04-colored-pencils.jpg
imageAlt: Colored pencils
date: 2025-009-05
categories:
  - Web Development
tags:
  - Tailwind CSS
---

I completed a Vue.js course last December and the project used TailwindCSS v3. Not even 3 months after, the team released TailwindCSS v4 and a lot of parts required adaptation.

I was new to TailwindCSS upgrades and I tried the [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide). It didn’t work because the tailwind CSS v3 setup was too custom to be upgraded automatically.

I tried to do it manually, but I couldn’t understand why the utility classes wouldn’t work.

Here is how I eventually achieve the upgrade.

## My Initial State

I needed to migrate the project from TailwindCSS v3 to v4.

I couldn’t upgrade through the upgrade tool because of a custom `tailwind.config.js` file.

The project also used PostCSS processing:

```jsx
  // Extract of the vite configuration file
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
```

## The First Steps

I installed `@tailwindcss/vite` and the latest `tailwindcss` packages as development dependencies.

Following that, I updated the vite configuration to use the `@tailwindcss/vite` plugin in the Vite’s `plugins` section and remove the `css` section altogether.

The rest of the updates occurred either in the main CSS file or the components’ styles.

So, I updated the `index.css` file with ’@import "tailwindcss;`instead of`@tailwind’ directives, as the manual upgrade suggests.

That meant that I had to replace `@layer base` to `@layer utilities`.

Also, I checked all the [renamed utilities](https://tailwindcss.com/docs/upgrade-guide#renamed-utilities) and [removed utilities](https://tailwindcss.com/docs/upgrade-guide#removed-deprecated-utilities) from the list that the TailwindCSS team provided in their upgrade guide.

So far so good, but the most difficult part I had to understand follows next.

## What About `tailwind.config.js`

In version 4, the file becomes less used. It depends on your level of customization.

I won’t say “unused completely” because we still need it to tell where we want the Intellisense activated to add utility classes to the HTML.

What I had left in this file is listed below:

```css
export default {
  content:
    [ "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
    ];
}
```

But how do you convert the `theme` object that we had in version 3?

Let’s start with the `container` object. If you have:

```jsx
    container: {
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
```

It becomes this CSS code that you add to your main CSS file:

```css
@theme {
  /* Container settings */
  --container-padding: 2rem;
  --breakpoint-2xl: 1400px;
}
```

If you use `extend` for colors, border radius and so on like this:

```jsx
extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
}
```

You’ll need to use the `@theme` directive:

```css
@theme {
  /* Color definitions */
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  /* Border radius */
  --radius: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

What about `keyframes` ? Very similar method. From this:

```jsx
extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
}
```

You add the following with the `@keyframes`directive:

```css
/* Keyframes animations */
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@keyframes collapsible-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
  }
}

@keyframes collapsible-up {
  from {
    height: var(--radix-collapsible-content-height);
  }
  to {
    height: 0;
  }
}
```

## Replacing `@apply’ in the Components

Now, we come to the last part.

In a template, I encountered this kind of error when I ran the build command. For example:

```plaintext
[@tailwindcss/vite:generate:build] Cannot apply unknown utility class: text-slate-500"
```

The styles in the component causing the error was this one:

```css
.pencil {
  @apply text-slate-500 cursor-pointer;
}
```

`text-slate-500` is a commonly used utility class predefined in TailwindCSS.

My project used a lot "@apply"... I think it has been heavily used by projects with TailwindCSS. It is useful to avoid repeating the same series of utility classes on several HTML elements. But how did I solve this issue?

You have three options:

1. You simply copy your custom utility classes from your components into the `@layer components’ of your main CSS file. But that defeats the purpose and it won’t work if you use `:deep` option from Vue’s nested components in your styles.
2. You use `@utility` directive to define a new utility class in your main CSS file.
3. You import your main stylesheet for reference in your components. You need to do that in all the files where you use `@apply` to create a custom CSS class that applies tailwind utility classes. Any tailwind utility class used in the templates of your components doesn’t require adjustments.

   ```css
   /* Import your main CSS in the component */
   @reference "@/assets/index.css";

   /* Use tailwind utility classes as before */
   .pencil {
     @apply text-slate-500 cursor-pointer;
   }
   ```

I chose the third option where I used `:deep` CSS selectors from Vue and for the rest, I went for the first option.

{{< blockcontainer jli-notice-danger "BE CAREFUL about using the third option everywhere">}}

I’m not sure it’d be wise to use it everywhere. Read more in the [documentation about the TailwindCSS directives](https://tailwindcss.com/docs/functions-and-directives) about this topic.

{{< /blockcontainer >}}

## Conclusion

I’m still getting the hang of TailwindCSS. In a way, I find it interesting. You can quickly transform a layout using flexbox or grid layout system.

Like many out there, I’m wondering about the blotted HTML with those utility classes. Also, what is the logic to add the classes? Is it similar to the CSS files where you put the most generic first, then the typography and, finally, the layout?

Version 4 uses [the `@layer` feature of vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer). And from a quick look at this, the cascading applies in a similar way to the usual styles. You can, however, explicitly change the order of cascading:

```css
/* though the state layer is defined first and should be overriden
   by the module layer, the "@layer module, state" redefines the 
   order of the style cascade, applying module first and then state,
   making the ".alert" class background color to be brown instead of 
   yellow.
*/

/* statement at-rule */
@layer module, state;

/* block at-rule */
@layer state {
  .alert {
    background-color: brown;
  }
  p {
    border: medium solid limegreen;
  }
}

/* block at-rule */
@layer module {
  .alert {
    border: medium solid violet;
    background-color: yellow;
    color: white;
  }
}
```

More on the topic soon…

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}

Photo by [Rahul Pandit](https://www.pexels.com/photo/assorted-color-crayons-2078147/).
