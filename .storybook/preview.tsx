import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { DocsLayout, DocsLink } from './DocsLayout';

// The same CSS a project imports: fonts, tokens, base, components, HDR accents.
import '../src/css/fonts.css';
import '../dist/css/tokens.css';
import '../src/css/base.css';
import '../src/css/components.css';
import '../src/css/hdr.css';
// Optional light theme: in a project it is imported only when needed.
import '../dist/css/theme-light.css';

const preview: Preview = {
  // Theme switch in the toolbar: Dark (default, as on bereg.dev), Light, or System (follows the OS setting).
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, { globals }) => {
      const root = document.documentElement;
      if (globals.theme === 'system') root.removeAttribute('data-theme');
      else root.dataset.theme = globals.theme ?? 'dark';
      return <Story />;
    },
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true },
    docs: { theme: themes.dark, codePanel: true, container: DocsLayout, components: { a: DocsLink } },
    // Accessibility checks with axe-core on every story. Violations fail the story in test runs.
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Patterns', 'Pages'] },
    },
  },
};

export default preview;
