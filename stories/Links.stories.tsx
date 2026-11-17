import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, NavLink } from '../src/react';
import { FIGMA } from './figma';

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: { docs: { description: { component: `Inline: accent, underline with 3px offset, hover highlight + 2px underline. Muted: footer and secondary links. Links are always underlined: color alone is not enough (WCAG 1.4.1). [Figma](${FIGMA})` } } },
  args: { href: '#read', children: 'Read the article', variant: 'inline' },
  argTypes: { variant: { control: 'inline-radio', options: ['inline', 'muted'] } },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {};
export const Muted: Story = { args: { variant: 'muted', children: 'GitHub' } };
export const InText: Story = {
  name: 'In text',
  render: () => <p style={{ maxWidth: '40rem' }}>I build and lead frontend teams. Read <Link href="#post">the article about HDR logos</Link> or see <Link href="#projects">all projects</Link>.</p>,
};
export const Navigation: Story = {
  name: 'Nav Link',
  render: () => (
    <nav aria-label="Example" className="site-nav">
      <ul>
        <li><NavLink href="#home" current>Home</NavLink></li>
        <li><NavLink href="#about">About</NavLink></li>
        <li><NavLink href="#projects">Projects</NavLink></li>
        <li><NavLink href="#blog">Blog</NavLink></li>
      </ul>
    </nav>
  ),
};
