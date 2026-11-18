// Adds SEO, social preview (Open Graph / LinkedIn / X) and structured data to the built Storybook.
// Storybook renders docs with JavaScript, so crawlers and link previews only see this static head
// and the <noscript> summary. Runs after `storybook build` (see the build-storybook script).
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../storybook-static/index.html', import.meta.url);
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const url = 'https://ds.bereg.dev/';
const title = 'Bereg DS: open-source design system (Figma, tokens, CSS, React)';
const description =
  'Bereg DS by Konstantin Beregovoy: Figma library, DTCG design tokens, CSS and React components on npm. Strict 4px scale, AAA text contrast, Storybook docs.';
const image = `${url}og-image.png`;
const imageAlt = 'Bereg DS: Engineering Blueprint design system. Tokens, CSS and React components.';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'Bereg DS',
  alternateName: 'bereg-ds',
  description,
  url,
  image,
  version,
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/KonstantinBeregovoy/bereg-ds',
  programmingLanguage: ['CSS', 'TypeScript', 'React'],
  keywords: 'design system, design tokens, DTCG, Figma, CSS, React, Storybook, accessibility, WCAG',
  sameAs: ['https://www.npmjs.com/package/bereg-ds', 'https://www.figma.com/design/nWkFlhkomx90UBXw6nFAQj'],
  author: {
    '@type': 'Person',
    name: 'Konstantin Beregovoy',
    url: 'https://bereg.dev',
    sameAs: ['https://www.linkedin.com/in/konstantin-beregovoy/', 'https://github.com/KonstantinBeregovoy'],
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="Konstantin Beregovoy" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#0a1220" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" type="text/plain" title="llms.txt" href="${url}llms.txt" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Bereg DS" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

const noscript = `<noscript>
      <h1>Bereg DS</h1>
      <p>${esc(description)}</p>
      <p>Install: <code>npm i bereg-ds</code></p>
      <ul>
        <li><a href="https://www.npmjs.com/package/bereg-ds">npm package</a></li>
        <li><a href="https://github.com/KonstantinBeregovoy/bereg-ds">GitHub repository</a></li>
        <li><a href="https://www.figma.com/design/nWkFlhkomx90UBXw6nFAQj">Figma library</a></li>
        <li><a href="${url}llms.txt">llms.txt</a></li>
        <li><a href="https://bereg.dev/projects/bereg-ds/">Project page on bereg.dev</a></li>
      </ul>
    </noscript>`;

let html = readFileSync(file, 'utf8');
if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error('No <title> in storybook-static/index.html');
html = html.replace(/<title>[\s\S]*?<\/title>/, head);
html = html.replace(/<body([^>]*)>/, `<body$1>\n    ${noscript}`);
writeFileSync(file, html);
console.log('SEO head added to storybook-static/index.html');
