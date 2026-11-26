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
  parameters: { docs: { description: { component: `Panel: surface, 1px line border, radius 2. Head: label (Mono 13, caps, muted) and a small Copy button. Body: Mono 14, padding 16, horizontal scroll; the scroll area takes keyboard focus (tabIndex 0, role region, named "<label> code"). After Copy a status message ("Copied" or "Copy failed") is read by screen readers. [Figma](${FIGMA})` } } },
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
