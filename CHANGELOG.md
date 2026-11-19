# Changelog

All notable changes to this project are documented here. The project follows [Semantic Versioning](https://semver.org/):
a breaking change to a token name, a class name or a component prop is a major version.

## 1.2.0 (unreleased)

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
