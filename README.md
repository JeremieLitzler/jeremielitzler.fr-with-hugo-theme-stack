# Hugo Theme Stack Starter Template

This is a quick start template for [Hugo theme Stack](https://github.com/CaiJimmy/hugo-theme-stack). It uses [Hugo modules](https://gohugo.io/hugo-modules/) feature to load the theme.

It comes with a basic theme structure and configuration. GitHub action has been set up to deploy the theme to a public GitHub page automatically. Also, there's a cron job to update the theme automatically everyday.

## Updating theme manually

Make sure Prettier is setup with the extension to setup `.html` files mixing Golang code with HTML.

In this repo, it is included:

```bash
bash init-prettier-golang-html-formatter.sh
```

Then, add a `.prettierrc` file with:

```json
{
  "plugins": ["prettier-plugin-go-template"],
  "overrides": [
    {
      "files": ["*.html"],
      "options": {
        "parser": "go-template",
        "goTemplateBracketSpacing": true,
        "bracketSameLine": true
      }
    },
    {
      "files": ["*.js", "*.ts"],
      "options": {
        "useTabs": true,
        "printWidth": 120,
        "singleQuote": true
      }
    }
  ]
}
```

**MAKE SURE TO run `hugo build` before pushing !**

Source: [gohugo Forum](https://discourse.gohugo.io/t/formatter-for-go-templates/38403)

### Deploy somewhere else than Netilf?

If you want to build this site using another static page hosting, you need to make sure they have Go installed in the machine.

You need to overwrite build command to install manually Go:

```sh
amazon-linux-extras install golang1.11 && hugo --gc --minify
```

![Build setup](https://user-images.githubusercontent.com/5889006/156917172-01e4d418-3469-4ffb-97e4-a905d28b8424.png)

Make sure also to specify Hugo version in the environment variable `HUGO_VERSION` (Use the latest version of Hugo extended):

![Environment variable](https://user-images.githubusercontent.com/5889006/156917212-afb7c70d-ab85-480f-8288-b15781a462c0.png)

## Dart Sass

The theme stylesheets are compiled with [Dart Sass](https://gohugo.io/functions/css/sass/#dart-sass), because libsass was deprecated in Hugo v0.153.0. Hugo does not bundle Dart Sass: it uses the `sass` executable it finds on the `PATH`. Run `hugo env` to check: it must list `github.com/sass/dart-sass/compiler`.

The pinned version is **1.107.0**. Keep the local install and `DART_SASS_VERSION` in `netlify.toml` on the same version.

### Local machine (Windows)

Install it with [Scoop](https://scoop.sh/):

```sh
scoop install sass
sass --version
hugo env
```

To upgrade later, run `scoop update sass`, then bump `DART_SASS_VERSION` in `netlify.toml` to the version `sass --version` prints.

### Netlify

`netlify.toml` sets `DART_SASS_VERSION` in `[build.environment]`. The build command downloads the matching Linux release tarball from GitHub, extracts it to `~/.local/dart-sass`, adds it to the `PATH` and runs `hugo env` (so the build log shows the Dart Sass version Hugo detected) before `npm run build:ci`. This is the method from [Hugo's Netlify guide](https://gohugo.io/host-and-deploy/deploy-to-netlify/).

### How the theme is switched to Dart Sass

The vendored theme (`themes/hugo-theme-stack`) is never edited, so it can be upgraded cleanly. Its three partials that compile Sass with `toCSS` (libsass) are overridden under the root `layouts/_partials/`:

- `head/style.html` (the main stylesheet),
- `comments/provider/artalk.html` and `comments/provider/disqusjs.html` (unused while comments are disabled, but overridden so enabling them does not bring libsass back).

Each override is a copy of the theme partial where `toCSS` becomes `css.Sass (partial "helper/sass-options.html")`. When upgrading the theme, diff these three files against the new theme versions and carry over any upstream change.

### Silenced deprecation warnings

Dart Sass reports two deprecations in the theme's SCSS, both removed in Dart Sass 3.0.0:

- `import`: the theme uses `@import` rather than `@use`,
- `global-builtin`: the theme calls global built-in functions such as `map-get` rather than `sass:map` module functions.

`layouts/_partials/helper/sass-options.html` silences these two IDs with `silenceDeprecations`. They are silenced rather than fixed because every offending file belongs to the vendored theme, and the site has no SCSS of its own. Fixing them would mean copying the theme's SCSS into the root `assets/` and maintaining a fork of it. The migration belongs upstream: when the theme moves to `@use` and `sass:*` modules, remove the IDs from the helper. Before upgrading to Dart Sass 3.0.0, check that the theme has done this, since silencing will not keep `@import` working there.

## Validating generated XML outputs

A mismatched Hugo version once emitted a blank line before the `<?xml` declaration in `sitemap.xml`, which made browsers refuse to render it (the HTTP status and `Content-Type` were fine, hiding the problem).

To catch this on every build, `scripts/validate-xml-output.mjs` is a zero-dependency Node script that checks `public/sitemap.xml` and `public/index.xml` for:

- the `<?xml` declaration being the first bytes (no BOM, whitespace, or blank line),
- well-formedness (balanced tags), and
- sitemap `<loc>` URLs being absolute under the site base URL.

It runs after the Hugo build via `npm run build:ci` (the Netlify build command), so a malformed file fails the deploy. Run it locally with:

```sh
npm run build:ci
```
