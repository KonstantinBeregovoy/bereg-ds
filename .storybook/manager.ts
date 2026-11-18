import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    // Logo + name in the sidebar. Logo comes from stories/assets (served at /assets).
    brandTitle: '<span style="display:inline-flex;align-items:center;gap:12px"><img src="./assets/logo.png" alt="" width="45" height="32" style="display:block" />Bereg DS</span>',
    brandTarget: '_self',
    brandUrl: 'https://ds.bereg.dev',
    fontBase: "'IBM Plex Sans', system-ui, sans-serif",
    fontCode: "'IBM Plex Mono', ui-monospace, monospace",
    colorPrimary: '#78c2ff',
    colorSecondary: '#78c2ff',
    appBg: '#0a1220',
    appContentBg: '#0a1220',
    appPreviewBg: '#0a1220',
    appBorderColor: '#1f3350',
    textColor: '#dbe6f5',
    textMutedColor: '#8ea3bf',
    barBg: '#0d1829',
    inputBg: '#0d1829',
    inputBorder: '#4d6a8f',
  }),
});
