import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Card, Facts, Quote } from '../src/react';

// Fullscreen + .wrap, as on a page: at 320px the content column is 272px (24px side padding).
const meta = {
  title: 'Patterns/Grids',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Grids `.grid`, `.grid-4`, `.grid-wide`, `.quotes`, `.facts`. Columns use `minmax(min(<size>, 100%), 1fr)`: on a container narrower than the minimum column, the single column shrinks to the container instead of overflowing it. Check at 320px.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const card = (i: number) => (
  <Card key={i} title={`Project ${i}`} href={`#p${i}`} meta="Open source · 2026" tags={['TypeScript', 'React']} tagsLabel="Stack">
    A project card in a grid. Long enough to wrap onto a few lines.
  </Card>
);

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <section aria-label={title} style={{ marginBottom: 'var(--space-16)' }}>
    <h2 className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>{title}</h2>
    {children}
  </section>
);

export const Grids: Story = {
  render: () => (
    <main className="wrap" style={{ paddingBlock: 'var(--space-8)' }}>
      <Block title=".grid (15rem)"><div className="grid">{[1, 2, 3].map(card)}</div></Block>
      <Block title=".grid.grid-4 (13.75rem)"><div className="grid grid-4">{[1, 2, 3, 4].map(card)}</div></Block>
      <Block title=".grid.grid-wide (18.75rem)"><div className="grid grid-wide">{[1, 2, 3].map(card)}</div></Block>
      <Block title=".quotes (18.75rem)">
        <div className="quotes">
          <Quote name="Author name" role="Role, Company" href="#q1">Sample quote text. Two short sentences to show how a quote wraps in the column.</Quote>
          <Quote name="Author name" role="Role, Company" href="#q2">Sample quote text. Placeholder only.</Quote>
        </div>
      </Block>
      <Block title=".facts (12.5rem)">
        <Facts items={[{ value: '15+', label: 'years in frontend' }, { value: '8', label: 'engineers led at peak' }, { value: '100x', label: 'customer growth' }, { value: 'Top 3', label: 'creator in Israel' }]} />
      </Block>
    </main>
  ),
};
