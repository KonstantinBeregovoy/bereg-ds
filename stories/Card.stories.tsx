import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
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

function InteractiveTagsDemo() {
  const [tags, setTags] = useState(['TypeScript', 'React', 'OKLab']);
  const [hdr, setHdr] = useState(false);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
      {tags.map((t) => <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>)}
      <Tag as="button" onClick={() => setTags([...tags, `Tag ${tags.length + 1}`])}>+ Add</Tag>
      <Tag as="button" aria-pressed={hdr} onClick={() => setHdr(!hdr)}>HDR</Tag>
    </div>
  );
}
export const InteractiveTags: Story = {
  name: 'Tag (interactive)',
  parameters: { docs: { description: { story: '`as="button"`: the whole tag is a button (add, toggle with aria-pressed). `onRemove`: a remove button (×) named "Remove <text>". Interactive tags have a --line-strong border, radius 2, no pill.' } } },
  render: () => <InteractiveTagsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove React' }));
    await expect(canvas.queryByText('React')).toBeNull();
  },
};

export const RemoveTarget: Story = {
  name: 'Tag (removable): target area',
  parameters: { docs: { description: { story: 'The × is 16×16, its target is 24×24 (WCAG 2.5.8): a `::before` 4px larger on each side. It stays inside the tag, so neighbours never overlap. Here the target is outlined in highlight for the demo only.' } } },
  render: () => (
    <div className="demo-remove-target">
      <style>{'.demo-remove-target .tag-remove::before { outline: 1px dashed var(--highlight); }'}</style>
      <ul className="tags">
        {['TypeScript', 'React', 'OKLab'].map((t) => <li key={t}><Tag onRemove={() => {}}>{t}</Tag></li>)}
      </ul>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const remove = canvas.getByRole('button', { name: 'Remove React' });
    const r = remove.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    // 11px from the centre in every direction still hits the button (24×24 target).
    for (const [dx, dy] of [[-11, 0], [11, 0], [0, -11], [0, 11]]) {
      await expect(document.elementFromPoint(cx + dx, cy + dy)?.closest('button')).toBe(remove);
    }
    // The target ends inside its own tag.
    const tag = remove.closest('.tag')!.getBoundingClientRect();
    await expect(cx + 12).toBeLessThanOrEqual(tag.right);
  },
};
