import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Button, Link } from '../src/react';

import { FIGMA } from './figma';

/* ---------- Button ---------- */
const buttonMeta = {
  title: 'Components/Button',
  component: Button,
  parameters: { docs: { description: { component: `Mono 13, uppercase, padding 12/20, radius 2, border 1px. Primary: accent, hover highlight. Secondary: outline, hover accent-subtle. Focus: 3px ring with 3px offset. Small (\`size="sm"\`, \`.btn-sm\`): padding 4/12, for toolbars. Toggle (\`pressed\`, \`aria-pressed\`): filled when pressed, use with secondary. [Figma](${FIGMA})` } } },
  args: { children: 'Get in touch', variant: 'primary' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: [undefined, 'sm'] },
    pressed: { control: 'boolean' },
  },
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

export const Small: ButtonStory = {
  name: 'Small',
  render: () => (
    <div className="actions">
      <Button variant="secondary" size="sm">Copy</Button>
      <Button variant="secondary" size="sm">Add</Button>
      <Button size="sm">Download</Button>
    </div>
  ),
};

function SegmentedSwitch() {
  const [mode, setMode] = useState('sdr');
  return (
    <div role="group" aria-label="Preview mode" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
      {[['sdr', 'SDR'], ['hdr', 'HDR'], ['both', 'Compare']].map(([value, label]) => (
        <Button key={value} variant="secondary" size="sm" pressed={mode === value} onClick={() => setMode(value)}>{label}</Button>
      ))}
    </div>
  );
}
export const Toggle: ButtonStory = {
  name: 'Toggle (aria-pressed)',
  parameters: { docs: { description: { story: 'Segmented switch: one pressed button in a labelled group. For navigation use Filter tabs (aria-current), not this.' } } },
  render: () => <SegmentedSwitch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'HDR' }));
    await expect(canvas.getByRole('button', { name: 'HDR' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'SDR' })).toHaveAttribute('aria-pressed', 'false');
  },
};
