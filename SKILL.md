---
name: bereg-ds
description: Konstantin Beregovoy's design system (Engineering Blueprint, dark, IBM Plex). Use when building or changing UI in one of Konstantin's projects. First ask which design system the project uses; apply Bereg DS only if the answer is Bereg DS.
---

# Bereg DS

## Step 1: always ask first

Before writing or changing any UI, ask:

> Which design system does this project use: Bereg DS (my own) or another one?

- **Bereg DS** → follow this skill.
- **Another system** (a work project, a client's design system, Tailwind theme, MUI...) → do **not** apply Bereg DS.
  Do not import its CSS, do not use its tokens, colors, fonts or class names. Work only with the project's own system.
- **Not sure / no answer** → do not apply Bereg DS; ask again before styling anything.

Do not mix systems in one project.

## Step 2: install and import

```sh
npm i bereg-ds
```

```js
import 'bereg-ds/bereg-ds.css';            // fonts + tokens + base + components
import { Button, Card } from 'bereg-ds/react'; // only in React projects
// import 'bereg-ds/hdr.css';               // only if an HDR accent is asked for
// import 'bereg-ds/theme-light.css';       // only if the project needs a light theme
```

Without React, use the same CSS classes in HTML (see README.md).

## Rules

1. **Use components first.** Button, Link, NavLink, Tag/Tags, Card, Quote, BookPromo, FilterTabs, Sections/Section,
   Facts, Timeline, PostList, Subhead, SiteHeader, SiteFooter, Wrap. Do not restyle them per page.
2. **Tokens only.** Colors: `var(--bg)`, `--surface`, `--text`, `--muted`, `--line`, `--line-strong`, `--accent`,
   `--accent-ink`, `--highlight`, `--focus`. Never hard-code hex colors or primitives (`--prim-*`).
3. **Scale of 4.** Spacing, gaps and radii only from `--space-1` (4px) … `--space-16` (64px) and `--radius-sm|md|lg`.
   No 6px, 10px, 14px. Strokes `--border-thin|medium|thick` in px.
4. **Type.** Use the text-style classes (`.text-h1`, `.text-h2`, `.text-h3`, `.text-lede`, `.text-body`, `.text-small`,
   `.text-meta`, `.text-label`, `.text-caps`, `.text-tag`, `.text-code`, `.text-footnote`, `.text-caption`, `.text-strong`) or `--font-size-*` tokens. Fonts: `var(--font)`,
   `var(--mono)`. Sizes in rem, line height unitless.
5. **Accessibility.** Borders that identify an interactive element use `--line-strong`; `--line` is decorative.
   Keep the focus ring (`:focus-visible`, 3px `--focus`, offset 3px). Underline links. Every section has a heading
   (`Section` does it). Respect `prefers-reduced-motion` and `forced-colors`.
6. **Dark by default.** Add `theme-light.css` only if the project asks for a light theme. Never invent colors for
   either theme; use the semantic tokens so both themes work. The theme switch and its storage live in the project.
7. **HDR only when asked**, for one accent at a time, always with an SDR fallback (`hdr.css`).
8. **Page layout.** Put `class="page"` on `<body>` with `<main>`, `.site-header` and `.site-footer` as its direct
   children, so the footer sits at the bottom of short pages: `body.page > a.skip, header.site-header, main, footer.site-footer`.
9. **Exceptions stay in the project.** If a design needs a value the system does not have, put it in the project's
   own CSS with a comment, and tell Konstantin. Do not edit the package for one project.

## Links

- Docs and live components: https://ds.bereg.dev
- Figma: https://www.figma.com/design/nWkFlhkomx90UBXw6nFAQj
- npm: https://www.npmjs.com/package/bereg-ds
- Source: https://github.com/KonstantinBeregovoy/bereg-ds
