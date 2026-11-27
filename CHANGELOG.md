# Changelog

All notable changes to this project are documented here. The project follows [Semantic Versioning](https://semver.org/):
a breaking change to a token name, a class name or a component prop is a major version.

## 1.4.2 (2026-11-27)

Fixes after moving glow.bereg.dev to 1.4.1. No class, token or prop renamed or removed.

- Code Block in a grid or flex: `.code-block` gets `min-width: 0` and `max-width: 100%`, so it no longer grows to its
  longest line (at 320px a two-column grid made the page 814px wide). Long lines scroll inside `<pre>`.
- Code Block inside `.prose`: the `.prose pre` border, radius and background and the `.prose code` size (0.9em) no longer
  reach it (`.prose .code-block pre`, `.prose .code-block code`). One border, code at 14px, as outside `.prose`.
  Inline `code` and a plain `<pre>` in `.prose` are unchanged.
- Tag `as="button"` (`.tag-button`): `inline-flex`, `align-items: center`, `gap: var(--space-1)`, like `.tag-removable`,
  so an icon or a swatch before the text lines up. A tag with only text looks as before.
- Tests and Storybook: Code Block in a two-column grid and inside `.prose`; Tag (button) with a swatch.

## 1.4.1 (2026-11-26)

Fixes after checking 1.4.0 on glow.bereg.dev. No class, token or prop renamed or removed.

- CodeBlock: the button shows "Copied" or "Copy failed" for 2 seconds, then "Copy" again. All three texts share one
  grid cell (`.code-block-copy`), so the button keeps one width (as wide as "Copy failed", a little wider than in 1.4.0).
  The button has no `aria-label` any more: its name is its text, "Copy CSS" (label in hidden text), then "Copied".
  The `role="status"` message stays. Status and button text now clear after 2 s (was 3 s).
- CodeBlock: copying works without the Clipboard API (http on a local network, for example `http://192.168.x.x`):
  a temporary textarea and `execCommand('copy')`; focus returns to the button. New optional prop `onCopy(code)`
  (resolve `true` when copied) for the project's own copy function.
- Tag with `onRemove`: the × keeps its 16×16 look, its target is 24×24 (WCAG 2.5.8) through `.tag-remove::before`.
  The target stays inside the tag, so neighbours in `.tags` do not overlap. The tag's size is unchanged.
- Tests for the above; Storybook: Code Block states Copied and Copy failed, Tag (removable) target area.
- `HOWUPDATEVERSION.md`: the task for this release.

## 1.4.0 (2026-11-26)

Additions only (needed for glow.bereg.dev). Existing classes, tokens and props look and work as before.

- Tokens: `--danger` for errors (dark #ff9e9e: 9.5:1 on `--bg`, 9.0:1 on `--surface`; light #9b1c1c: 7.7:1 and 8.2:1),
  primitives `--prim-red-300` and `--prim-light-red-800`. Spacing `--space-10` (40px) and `--space-12` (48px).
- Forms: `.field` (`.field-label`, `.field-hint`, `.field-error`), `.input` (`--line-strong` border, `--muted` placeholder,
  `aria-invalid="true"` → doubled `--danger` border, dashed in forced colors), `.range` (`accent-color: --accent`).
  React: `Field`, `TextInput`, `Range`.
- Color field: `.color-field` (native color input in a `--line-strong` frame, hex value in mono). React: `ColorField` (`value`, `onChange`).
- Dropzone: `.dropzone` (label around a hidden file input, title, hint; hover, `data-drag`, focus ring around the zone,
  `data-disabled`). React: `Dropzone` (`onFiles(files)`, `accept`, `multiple`).
- Code block: `.code-block` (label, small Copy button, `<pre>` with horizontal scroll and `tabIndex=0`, status message
  for screen readers). React: `CodeBlock` (`label`, `code`).
- Buttons: `.btn-sm` (small) and `.btn[aria-pressed="true"]` (pressed toggle, Highlight in forced colors).
  React `Button`: optional `size="sm"` and `pressed`.
- Tag: interactive variants `.tag-button` and `.tag-removable` / `.tag-remove` (`--line-strong` border, radius 2).
  React `Tag`: optional `as="button"`, `onRemove`, `removeLabel`.
- Section: optional `sectionId` (id on `<section>`) and `headingClassName` (class on `<h2>`).
- Site header: optional sticky header `.site-header-sticky` (React `SiteHeader sticky`), with `scroll-padding-top` on
  `<html>` where `:has()` works. Not sticky in print.
- `base.css`: `.visually-hidden`.
- Tests: the "tokens only" CSS tests read the test file instead of the CSS (Vite rewrote the URL); fixed, with a check
  that they read the CSS. Exception for the 1px hairline gap of `.facts`. Contrast tests include `--danger`.
- Storybook: Components / Forms, Dropzone, Code Block; Button: Small, Toggle; Card: Tag (interactive); Patterns: Section
  anchor, sticky header; `--danger` in the contrast table.

## 1.3.1 (2026-11-19)

- `.prose`: links and inline `code` get `overflow-wrap: anywhere`, so a long URL, path or token without spaces wraps
  instead of overflowing the text column on narrow screens (seen on bereg.dev at 320px). Short links and code look the same.
  Code in `<pre>` keeps its horizontal scroll.
- Grids no longer overflow narrow screens: `.grid`, `.grid-4`, `.grid-wide`, `.quotes` and `.facts` use
  `minmax(min(<size>, 100%), 1fr)`. When the container is narrower than the minimum column (seen on bereg.dev at 320px:
  `.grid-wide` and `.quotes` need 300px, the column is 272px), the single column shrinks to the container instead of overflowing.
  Wide screens: same number and width of columns.
- README and SKILL.md: prefer short link text in prose.
- Storybook: Patterns / Prose, Patterns / Grids.
- Changelog: release date for 1.3.0.

## 1.3.0 (2026-11-19)

- New optional class `.page` (in `base.css`) for `<body>`: `min-height: 100dvh` (`100vh` fallback), flex column,
  `<main>` takes the free space (`flex: 1 0 auto`), `.site-header` and `.site-footer` keep their height. On a short page
  the footer sits at the bottom of the screen; on a long page it follows the content. Turned off in print.
  Without the class nothing changes.
- Storybook: Pages / Page layout, with short and long content.
- Changelog: release date for 1.2.0.

## 1.2.0 (2026-11-19)

- Fonts: own woff2 files in `bereg-ds/fonts/` instead of the Fontsource packages (now dev dependencies only, used by
  `scripts/build-fonts.py`). Hinting removed, Sans weight axis limited to 300 to 700. Subsets latin, latin-ext and cyrillic
  (same `unicode-range` as before); Greek, Vietnamese and Cyrillic Extended dropped, they fall back to the system font.
  Same family names and fallbacks. Latin files: Sans 45.7 → 38.5 KB, Mono 14.7 → 10.1 KB. OFL license in `bereg-ds/fonts/OFL.txt`.
  New export `bereg-ds/fonts/*`; README shows how to preload the Latin Sans file.
- `.text-h1-subtitle` is fluid: `clamp(--font-size-lg, 0.75rem + 1.6vw, --font-size-2xl)`, 20px on phones, 30px on desktop.
- `.subhead` right after `.section-head` has no top margin (was an extra 32px).
- Card focus: the card-wide ring (and hiding the title link ring) only inside `@supports selector(:has(*))`.
  Browsers without `:has()` keep the link's own focus ring; before, they showed no focus at all.

## 1.1.0 (2026-11-18)

- Optional light theme: `bereg-ds/theme-light.css` (not part of `bereg-ds.css`). Follows `prefers-color-scheme`
  unless `<html data-theme="light|dark">` is set. Text contrast 7:1 or more, interactive borders 3:1 or more.
- Light tokens in `tokens/themes/light/*.json` (DTCG) and `bereg-ds/tokens-light.json`.
- Dark theme: `--muted` (`--prim-slate-400`) #8ea3bf → #91a6c2, so muted text on `--surface` is 7.2:1 (was 6.9:1).
- Storybook: docs pages (MDX) follow the theme switch too (before, they followed the system setting); docs links use `--accent`;
  code colors in docs raised to 7:1; contrast table shows border colors as lines, not as text.
- Tests: contrast for both themes, including hover, selection, header and focus colors.
- Storybook: theme switch in the toolbar (Dark, Light, System), Foundations / Themes page, contrast computed from tokens.

## 1.0.0 (2026-11-17)

First release.

- Design tokens in W3C DTCG format (`tokens/*.json`), built with Style Dictionary into CSS variables (rem) and JS/JSON (px).
- Strict scale of 4 for spacing, gaps and radii; type scale close to 1.25 (12 to 80px).
- Dark theme: semantic colors by role, text contrast 7:1 or more, `--line-strong` (3:1+) for interactive borders.
- Fonts: IBM Plex Sans (variable) and Mono through Fontsource, metric-matched fallbacks.
- CSS: base styles and text-style classes, components (Button, Link, Nav Link, Tag, Card, Quote, Book Promo,
  Filter Tab, Section Head, Facts, Timeline, Post list, Site Header, Site Footer, Prose), blueprint grid background,
  optional HDR accents.
- React components (TypeScript) over the same classes.
- Storybook with docs pages, all components and an accessibility check (axe-core) on every story.
