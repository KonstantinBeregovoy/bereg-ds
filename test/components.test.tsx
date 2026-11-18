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
  it('keeps text contrast 7:1 and interactive borders 3:1', () => {
    for (const [fg, bg] of [['text', 'bg'], ['text', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['accent', 'bg'],
      ['accent', 'surface'], ['highlight', 'bg'], ['accent-ink', 'accent'], ['accent-ink', 'highlight']]) {
      expect(ratio(light[fg], light[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(7);
    }
    expect(ratio(light['line-strong'], light.bg)).toBeGreaterThanOrEqual(3);
    expect(ratio(light['line-strong'], light.surface)).toBeGreaterThanOrEqual(3);
  });
});
