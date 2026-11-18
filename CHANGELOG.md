# Changelog

All notable changes to this project are documented here. The project follows [Semantic Versioning](https://semver.org/):
a breaking change to a token name, a class name or a component prop is a major version.

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
