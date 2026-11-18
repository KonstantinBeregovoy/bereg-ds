# Bereg DS

The **Engineering Blueprint** design system by [Konstantin Beregovoy](https://bereg.dev): dark, technical, drawn like a blueprint.
Design tokens, CSS components and React components from one source.

- **Docs and live components:** [ds.bereg.dev](https://ds.bereg.dev) (Storybook)
- **Figma:** [Bereg DS](https://www.figma.com/design/nWkFlhkomx90UBXw6nFAQj)
- **npm:** [bereg-ds](https://www.npmjs.com/package/bereg-ds)
- **Live example:** [bereg.dev](https://bereg.dev)
- **Case study:** [bereg.dev/projects/bereg-ds](https://bereg.dev/projects/bereg-ds/)

## Install

```sh
npm i bereg-ds
```

IBM Plex Sans and Mono come with it (self-hosted through Fontsource, no Google Fonts).

## Use with CSS (any project: Astro, plain HTML, Vue...)

```js
import 'bereg-ds/bereg-ds.css'; // fonts + tokens + base + components
```

```html
<a class="btn btn-primary" href="/projects/">Projects</a>
<article class="card">
  <span class="meta">Open source · 2026</span>
  <div class="card-body">
    <h3 class="card-title"><a class="stretch" href="/projects/hdr-glow/">hdr-glow</a></h3>
    <p class="card-text">Makes selected colors glow on HDR screens.</p>
  </div>
  <ul class="tags" aria-label="Stack"><li>TypeScript</li><li>React</li></ul>
</article>
```

Import only what you need:

| File | What |
|---|---|
| `bereg-ds/fonts.css` | IBM Plex Sans (variable) and Mono 400, metric-matched fallbacks |
| `bereg-ds/tokens.css` | CSS variables: colors, spacing, radii, type scale, motion |
| `bereg-ds/base.css` | Page defaults, headings, text-style classes (`.text-h1`, `.text-meta`...), `.blueprint` grid |
| `bereg-ds/components.css` | Components: `.btn`, `.card`, `.quote`, `.tag`, `.filter-tab`, `.section-head`, `.subhead`, `.facts`, `.timeline`, `.posts`, `.book-promo`, `.site-header`, `.site-footer`, `.prose`, `.wrap` |
| `bereg-ds/hdr.css` | Optional HDR accents (`.hdr-logo`, `.hdr-card`) |
| `bereg-ds/theme-light.css` | Optional light theme (see below) |

## Light theme (optional)

Dark is the default. Projects that need a light theme add one file; projects that stay dark do not load it.

```js
import 'bereg-ds/bereg-ds.css';
import 'bereg-ds/theme-light.css';
```

It follows the system setting (`prefers-color-scheme`). `<html data-theme="light">` or `data-theme="dark"` overrides it.
The switch, `localStorage` and a small inline script against the flash on load are up to the project:
see [Foundations / Themes](https://ds.bereg.dev/?path=/docs/foundations-themes--docs).

## Use with React

```tsx
import 'bereg-ds/bereg-ds.css';
import { Button, Card, Section, Sections } from 'bereg-ds/react';

<Sections>
  <Section id="projects" title="Selected projects" link={{ href: '/projects/', label: 'All projects' }}>
    <Card meta="Open source · 2026" title="hdr-glow" href="/projects/hdr-glow/" tags={['TypeScript', 'React']}>
      Makes selected colors glow on HDR screens.
    </Card>
  </Section>
</Sections>
<Button href="/contact/">Contact</Button>
```

React components only render markup and classes; all styles live in the CSS, so CSS and React look the same.
React is an optional peer dependency (18 or newer).

Components: `Button`, `Link`, `NavLink`, `Tag`, `Tags`, `Card`, `Quote`, `BookPromo`, `FilterTabs`, `Sections`, `Section`,
`Facts`, `Timeline`, `PostList`, `Subhead`, `SiteHeader`, `SiteFooter`, `Wrap`.

## Tokens in JavaScript

```js
import { colorAccent, space4 } from 'bereg-ds/tokens'; // px values
import tokens from 'bereg-ds/tokens.json';
import light from 'bereg-ds/tokens-light.json'; // light theme colors
```

The source tokens (W3C DTCG format) are in `tokens/*.json`, the light theme in `tokens/themes/light/*.json`.

## Rules of the system

1. **Strict scale of 4.** Spacing, gaps and radii are multiples of 4. The name is the multiplier: `--space-3` = 12px.
   Strokes (1/2/3px), corner ticks (11/22px) and breakpoints (640/760px) are separate sizes.
2. **Tokens only.** No raw colors or pixel spacing in components (a test checks it).
3. **Units.** Font sizes and spacing in rem, line height without units, letter spacing in em, strokes in px,
   breakpoints in em in media queries (`40em`, `47.5em`). The `--bp-sm`/`--bp-md` tokens (640/760px) are for reference:
   CSS variables do not work in media queries.
4. **Accessibility.** Text contrast 7:1 or more. Interactive borders use `--line-strong` (3:1 or more),
   `--line` is decorative only. Visible focus on every interactive element. Links are underlined.
   Respects `prefers-reduced-motion` and `forced-colors`.
5. **Dark by default.** The light theme is an optional file with the same token names.
6. **HDR is an optional accent**, not a default.
7. **Exceptions belong to the project.** A special case lives in that project's CSS, not in the system.

## Develop

Node version is pinned in `.nvmrc` (`nvm use`).

```sh
npm install
npm run build        # tokens -> dist/css/tokens.css + dist/tokens, CSS, React
npm test             # component and rule tests
npm run storybook    # docs and live components on http://localhost:6006
```

Change tokens in Figma first, then in `tokens/*.json`, then run `npm run build`.

## Release

```sh
npm login
npm publish          # prepublishOnly runs build and tests
```

Update `CHANGELOG.md` and the version in `package.json` first.
Storybook (ds.bereg.dev) deploys automatically on push to `main`.

## License

MIT. IBM Plex is licensed under the SIL Open Font License (comes with the Fontsource packages).
