import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/Prose',
  parameters: { docs: { description: { component: 'Article text in `.prose`: headings, lists, quote, inline code, pre, table. Long links and inline code without spaces wrap anywhere instead of overflowing the column; short ones look as usual. Prefer short link text.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Prose: Story = {
  render: () => (
    <article className="prose">
      <h2>Why it matters</h2>
      <p>Short link in text: the source is on <a href="#gh">GitHub</a>, the tool is at <a href="#glow">glow.bereg.dev</a>. Inline code: <code>--accent</code>.</p>
      <p>Long link without spaces: <a href="#hdr">github.com/KonstantinBeregovoy/hdr-glow/blob/main/src/workers/oklab-convert.ts</a> wraps instead of overflowing.</p>
      <p>Long inline code: <code>bereg-ds/dist/css/theme-light.css?v=1.3.1&amp;cache=no-store</code> wraps too.</p>
      <ul>
        <li>List item with a <a href="#a">link</a>.</li>
        <li>Second item.</li>
      </ul>
      <blockquote>A quote stays inside the column.</blockquote>
      <pre><code>npm i bereg-ds  # pre keeps its horizontal scroll: https://www.npmjs.com/package/bereg-ds?activeTab=versions</code></pre>
      <h3>Links and code in a table</h3>
      <table>
        <thead><tr><th>Project</th><th>Link</th><th>Token</th></tr></thead>
        <tbody>
          <tr><td>hdr-glow</td><td><a href="#t1">github.com/KonstantinBeregovoy/hdr-glow</a></td><td><code>--line-strong</code></td></tr>
          <tr><td>Bereg DS</td><td><a href="#t2">ds.bereg.dev</a></td><td><code>--accent-ink</code></td></tr>
          <tr><td>CSS Unit Rulebook</td><td><a href="#t3">GitHub</a></td><td><code>--font-size-display</code></td></tr>
        </tbody>
      </table>
    </article>
  ),
};
