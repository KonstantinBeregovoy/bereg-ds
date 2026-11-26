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
