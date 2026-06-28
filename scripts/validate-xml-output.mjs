#!/usr/bin/env node
// Zero-dependency validator for Hugo's generated XML outputs.
//
// Runs against the built `public/` directory and fails the build (exit 1)
// when a generated XML file is malformed. Most importantly it catches stray
// bytes before the XML declaration (a leading newline or BOM): browsers
// refuse to render such a file even though HTTP status and Content-Type are
// fine. This is the exact regression that broke /sitemap.xml on a mismatched
// Hugo version.
//
// Usage: node scripts/validate-xml-output.mjs

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = "public";
const BASE_URL = "https://iamjeremie.me";

// Files to validate. `sitemap: true` enables the urlset/<loc> assertions.
const TARGETS = [
  { file: "sitemap.xml", sitemap: true },
  { file: "index.xml", sitemap: false },
];

const errors = [];
const fail = (file, msg) => {
  errors.push(`${file}: ${msg}`);
  return false;
};

// The XML declaration must be the very first bytes of the file: no BOM,
// no whitespace, no blank line. This is the check that catches the regression.
function checkProlog(file, buf) {
  if (
    buf.length >= 3 &&
    buf[0] === 0xef &&
    buf[1] === 0xbb &&
    buf[2] === 0xbf
  ) {
    return fail(
      file,
      "starts with a UTF-8 BOM; the <?xml declaration must be the first bytes",
    );
  }
  const text = buf.toString("utf8");
  if (!text.startsWith("<?xml")) {
    const idx = text.indexOf("<?xml");
    const lead =
      idx === -1
        ? "(no <?xml declaration found)"
        : JSON.stringify(text.slice(0, idx));
    return fail(
      file,
      `must start exactly with "<?xml"; found ${lead} before the declaration`,
    );
  }
  return true;
}

// Minimal well-formedness check via a tag-balance tokenizer. Skips the XML
// declaration / processing instructions, comments, CDATA sections and DOCTYPE,
// handles self-closing and namespaced tags. Not a full XML parser, but enough
// to catch unbalanced/unterminated tags in Hugo's sitemap and RSS output.
function checkWellFormed(file, text) {
  const stack = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const lt = text.indexOf("<", i);
    if (lt === -1) break;
    i = lt;
    if (text.startsWith("<?", i)) {
      const end = text.indexOf("?>", i);
      if (end === -1)
        return fail(file, "unterminated processing instruction / declaration");
      i = end + 2;
    } else if (text.startsWith("<!--", i)) {
      const end = text.indexOf("-->", i);
      if (end === -1) return fail(file, "unterminated comment");
      i = end + 3;
    } else if (text.startsWith("<![CDATA[", i)) {
      const end = text.indexOf("]]>", i);
      if (end === -1) return fail(file, "unterminated CDATA section");
      i = end + 3;
    } else if (text.startsWith("<!", i)) {
      const end = text.indexOf(">", i);
      if (end === -1) return fail(file, "unterminated markup declaration");
      i = end + 1;
    } else if (text.startsWith("</", i)) {
      const end = text.indexOf(">", i);
      if (end === -1) return fail(file, "unterminated closing tag");
      const name = text.slice(i + 2, end).trim();
      const top = stack.pop();
      if (top !== name)
        return fail(
          file,
          `tag mismatch: </${name}> closes <${top ?? "nothing"}>`,
        );
      i = end + 1;
    } else {
      const end = text.indexOf(">", i);
      if (end === -1) return fail(file, "unterminated tag");
      const inner = text.slice(i + 1, end);
      const selfClose = inner.endsWith("/");
      const name = inner
        .replace(/\/$/, "")
        .trim()
        .split(/[\s/>]/)[0];
      if (!selfClose && name) stack.push(name);
      i = end + 1;
    }
  }
  if (stack.length) return fail(file, `unclosed tag(s): ${stack.join(", ")}`);
  return true;
}

// Sitemap-specific assertions: a <urlset> root with at least one absolute
// <loc> URL under the configured base URL (also catches a baseURL misconfig).
function checkSitemap(file, text) {
  if (!/<urlset[\s>]/.test(text))
    return fail(file, "missing <urlset> root element");
  const locs = [...text.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) return fail(file, "no <loc> entries found");
  const bad = locs.filter((u) => !u.startsWith(`${BASE_URL}/`));
  if (bad.length) {
    return fail(
      file,
      `${bad.length} <loc> URL(s) not under ${BASE_URL} (e.g. ${bad[0]})`,
    );
  }
  return true;
}

let validated = 0;
for (const t of TARGETS) {
  const path = join(PUBLIC_DIR, t.file);
  if (!existsSync(path)) {
    fail(t.file, `not found at ${path} — run the Hugo build first`);
    continue;
  }
  const buf = readFileSync(path);
  if (!checkProlog(t.file, buf)) continue;
  const text = buf.toString("utf8");
  const ok = checkWellFormed(t.file, text);
  if (ok && t.sitemap) checkSitemap(t.file, text);
  validated += 1;
}

if (errors.length) {
  console.error("✗ XML output validation failed:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ XML output validation passed (${validated} file(s) checked).`);
