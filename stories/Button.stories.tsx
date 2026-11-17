import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Link } from '../src/react';

import { FIGMA } from './figma';

/* ---------- Button ---------- */
const buttonMeta = {
  title: 'Components/Button',
  component: Button,
  parameters: { docs: { description: { component: `Mono 13, uppercase, padding 12/20, radius 2, border 1px. Primary: accent, hover highlight. Secondary: outline, hover accent-subtle. Focus: 3px ring with 3px offset. [Figma](${FIGMA})` } } },
  args: { children: 'Get in touch', variant: 'primary' },
  argTypes: { variant: { control: 'inline-radio', options: ['primary', 'secondary'] } },
} satisfies Meta<typeof Button>;
export default buttonMeta;
type ButtonStory = StoryObj<typeof buttonMeta>;

export const Primary: ButtonStory = {};
export const Secondary: ButtonStory = { args: { variant: 'secondary' } };
export const AsLink: ButtonStory = { args: { href: '#projects', children: 'Projects' } };
export const KeyboardFocus: ButtonStory = {
  name: 'Keyboard focus',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};
export const AllButtons: ButtonStory = {
  name: 'Overview',
  render: () => (
    <div className="actions">
      <Button>Projects</Button>
      <Button variant="secondary">Contact</Button>
      <Link href="#linkedin">LinkedIn</Link>
      <Link href="#github">GitHub</Link>
    </div>
  ),
};
