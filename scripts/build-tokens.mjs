// Builds tokens/*.json (DTCG) into dist/css/tokens.css (rem) and dist/tokens/* (JSON, ESM, d.ts, px).
import StyleDictionary from 'style-dictionary';

const BASE_PX = 16;
// Token groups that become rem in CSS. Borders, ticks, sizes and breakpoints stay px.
const REM_GROUPS = [['space'], ['radius'], ['font', 'size']];

StyleDictionary.registerTransform({
  name: 'bds/name',
  type: 'name',
  transform: (token) =>
    token.$extensions?.bds?.css ?? token.path.join('-').toLowerCase(),
});

StyleDictionary.registerTransform({
  name: 'bds/rem',
  type: 'value',
  transitive: true,
  filter: (token) =>
    REM_GROUPS.some((g) => g.every((p, i) => token.path[i] === p)) &&
    typeof (token.$value ?? token.value) === 'string' &&
    /px$/.test(token.$value ?? token.value),
  transform: (token) => {
    const px = parseFloat(token.$value ?? token.value);
    return px === 0 ? '0' : `${+(px / BASE_PX).toFixed(4)}rem`;
  },
});

const header = [
  'Bereg DS tokens. Generated from tokens/*.json (DTCG) by Style Dictionary. Do not edit by hand.',
  'Source of truth: Figma "Bereg DS" variables -> tokens/*.json -> this file.',
];

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  log: { verbosity: 'default', warnings: 'warn' },
  platforms: {
    css: {
      transforms: ['attribute/cti', 'bds/name', 'bds/rem', 'color/css', 'fontFamily/css', 'cubicBezier/css', 'shadow/css/shorthand'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          // Composite text styles are delivered as classes in base.css, not as variables.
          filter: (token) => token.path[0] !== 'text',
          options: { outputReferences: true, selector: ':root', fileHeader: () => header },
        },
      ],
    },
    js: {
      transforms: ['attribute/cti', 'name/camel', 'color/css', 'fontFamily/css', 'cubicBezier/css', 'shadow/css/shorthand'],
      buildPath: 'dist/tokens/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6', options: { fileHeader: () => header } },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations', options: { fileHeader: () => header } },
        { destination: 'tokens.json', format: 'json/nested' },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
