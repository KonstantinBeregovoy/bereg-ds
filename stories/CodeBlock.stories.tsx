import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { CodeBlock } from '../src/react';
import { FIGMA } from './figma';

const css = `.logo {
  color: color(display-p3 1 1 1);
  filter: drop-shadow(0 0 0.5rem color(display-p3 1.2 1.2 1.2)); /* a long line scrolls sideways instead of breaking the layout */
}`;

const meta = {
  title: 'Components/Code Block',
  component: CodeBlock,
  parameters: { docs: { description: { component: `Panel: surface, 1px line border, radius 2. Head: label (Mono 13, caps, muted) and a small Copy button. Body: Mono 14, padding 16, horizontal scroll; the scroll area takes keyboard focus (tabIndex 0, role region, named "<label> code"). After Copy the button shows "Copied" or "Copy failed" for 2 seconds (its width stays the same: all three texts share one grid cell), and a status message is read by screen readers. The button's name is its visible text: "Copy CSS", then "Copied". Copying: \`onCopy(code)\` from the project if given; otherwise the Clipboard API, or a temporary textarea with \`execCommand('copy')\` where the Clipboard API is missing (http on a local network). [Figma](${FIGMA})` } } },
  args: { label: 'CSS', code: css },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Html: Story = { name: 'HTML', args: { label: 'HTML', code: '<img src="logo.png" alt="bereg.dev" class="logo">' } };

export const KeyboardScroll: Story = {
  name: 'Keyboard: copy and scroll',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Copy CSS' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('region', { name: 'CSS code' })).toHaveFocus();
  },
};

export const Copied: Story = {
  name: 'State: Copied',
  args: { onCopy: async () => true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy CSS' }));
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  },
};

export const CopyFailed: Story = {
  name: 'State: Copy failed',
  args: { onCopy: async () => false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Copy CSS' });
    const width = button.getBoundingClientRect().width;
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
    await expect(button.getBoundingClientRect().width).toBe(width);
  },
};

const longLine = `const glow = 'drop-shadow(0 0 0.5rem color(display-p3 1.2 1.2 1.2)) drop-shadow(0 0 1rem color(display-p3 1.1 1.1 1.1))';`;

export const InGrid: Story = {
  name: 'In a two-column grid',
  parameters: { docs: { description: { story: 'Two Code Blocks with a long line in a two-column grid. `.code-block` has `min-width: 0` and `max-width: 100%`: the long line scrolls inside its `<pre>`, the page does not scroll sideways (check at 320px).' } } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
      <CodeBlock label="JS" code={longLine} />
      <CodeBlock label="CSS" code=".a { color: var(--accent); }" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = document.documentElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    const pre = within(canvasElement).getByRole('region', { name: 'JS code' });
    await expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
  },
};

export const InProse: Story = {
  name: 'Inside .prose',
  parameters: { docs: { description: { story: 'An article in `.prose` with a Code Block in the middle. The Code Block looks the same as outside: one border, code at 14px. Inline `code` and a plain `<pre>` in `.prose` keep their own look.' } } },
  render: () => (
    <article className="prose">
      <h2>HDR logo</h2>
      <p>Set the color with <code>color(display-p3 1 1 1)</code> and add a glow:</p>
      <CodeBlock label="CSS" code={css} />
      <p>A plain block in the article, for comparison:</p>
      <pre><code>.logo {'{'} color: white; {'}'}</code></pre>
    </article>
  ),
  play: async ({ canvasElement }) => {
    const pre = within(canvasElement).getByRole('region', { name: 'CSS code' });
    await expect(getComputedStyle(pre).borderTopWidth).toBe('0px');
    await expect(getComputedStyle(pre.querySelector('code')!).fontSize).toBe('14px');
    const plain = canvasElement.querySelector('.prose > pre')!;
    await expect(getComputedStyle(plain).borderTopWidth).toBe('1px');
  },
};
