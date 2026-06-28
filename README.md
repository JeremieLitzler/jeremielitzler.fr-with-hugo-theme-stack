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
