import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // public/: files served at the site root (robots.txt, sitemap.xml, llms.txt, og-image.png).
  staticDirs: [{ from: '../stories/assets', to: '/assets' }, { from: '../public', to: '/' }],
  core: { disableTelemetry: true },
};

export default config;
