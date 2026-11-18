import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { DocsLayout, DocsLink } from './DocsLayout';

// The same CSS a project imports: fonts, tokens, base, components, HDR accents.
import '../src/css/fonts.css';
import '../dist/css/tokens.css';
import '../src/css/base.css';
import '../src/css/components.css';
import '../src/css/hdr.css';

const preview: Preview = {
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
