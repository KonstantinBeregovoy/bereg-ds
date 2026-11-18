import tokens from '../../dist/tokens/tokens.json';
import tokensLight from '../../dist/tokens/tokens-light.json';

/* Visual references for the foundations pages. Values come from the built tokens. */

const cssName: Record<string, string> = {
  shadow: 'shadow-color', glow: 'glow-color',
};

const pairs: Array<[string, string, string?]> = [
  ['text', 'bg'], ['text', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['accent', 'bg'], ['accent', 'surface'],
  ['highlight', 'bg'], ['accent-ink', 'accent'], ['accent-ink', 'highlight'],
  ['line-strong', 'bg', 'borders, 3:1'], ['line-strong', 'surface', 'borders, 3:1'], ['line', 'bg', 'decorative only'],
];

const themes = { dark: tokens.color, light: tokensLight.color } as Record<'dark' | 'light', Record<string, string>>;

/** WCAG 2 contrast ratio of two opaque hex colors. */
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function ColorSwatches({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const colors = themes[theme];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))', gap: 'var(--space-4)' }}>
      {Object.entries(colors).map(([name, value]) => (
        <div key={name} className="card" style={{ padding: 'var(--space-3)', gap: 'var(--space-2)' }}>
          <div style={{ height: '3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: value }} />
          <code className="text-meta" style={{ color: 'var(--text)' }}>--{cssName[name] ?? name}</code>
          <span className="text-meta">{value}</span>
        </div>
      ))}
    </div>
  );
}

/** Contrast is computed from the built token values, so the table cannot drift from the tokens. */
export function ContrastTable({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const c = themes[theme];
  return (
    <table className="prose" style={{ maxWidth: '40rem' }}>
      <thead><tr><th>Foreground</th><th>Background</th><th>Sample</th><th>Contrast</th></tr></thead>
      <tbody>
        {pairs.map(([fg, bg, note]) => (
          <tr key={fg + bg}>
            <td><code>--{fg}</code></td><td><code>--{bg}</code></td>
            <td><span style={{ background: c[bg], color: c[fg], padding: '0.25rem 0.5rem', border: `1px solid ${c.line}` }}>Aa 123</span></td>
            <td>{contrast(c[fg], c[bg]).toFixed(1)}:1{note ? ` (${note})` : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const textStyles: Array<[string, string, string]> = [
  ['text-h1', 'Display / H1', 'Konstantin'], ['text-h1-subtitle', 'H1 Subtitle', 'Senior Frontend Engineer'], ['text-facts', 'Facts', '15+'],
  ['text-h2', 'Heading / H2', 'Selected projects'], ['text-h2-article', 'H2 Article', 'Why it matters'], ['text-post-title', 'Post Title', 'Brighter than #fff'],
  ['text-h3', 'Heading / H3', 'Faster delivery'], ['text-lede', 'Lede', 'Open to frontend leadership and consulting.'], ['text-lede-hero', 'Lede Hero', 'I build and lead frontend teams.'],
  ['text-body', 'Body', 'Body text for paragraphs and lists.'], ['text-small', 'Small', 'Card and quote text.'], ['text-caption', 'Caption', 'Captions and secondary notes.'],
  ['text-meta', 'Mono / Meta', 'Open source · 2026'], ['text-label', 'Mono / Label', 'Projects'], ['text-caps', 'Mono / Caps', 'Get in touch'],
  ['text-tag', 'Mono / Tag', 'TypeScript'], ['text-footnote', 'Mono / Footnote', 'Lighthouse 100'], ['text-code', 'Mono / Code', 'const x = 1;'],
];

export function TypeSpecimen() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {textStyles.map(([cls, label, sample]) => (
        <div key={cls} style={{ display: 'grid', gridTemplateColumns: '11rem 1fr', gap: 'var(--space-6)', alignItems: 'baseline', borderTop: '1px solid var(--line)', paddingTop: 'var(--space-3)' }}>
          <span className="text-meta">{label}<br />.{cls}</span>
          <div className={cls} style={{ color: 'var(--text)' }}>{sample}</div>
        </div>
      ))}
    </div>
  );
}

export function SpacingScale() {
  const space = tokens.space as Record<string, string>;
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      {Object.entries(space).map(([k, v]) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '8rem 4rem 1fr', alignItems: 'center', gap: 'var(--space-4)' }}>
          <code className="text-meta" style={{ color: 'var(--text)' }}>--space-{k}</code>
          <span className="text-meta">{v}</span>
          <span style={{ display: 'block', height: '0.75rem', width: `var(--space-${k})`, background: 'var(--accent)' }} />
        </div>
      ))}
    </div>
  );
}
