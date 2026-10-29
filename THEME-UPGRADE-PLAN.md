# Theme upgrade plan: hugo-theme-stack v3.34.x to v4.0.3 (issue #2)

**Status: plan v1, awaiting review.** Nothing outside this file has changed yet.

Issue #2 says "Idem à" [iamjeremie.me #9](https://github.com/JeremieLitzler/iamjeremie.me-with-hugo-theme-stack/issues/9). That upgrade landed as commit [`38e4f9b`](https://github.com/JeremieLitzler/iamjeremie.me-with-hugo-theme-stack/commit/38e4f9b), and its full inventory and decisions are in that repo's [`THEME-UPGRADE-PLAN.md`](https://github.com/JeremieLitzler/iamjeremie.me-with-hugo-theme-stack/blob/master/THEME-UPGRADE-PLAN.md). This plan does not repeat it: it lists what is the same here, and only details what differs on jeremielitzler.fr.

## Starting point compared with iamjeremie.me before its upgrade

- **Vendored theme:** same v3.34.x code. The only difference is `config.yaml` here versus `hugo.yaml` + `wrangler.toml` there (theme demo config, unused by the site).
- **`layouts/`:** exactly the same set of files. Once line endings and whitespace are ignored, only these differ:
  - `page/search.html`: French label ("Saisissez votre recherche :") and checkbox text ("Exécuter la recherche avec les termes exacts de la saisie").
  - `partials/article/components/mermaid.html`: still the older hand-written Mermaid script (ESM import from jsDelivr, light theme `default`, dark theme `neutral`, no modal or zoom). iamjeremie.me had already hand-ported v4's Mermaid (modal, zoom, `assets/ts/mermaid.ts`) before its upgrade, then dropped the override. See decision D1.
  - `shortcodes/contact-form.html`, `shortcodes/donate-options.html`: French text, Tally form and Stripe links. Custom-only, untouched by the upgrade.
- **`config/`:** same structure; differences are language (`fr`), titles, menu, date formats and French strings. No `[article.mermaid]` block here (iamjeremie.me has one).
- **`i18n/`:** no project-level folder. The widget and taxonomy-cloud keys v4 dropped (`accessibleLabel`, `allDivParagraph`, `allDivLinkText`, `taxoMisc.searchForm.*`) come from the theme's `i18n/fr.yaml` today.
- **Content:** 4 files with `relcanonical:` front matter, 61 with `seoNoIndex`, 4 with an SVG featured image, 1 using Mermaid.
- **No `.github/workflows/`**, so there is no `update-theme.yml` to delete.

## Steps

1. Replace `themes/hugo-theme-stack/` with the upstream v4.0.3 tag source (`https://github.com/CaiJimmy/hugo-theme-stack`, tag `v4.0.3`, commit `3e123a3`), still vendored as a plain folder, and check it matches the folder iamjeremie.me vendored.
2. Port `layouts/` from iamjeremie.me's post-upgrade state at `38e4f9b` (not its current `master`, which also holds the later Dart Sass overrides that belong to issues #5 to #8 here), then re-apply this site's differences:
   1. `page/search.html`: keep the two French strings.
   2. `shortcodes/contact-form.html`, `shortcodes/donate-options.html`, `shortcodes/blockcontainer.html`, `shortcodes/substack-optin.html`, `sitemap.xml`, `miscellaneous/taxonomy-cloud-page.html`: keep this repo's files, only fixing what v4 requires (the `helper/image` call in `taxonomy-cloud-page.html`, as on iamjeremie.me).
   3. Every other override (`_markup/*`, `_partials/**`, `home.html`, `list.html`, `archives.html`) takes iamjeremie.me's `38e4f9b` version, since the v3 originals here are the same file for file. This brings over, unchanged: the `IsList` header/details merge, the restored `defaultImage.opengraph` fallback, the SVG guards on `Resize`/`Fill`, and the `render-link.html` merge (`.md` links via `relref` plus v4's external-link attributes).
   4. Remove the same no-op and dead files as iamjeremie.me: `404.html`, `_default/_markup/render-heading.html`, `_default/_markup/render-image-webp.html`, `partials/image-converter.html`, `partials/article/components/*-from-article-list.html`, `partials/article-list/default.html`, `partials/article/article.html`.
   5. Mermaid: per decision D1.
3. Add `i18n/fr.toml` carrying the dropped keys with today's French wording, taken from the current theme `fr.yaml`:
   - `widget.tagCloud`: title "Top {{ .MaxInCloud }} mots clés", accessibleLabel "Cliquer pour voir les mots clés", allDivParagraph "Mot clé manquant ? Seuls les {{ .MaxInCloud }} plus utilisés sont listés ici.", allDivLinkText "Consulter tous les mots clés".
   - `widget.categoriesCloud`: the same four keys with "catégories" wording.
   - `taxoMisc.searchForm`: title "Filtrer", executeBtnTitle "Lancer la recherche", and placeholder "Filtrer..." (undefined today, so it renders blank; iamjeremie.me added it). See decision D3.
4. `config/_default/params.toml`, same changes as iamjeremie.me:
   - `[sidebar.avatar]` table becomes `avatar = "img/profilepic-400w.jpg"`.
   - `[article] headingAnchor = true`.
   - Remove the stray `[[widget.tagCloud]] title = "Catégories"` block (singular `widget`, read by nothing).
5. Rename `relcanonical:` to `canonicalUrl:` in the 4 content files and switch `head.html` to `.Params.canonicalUrl`, as on iamjeremie.me. Two of the 4 are the French tutorials about this very parameter (`2024-03/ajouter-une-url-canonique-a-chaque-article-avec-hugo`, `2024-08/un-bon-referencement-avec-hugo`): add a `{{% blockcontainer %}}` note to each rather than rewriting their prose or code samples. See decision D2.
6. Keep `seoNoIndex` handling in `head.html` (iamjeremie.me's ported `head.html` already does).
7. Build with `hugo --gc --minify` and `npm run build:ci`, fix errors and warnings (the libsass deprecation warning stays until issues #5 to #8).
8. Compare before and after in headless Chrome: home, an article with a cover image, an article with an SVG cover (`2025-12/bonnes-pratique-devops-un-exemple-avec-azure-devops`), the Mermaid demo (`2026-01/demo-de-mermaid-diagrams`), archives, a category page, search, and the taxonomy cloud page, in light and dark mode. Check headings, canonical tag, `noindex`, avatar, cover images, widgets and the French strings.
9. Keep this file as a record, as on iamjeremie.me.

## Decisions to make

- **D1, Mermaid.** Recommended: **drop the override and use v4's built-in Mermaid**, as iamjeremie.me did. That adds the modal and zoom, and builds `ts/mermaid.ts` from the theme. To keep today's dark look, add an `[article.mermaid]` block with `darkTheme = "neutral"` (v4's default is `dark`). Alternative: keep the older custom script as an override under `_partials/`.
- **D2, `relcanonical` note wording** in the two French tutorials. Proposed, a translation of the note iamjeremie.me added in the same place:

  ```markdown
  {{< blockcontainer jli-notice-note "Mise à jour suite au passage à hugo-theme-stack v4">}}

  Le champ personnalisé `relcanonical` décrit ci-dessus a été utilisé jusqu'au passage du site à hugo-theme-stack v4. Cette version gère nativement une URL canonique personnalisée : le champ a donc été renommé `canonicalUrl` dans tous les articles du site pour l'utiliser directement.

  {{< /blockcontainer >}}
  ```

- **D3, taxonomy filter placeholder.** Recommended: add "Filtrer..." (it is blank today). Alternative: leave it undefined so the output is unchanged.
