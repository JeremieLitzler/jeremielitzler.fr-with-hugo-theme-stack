---
title: "Mise à niveau de TailwindCSS v3 vers v4"
description: "Bien que l'équipe TailwindCSS fournisse un excellent outil de mise à niveau, il est probable que certains d'entre vous ne puissent pas l'utiliser en raison de personnalisations. Voyons comment je m'y suis pris."
image: 2025-06-04-colored-pencils.jpg
imageAlt: Crayons de couleur
date: 2025-09-05
categories:
  - Développement web
tags:
  - Tailwind CSS
---

J’ai suivi une formation Vue.js en décembre dernier et le projet utilisait TailwindCSS v3. Moins de trois mois plus tard, l’équipe Tailwind a lancé la v4 et de nombreux éléments demandaient une adaptation sur les projets existants.

Je n’avais jamais effectué de mise à niveau TailwindCSS auparavant et j’ai suivi le [guide officiel de mise à niveau](https://tailwindcss.com/docs/upgrade-guide). Cela n’a pas fonctionné, car la configuration de Tailwind CSS v3 était trop personnalisée pour être mise à niveau automatiquement.

J’ai essayé de le faire manuellement, mais je ne comprenais pas pourquoi les classes utilitaires ne fonctionnaient pas.

Voici comment j’ai finalement réussi à effectuer la mise à niveau.

## Ma situation initiale

Je devais migrer le projet de TailwindCSS v3 vers v4.

Je ne pouvais pas effectuer la mise à niveau à l’aide de l’outil de mise à niveau en raison d’un fichier `tailwind.config.js` personnalisé.

Le projet utilisait également le traitement PostCSS :

```jsx
  // Extrait du fichier de configuration vite
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
```

## Les premières étapes

J’ai installé `@tailwindcss/vite` et les paquets `tailwindcss` les plus récents en tant que dépendances de développement.

Ensuite, j’ai mis à jour la configuration de Vite afin d’utiliser le plugin `@tailwindcss/vite` dans la section `plugins` et j’ai supprimé complètement la section `css`.

Les autres mises à jour ont été effectuées soit dans le fichier CSS principal, soit dans les styles des composants.

J’ai donc mis à jour le fichier `index.css` avec les directives `@import "tailwindcss";` au lieu de `@tailwind`, comme le suggère la mise à jour manuelle.

Cela signifiait que je devais remplacer `@layer base` par `@layer utilities`.

J’ai également vérifié tous les [utilitaires renommés](https://tailwindcss.com/docs/upgrade-guide#renamed-utilities) et [supprimés](https://tailwindcss.com/docs/upgrade-guide#removed-deprecated-utilities) dans la liste fournie par l’équipe TailwindCSS dans son guide de mise à niveau.

Jusqu’ici, tout allait bien, mais la partie la plus difficile à comprendre venait ensuite.

## Qu’en est-il de `tailwind.config.js` ?

Dans la version 4, on utilise beaucoup moins ce fichier. Cela dépend de votre niveau de personnalisation.

Je ne dirais pas « complètement inutilisé », car nous en avons toujours besoin pour indiquer où nous voulons activer la complétion automatisée afin d’ajouter des classes utilitaires au HTML.

Voici ce que j’ai laissé dans ce fichier :

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

Mais comment convertir l’objet `theme` que nous avions dans la version 3 ?

Commençons par l’objet `container`. Si vous avez :

```jsx
    container: {
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
```

Il s’agit du code CSS que vous ajoutez à votre fichier CSS principal :

```css
@theme {
  /* Container settings */
  --container-padding: 2rem;
  --breakpoint-2xl: 1400px;
}
```

Si vous utilisez `extend` pour les couleurs, la taille des bordures, etc., comme ceci :

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

Vous devrez utiliser la directive `@theme` :

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

Qu’en est-il des `keyframes` ? La méthode est très similaire. À partir de ceci :

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

Vous ajoutez ce qui suit avec la directive `@keyframes` :

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

## Remplacement de `@apply` dans les composants

Nous arrivons maintenant à la dernière partie.

Dans un modèle, j’ai rencontré ce type d’erreur lorsque j’ai exécuté la commande de compilation. Par exemple :

```plaintext
[@tailwindcss/vite:generate:build] Cannot apply unknown utility class: text-slate-500"
```

Le style dans le composant à l’origine de l’erreur était le suivant :

```css
.pencil {
  @apply text-slate-500 cursor-pointer;
}
```

`text-slate-500` est une classe utilitaire couramment utilisée prédéfinie dans TailwindCSS.

Mon projet utilisait beaucoup `@apply`... Je pense que cette fonctionnalité a été largement utilisée par les projets avec TailwindCSS. Elle est utile pour éviter de répéter la même série de classes utilitaires sur plusieurs éléments HTML. Mais comment ai-je résolu ce problème ?

Vous avez trois options :

1. Il vous suffit de copier vos classes utilitaires personnalisées depuis vos composants vers les `composants @layer` de votre fichier CSS principal. Mais cela va à l'encontre de l'objectif recherché et ne fonctionnera pas si vous utilisez l'option `:deep` des composants imbriqués de Vue dans vos styles.
2. Vous utilisez la directive `@utility` pour définir une nouvelle classe utilitaire dans votre fichier CSS principal.
3. Vous importez votre feuille de style principale pour référence dans vos composants. Vous devez le faire dans tous les fichiers où vous utilisez `@apply` pour créer une classe CSS personnalisée qui applique les classes utilitaires Tailwind. Aucune classe utilitaire Tailwind utilisée dans les modèles de vos composants ne nécessite d’ajustements.

   ```css
   /* Importez votre CSS principal dans le composant */
   @reference "@/assets/index.css";

   /* Utilisez les classes utilitaires Tailwind comme auparavant. */
   .pencil {
     @apply text-slate-500 cursor-pointer;
   }
   ```

J’ai choisi la troisième option où j’ai utilisé les sélecteurs CSS `:deep` de Vue et pour le reste, j’ai opté pour la première option.

{{< blockcontainer jli-notice-danger "FAITES ATTENTION si vous utilisez la troisième option partout.">}}

Je ne suis pas sûr qu’il soit judicieux de l’utiliser partout. Pour en savoir plus sur ce sujet, consultez la [documentation sur les directives TailwindCSS](https://tailwindcss.com/docs/functions-and-directives).

{{< /blockcontainer >}}

## Conclusion

Je suis encore en train de me familiariser avec TailwindCSS. D’une certaine manière, je trouve cela intéressant. Vous pouvez rapidement transformer une mise en page à l’aide de la mise en page `flexbox` ou `grid`.

Comme beaucoup d’autres, je m’interroge sur le code HTML _brouillé_ avec ces classes utilitaires. De plus, quelle est la logique pour ajouter les classes ? Est-ce similaire aux fichiers CSS où vous placez d’abord les plus génériques, puis la typographie et enfin la mise en page ?

La version 4 utilise [la fonctionnalité @layer du CSS vanilla](https://developer.mozilla.org/fr-FR/docs/Web/CSS/@layer). À première vue, la cascade s’applique de la même manière que pour les styles habituels. Vous pouvez toutefois modifier explicitement l’ordre de la cascade :

```css
/* Bien que la couche `state` soit définie en premier et doive être remplacée par la couche de module, la balise `@layer module, state` redéfinit l'ordre de la cascade de styles, en appliquant d'abord le module, puis l'état, ce qui rend la couleur d'arrière-plan de la classe `.alert` marron au lieu de jaune. */

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

Plus d’informations sur ce sujet prochainement…

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [Rahul Pandit](https://www.pexels.com/photo/assorted-color-crayons-2078147/).
