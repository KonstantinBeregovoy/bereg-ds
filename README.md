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

IBM Plex Sans and Mono come with it: self-hosted woff2 files in `bereg-ds/fonts/`, no Google Fonts, no extra dependencies.

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
| `bereg-ds/fonts.css` | IBM Plex Sans (variable, 300 to 700) and Mono 400, metric-matched fallbacks |
| `bereg-ds/tokens.css` | CSS variables: colors, spacing, radii, type scale, motion |
| `bereg-ds/base.css` | Page defaults, headings, text-style classes (`.text-h1`, `.text-meta`...), `.blueprint` grid, `.page` layout |
| `bereg-ds/components.css` | Components: `.btn`, `.card`, `.quote`, `.tag`, `.filter-tab`, `.section-head`, `.subhead`, `.facts`, `.timeline`, `.posts`, `.book-promo`, `.site-header`, `.site-footer`, `.prose`, `.wrap` |
| `bereg-ds/hdr.css` | Optional HDR accents (`.hdr-logo`, `.hdr-card`) |
| `bereg-ds/theme-light.css` | Optional light theme (see below) |

## Page layout: footer at the bottom of short pages

Add `class="page"` to `<body>` (optional). On a page shorter than the screen the footer sits at the bottom of the screen;
on a longer page it follows the content, as usual. Without the class nothing changes.

```html
<body class="page blueprint">
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">…</header>
  <main id="main">…</main>
  <footer class="site-footer">…</footer>
</body>
```

- `<main>`, `.site-header` and `.site-footer` must be **direct children** of the element with `.page`.
- `<main>` takes the free space; the header and footer keep their height. Height: `100dvh` (`100vh` in older browsers).
- Works with `.blueprint` on the same element, with `.skip` and with `position: fixed` elements (they stay out of the flow).
- In print the layout is turned off: no stretched page, the footer follows the content.

## Prose: article text

Wrap article content (Markdown output) in `.prose`: headings, lists, quotes, inline `code`, `pre`, tables and images get the system styles,
text width up to `68ch`.

```html
<article class="prose">
  <h2>Why it matters</h2>
  <p>Source code on <a href="https://github.com/KonstantinBeregovoy/hdr-glow">GitHub</a>.</p>
</article>
```

- Prefer short link text ("GitHub", "glow.bereg.dev", the article title), not the full URL.
- If a long URL, path or token without spaces is left in a link or in inline `code`, it wraps anywhere instead of overflowing
  the column on narrow screens. `pre` keeps its horizontal scroll.

## Fonts

`fonts.css` links the font files with relative URLs (`../fonts/*.woff2`), so bundlers (Vite, Astro, webpack) copy them as assets.
Subsets: latin, latin-ext, cyrillic. Each is a separate file with its own `unicode-range`: a page in English loads only the Latin files.
Other scripts (Greek, Vietnamese...) fall back to the system font.

| Font | Weights | Latin file |
|---|---|---|
| IBM Plex Sans (variable) | 300 to 700, normal | `plex-sans-latin-wght.woff2` (~39 KB) |
| IBM Plex Mono | 400, normal | `plex-mono-latin-400.woff2` (~10 KB) |

Hinting is removed (smaller files; modern browsers smooth the glyphs themselves). There is no italic and no other Mono weight:
`<em>` gets a slanted Sans, bold inside `<code>` gets a synthesized bold.

**Preload the main font** so text renders in Plex sooner. With Vite, `?url` gives the same hashed URL that the CSS uses,
so the file is downloaded once:

```js
import plexSans from 'bereg-ds/fonts/plex-sans-latin-wght.woff2?url';
```

```html
<link rel="preload" href="{plexSans}" as="font" type="font/woff2" crossorigin>
```

`crossorigin` is required even on the same origin: without it the browser downloads the font twice.
Preload only the Latin Sans file; other files load when a page needs them.

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
`Facts`, `Timeline`, `PostList`, `Subhead`, `SiteHeader`, `SiteFooter`, `Wrap`, `Field`, `TextInput`, `Range`,
`ColorField`, `Dropzone`, `CodeBlock`.

Optional props (1.4.0; without them the output is the same as before):

- `Button`: `size="sm"` (`.btn-sm`, toolbars), `pressed` (`aria-pressed`, toggle; use with `variant="secondary"`).
- `Tag`: `as="button"` (the whole tag is a button) or `onRemove` (a remove button named "Remove <text>", or `removeLabel`;
  the × looks 16×16, its target is 24×24).
- `Section`: `sectionId` (id on `<section>`, for anchors; `id` stays on the heading), `headingClassName` (class on `<h2>`).
- `SiteHeader`: `sticky` (`.site-header-sticky`).

## Forms, Dropzone, Code Block (1.4.0)

```tsx
import { CodeBlock, ColorField, Dropzone, Field, Range, TextInput } from 'bereg-ds/react';

<Field label="Logo text" hint="Up to 24 characters." error={tooLong ? 'Too long.' : undefined}>
  <TextInput value={text} onChange={(e) => setText(e.target.value)} />
</Field>
<Field label="Brightness"><Range min={0} max={100} value={boost} onChange={(e) => setBoost(+e.target.value)} /></Field>
<ColorField label="Glow color" value={color} onChange={setColor} />
<Dropzone accept="image/*" title="Drop an image or choose a file" hint="PNG, JPG, SVG" onFiles={(files) => load(files[0])} />
<CodeBlock label="CSS" code={css} />
```

- `Field` gives the control its id and connects the hint and error (`aria-describedby`); with `error` the control gets
  `aria-invalid="true"` and a doubled `--danger` border. Placeholder text is `--muted`.
- `Range` is the native slider in `--accent` (`accent-color`).
- `ColorField`: native `<input type="color">` in a `--line-strong` frame and the hex value in mono. The color logic is the project's.
- `Dropzone`: a `<label>` around a visually hidden file input, so click, keyboard and drag and drop reach the same input.
  `onFiles(files)` gets an array of `File`; `accept` only filters the file dialog. Checks (type, size) are the project's.
  States: hover, `data-drag` while a file is over it, a focus ring around the zone, `data-disabled`.
- `CodeBlock`: label and a small Copy button; the `<pre>` scrolls sideways and takes keyboard focus (`tabIndex=0`,
  `role="region"`, named "CSS code"). After Copy the button shows "Copied" or "Copy failed" for 2 seconds without
  changing width, and the same message is read by screen readers (`role="status"`). Copying uses the Clipboard API, or
  a temporary textarea with `execCommand('copy')` where it is missing (http on a local network). Pass
  `onCopy={(code) => myCopy(code)}` (resolves `true` when copied) to use your own.

The same with CSS only: `.field`, `.field-label`, `.field-hint`, `.field-error`, `.input`, `.range`, `.color-field`,
`.color-field-value`, `.dropzone`, `.dropzone-title`, `.dropzone-hint`, `.code-block`, `.code-block-head`,
`.code-block-label`, `.code-block-copy`, `.btn-sm`, `.btn[aria-pressed="true"]`, `.tag-button`, `.tag-removable`, `.tag-remove`,
`.site-header-sticky`, and `.visually-hidden` (in `base.css`). Examples: [Storybook](https://ds.bereg.dev).

## Sticky header (optional)

`<SiteHeader sticky …/>` or `<header class="site-header site-header-sticky">` keeps the header on top while the page scrolls.
Where `:has()` works, `<html>` gets `scroll-padding-top` (128px, room for two rows of navigation), so anchors and
focused elements are not hidden under it (WCAG 2.4.11). For a taller header set `scroll-padding-top` on `<html>` in the
project. In print the header is not sticky.

## Tokens in JavaScript

```js
import { colorAccent, space4 } from 'bereg-ds/tokens'; // px values
import tokens from 'bereg-ds/tokens.json';
import light from 'bereg-ds/tokens-light.json'; // light theme colors
```

The source tokens (W3C DTCG format) are in `tokens/*.json`, the light theme in `tokens/themes/light/*.json`.

## Rules of the system

1. **Strict scale of 4.** Spacing, gaps and radii are multiples of 4. The name is the multiplier: `--space-3` = 12px.
   Steps: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 (4 to 64px).
   Strokes (1/2/3px), corner ticks (11/22px) and breakpoints (640/760px) are separate sizes.
2. **Tokens only.** No raw colors or pixel spacing in components (a test checks it).
3. **Units.** Font sizes and spacing in rem, line height without units, letter spacing in em, strokes in px,
   breakpoints in em in media queries (`40em`, `47.5em`). The `--bp-sm`/`--bp-md` tokens (640/760px) are for reference:
   CSS variables do not work in media queries.
4. **Accessibility.** Text contrast 7:1 or more (errors: `--danger`, 7:1 or more too). Interactive borders use `--line-strong` (3:1 or more),
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

MIT. IBM Plex is licensed under the SIL Open Font License: `bereg-ds/fonts/OFL.txt`.
