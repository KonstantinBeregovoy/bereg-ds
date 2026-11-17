import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BookPromo, Card, Quote, Tag, Tags } from '../src/react';
import { FIGMA } from './figma';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { docs: { description: { component: `Surface, 1px line border, radius 2, padding 24, gap 8; title to text 12. Corner ticks 11px accent 50%; on hover and keyboard focus 22px highlight 100% and border line-hover. Focus ring goes around the whole card. [Figma](${FIGMA})` } } },
  args: {
    title: 'Jay Framework: a11y-validator',
    href: '#jay',
    meta: 'Open source · 2026',
    children: 'Open-source accessibility rules for Jay Framework (Wix): structural gaps that Lighthouse does not catch.',
    tags: ['TypeScript', 'WCAG 2.x', 'HTML semantics', 'Static analysis'],
    tagsLabel: 'Stack',
  },
  decorators: [(Story) => <div style={{ maxWidth: '20rem' }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Project: Story = {};
export const Simple: Story = {
  args: { meta: undefined, tags: undefined, href: undefined, title: 'Faster delivery', children: 'AI-assisted workflows and AI code review cut pull request turnaround to under 24 hours.' },
};
export const KeyboardFocus: Story = {
  name: 'Keyboard focus',
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole('link')).toHaveFocus();
  },
};
export const HDR: Story = {
  name: 'HDR accent (optional)',
  args: { title: 'hdr-glow', meta: 'Open source · 2026', hdrSwatch: '/assets/hdr-swatch.jpg', children: 'Glows on HDR screens only. On normal screens it is a regular card.', tags: ['TypeScript', 'React'] },
  parameters: { docs: { description: { story: 'Needs `hdr.css` and an HDR gain-map swatch (make it with glow.bereg.dev). Not a default: use for one accent at most.' } } },
};

export const QuoteCard: Story = {
  name: 'Quote',
  render: () => (
    <Quote name="Barak Yerushalmi" role="VP of Products, Payouts.com" href="#profile">
      Under his leadership, our frontend architecture became far more modular, testable, and future-proof.
    </Quote>
  ),
};
export const Book: Story = {
  name: 'Book Promo',
  render: () => (
    <BookPromo src="/assets/css-unit-rulebook-cover-140.webp" srcSet="/assets/css-unit-rulebook-cover-280.webp 2x" width={140} height={200}
      alt="Cover of CSS Unit Rulebook, 2026 edition" href="#amazon" label="Book on Amazon" />
  ),
};
export const TagsStory: Story = {
  name: 'Tag',
  render: () => (<div><Tag>Accessibility</Tag><Tags aria-label="Stack" items={['TypeScript', 'React', 'Web Workers', 'OKLab']} /></div>),
};
