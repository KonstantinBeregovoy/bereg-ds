import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import {
  BookPromo, Button, Card, Facts, FilterTabs, Link, NavLink, PostList, Quote, Section, Sections,
  SiteFooter, SiteHeader, Tags, Timeline,
} from '../src/react';

describe('Button', () => {
  it('renders a button with type="button" by default', () => {
    render(<Button>Send</Button>);
    const b = screen.getByRole('button', { name: 'Send' });
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveClass('btn', 'btn-primary');
  });
  it('renders a link when href is set', () => {
    render(<Button href="/projects/" variant="secondary">Projects</Button>);
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveClass('btn', 'btn-secondary');
  });
});

describe('Links', () => {
  it('muted link gets its class, inline link stays plain', () => {
    render(<><Link href="/a">Inline</Link><Link href="/b" variant="muted">Muted</Link></>);
    expect(screen.getByRole('link', { name: 'Inline' })).not.toHaveAttribute('class');
    expect(screen.getByRole('link', { name: 'Muted' })).toHaveClass('link-muted');
  });
  it('current nav link has aria-current="page"', () => {
    render(<><NavLink href="/" current>Home</NavLink><NavLink href="/about/">About</NavLink></>);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
  });
});

describe('Card', () => {
  it('renders title link, meta, text and at most 4 tags', () => {
    render(<Card title="hdr-glow" href="/p/" meta="Open source · 2026" tags={['a', 'b', 'c', 'd', 'e']}>Text</Card>);
    expect(screen.getByRole('article')).toHaveClass('card');
    expect(screen.getByRole('heading', { level: 3, name: 'hdr-glow' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hdr-glow' })).toHaveClass('stretch');
    expect(screen.getByRole('list', { name: 'Tags' }).children).toHaveLength(4);
  });
  it('adds the HDR class and swatch variable only when asked', () => {
    render(<Card title="A" hdrSwatch="/s.jpg" />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('hdr-card');
    expect(card.style.getPropertyValue('--hdr-swatch')).toBe('url("/s.jpg")');
  });
});

describe('Sections and lists', () => {
  it('section is labelled by its heading', () => {
    render(<Sections><Section id="help" title="How I help" link={{ href: '/x', label: 'All' }}>x</Section></Sections>);
    expect(screen.getByRole('region', { name: 'How I help' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
  });
  it('filter tabs mark the current item', () => {
    render(<FilterTabs label="Filter" current="/all" items={[{ href: '/all', label: 'All' }, { href: '/os', label: 'Open source' }]} />);
    expect(screen.getByRole('navigation', { name: 'Filter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'true');
  });
  it('facts, timeline, posts, tags render lists', () => {
    render(<>
      <Facts items={[{ value: '15+', label: 'years' }]} />
      <Timeline items={[{ period: '2026', title: 'Lead', text: 'Text' }]} />
      <PostList posts={[{ href: '/b/', title: 'Post', date: '3 Jun 2026', kind: 'post', tags: ['css'] }]} />
      <Tags items={[]} />
    </>);
    expect(screen.getByRole('list', { name: 'Key facts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lead' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Post' })).toBeInTheDocument();
  });
  it('quote and book promo', () => {
    render(<><Quote name="A. B." role="VP" href="/in/ab">Great</Quote><BookPromo src="/c.webp" alt="Cover" href="/buy" label="Book on Amazon" /></>);
    expect(screen.getByRole('link', { name: 'A. B.' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Cover' })).toBeInTheDocument();
  });
  it('header and footer landmarks', () => {
    render(<><SiteHeader brand={{ href: '/', label: 'Name' }} nav={[{ href: '/', label: 'Home', current: true }]} /><SiteFooter note="Note">© 2026</SiteFooter></>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Note');
  });
});

describe('CSS follows the system rules', () => {
  const css = ['components.css', 'base.css'].map((f) => readFileSync(new URL(`../src/css/${f}`, import.meta.url), 'utf8')).join('\n');
  it('uses tokens for spacing: no raw px in padding, margin, gap', () => {
    const bad = css.split('\n').filter((l) => /\b(padding|margin|gap)[\w-]*\s*:[^;]*\d+px/.test(l));
    expect(bad).toEqual([]);
  });
  it('uses tokens for colors: no raw hex colors', () => {
    const bad = css.split('\n').filter((l) => /#[0-9a-f]{3,8}\b/i.test(l) && !/mask-image/.test(l));
    expect(bad).toEqual([]);
  });
});

describe('Light theme', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const dark = JSON.parse(read('../dist/tokens/tokens.json')).color as Record<string, string>;
  const light = JSON.parse(read('../dist/tokens/tokens-light.json')).color as Record<string, string>;
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it('is not part of the default bundle', () => {
    expect(read('../src/css/bereg-ds.css')).not.toMatch(/theme-light/);
    expect(read('../dist/css/tokens.css')).not.toMatch(/prim-light/);
  });
  it('overrides every semantic color, nothing else', () => {
    expect(Object.keys(light).sort()).toEqual(Object.keys(dark).sort());
  });
  it('follows the system unless data-theme is set', () => {
    const css = read('../dist/css/theme-light.css');
    expect(css).toMatch(/@media \(prefers-color-scheme: light\)\s*{\s*:root:not\(\[data-theme="dark"\]\)/);
    expect(css).toMatch(/:root\[data-theme="light"\]/);
  });
  it('keeps text contrast 7:1 and interactive borders 3:1 in both themes', () => {
    for (const t of [dark, light]) for (const [fg, bg] of [['text', 'bg'], ['text', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['accent', 'bg'],
      ['accent', 'surface'], ['highlight', 'bg'], ['accent-ink', 'accent'], ['accent-ink', 'highlight']]) {
      expect(ratio(t[fg], t[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(7);
    }
    for (const t of [dark, light]) {
      for (const ui of ['line-strong', 'focus', 'accent', 'highlight']) {
        expect(ratio(t[ui], t.bg), `${ui} vs bg`).toBeGreaterThanOrEqual(3);
        expect(ratio(t[ui], t.surface), `${ui} vs surface`).toBeGreaterThanOrEqual(3);
      }
    }
  });
  it('keeps 7:1 on translucent backgrounds (hover, selection, header)', () => {
    // Token values are hex or rgba(); blend the alpha color over the page background.
    const rgb = (v: string) => v.startsWith('#')
      ? { c: [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)), a: 1 }
      : (([r, g, b, a = 1]) => ({ c: [r, g, b], a }))(v.match(/[\d.]+/g)!.map(Number));
    const hex = (c: number[]) => '#' + c.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
    const over = (top: string, under: string) => {
      const t = rgb(top), u = rgb(under);
      return hex(t.c.map((x, i) => x * t.a + u.c[i] * (1 - t.a)));
    };
    for (const t of [dark, light]) for (const base of [t.bg, t.surface]) {
      expect(ratio(t.accent, over(t['accent-subtle'], base)), 'accent on accent-subtle').toBeGreaterThanOrEqual(7);
      expect(ratio(t['selection-text'], over(t.selection, base)), 'selection').toBeGreaterThanOrEqual(7);
      expect(ratio(t.muted, over(t['header-bg'], base)), 'muted on header').toBeGreaterThanOrEqual(7);
      expect(ratio(t.highlight, base), 'highlight').toBeGreaterThanOrEqual(7);
    }
  });
});

describe('Card focus', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/components.css');
  it('hides the link ring only where :has() can draw the card ring', () => {
    const block = css.match(/@supports selector\(:has\(\*\)\)\s*{([\s\S]*?)\n}/);
    expect(block, '@supports selector(:has(*)) block').not.toBeNull();
    expect(block![1]).toMatch(/\.card:has\(\.stretch:focus-visible\)\s*{[^}]*outline:/);
    expect(block![1]).toMatch(/\.card \.stretch:focus-visible\s*{\s*outline:\s*none/);
    // Outside the block nothing removes the link's own focus ring (base.css :focus-visible stays in force).
    const outside = css.replace(block![0], '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(outside).not.toMatch(/\.stretch:focus-visible/);
    expect(outside).not.toMatch(/:has\(/);
  });
});

describe('Fonts', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const fonts = read('../src/css/fonts.css');
  const faces = [...fonts.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => m[1]).filter((f) => /url\(/.test(f));
  it('ships its own files: Sans 300-700, Mono 400, no italic, no Fontsource imports', () => {
    expect(fonts).not.toMatch(/@import/);
    const sans = faces.filter((f) => f.includes("'IBM Plex Sans Variable'"));
    const mono = faces.filter((f) => f.includes("'IBM Plex Mono'"));
    expect(sans).toHaveLength(3); // latin, latin-ext, cyrillic
    expect(mono).toHaveLength(3);
    for (const f of sans) expect(f).toMatch(/font-weight: 300 700;/);
    for (const f of mono) expect(f).toMatch(/font-weight: 400;/);
    for (const f of faces) {
      expect(f).toMatch(/font-style: normal;/);
      expect(f).toMatch(/font-display: swap;/);
      expect(f).toMatch(/url\('\.\.\/fonts\/[\w-]+\.woff2'\)/);
      expect(f).toMatch(/unicode-range:/);
    }
  });
  it('every linked font file exists, with the OFL license next to them', () => {
    for (const [, file] of fonts.matchAll(/url\('\.\.\/fonts\/([\w-]+\.woff2)'\)/g)) {
      expect(() => read(`../src/fonts/${file}`), file).not.toThrow();
    }
    expect(read('../src/fonts/OFL.txt')).toMatch(/SIL Open Font License/);
  });
});

describe('Page layout', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/base.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const rule = (sel: string, from = css) => from.match(new RegExp(`(?:^|\\n)\\s*${sel.replace(/[.*>]/g, '\\$&')}\\s*{([^}]*)}`))?.[1] ?? '';
  it('.page is a full-height flex column, 100vh fallback before 100dvh', () => {
    const r = rule('.page');
    expect(r).toMatch(/display:\s*flex/);
    expect(r).toMatch(/flex-direction:\s*column/);
    expect(r).toMatch(/min-height:\s*100vh;\s*min-height:\s*100dvh/);
  });
  it('main takes the free space, header and footer keep their height', () => {
    expect(rule('.page > main')).toMatch(/flex:\s*1 0 auto/);
    expect(css).toMatch(/\.page > \.site-header, \.page > \.site-footer\s*{\s*flex:\s*none/);
  });
  it('is opt-in: body and the components do not get the layout without the class', () => {
    expect(rule('body')).not.toMatch(/display|min-height/);
    const comp = read('../src/css/components.css');
    expect(comp).not.toMatch(/min-height:\s*100d?vh/);
  });
  it('is turned off in print', () => {
    const print = css.match(/@media print\s*{([\s\S]*?)\n}/)![1];
    expect(print).toMatch(/\.page\s*{\s*display:\s*block;\s*min-height:\s*0/);
  });
});
