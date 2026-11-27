import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import {
  BookPromo, Button, Card, CodeBlock, ColorField, Dropzone, Facts, Field, FilterTabs, Link, NavLink, PostList, Quote, Range,
  Section, Sections, SiteFooter, SiteHeader, Tag, Tags, TextInput, Timeline,
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
  // Same helper as the other blocks. Before 1.4.0 this used new URL(`../src/css/${f}`, import.meta.url), which Vite
  // rewrites, so these two tests read this test file instead of the CSS. "reads the CSS" guards against that.
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = [read('../src/css/components.css'), read('../src/css/base.css')].join('\n');
  it('reads the CSS', () => {
    expect(css).toMatch(/\.btn\s*{/);
    expect(css).toMatch(/\.blueprint::before/);
  });
  it('uses tokens for spacing: no raw px in padding, margin, gap', () => {
    // Exception: the 1px gap of .facts draws the hairlines between cells (a line, not spacing).
    const bad = css.split('\n').filter((l) => /\b(padding|margin|gap)[\w-]*\s*:[^;]*\d+px/.test(l) && !/minmax\(min\(12\.5rem, 100%\), 1fr\)\); gap: 1px;$/.test(l));
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
      ['accent', 'surface'], ['highlight', 'bg'], ['accent-ink', 'accent'], ['accent-ink', 'highlight'], ['danger', 'bg'], ['danger', 'surface']]) {
      expect(ratio(t[fg], t[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(7);
    }
    for (const t of [dark, light]) {
      for (const ui of ['line-strong', 'focus', 'accent', 'highlight', 'danger']) {
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
      expect(ratio(t.text, over(t['accent-subtle'], base)), 'text on accent-subtle (dropzone drag)').toBeGreaterThanOrEqual(7);
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

describe('Prose long words', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/components.css').replace(/\/\*[\s\S]*?\*\//g, '');
  it('links and inline code wrap anywhere, pre keeps its scroll', () => {
    expect(css).toMatch(/\.prose a, \.prose :not\(pre\) > code\s*{\s*overflow-wrap:\s*anywhere;?\s*}/);
    expect(css).toMatch(/\.prose pre\s*{[^}]*overflow-x:\s*auto/);
  });
  it('the rule is scoped to .prose', () => {
    const bad = css.split('\n').filter((l) => /overflow-wrap:\s*anywhere/.test(l) && !/^\.prose /.test(l.trim()));
    expect(bad).toEqual([]);
  });
});

describe('Grids on narrow screens', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/components.css').replace(/\/\*[\s\S]*?\*\//g, '');
  it('every minmax() column shrinks to the container: minmax(min(<size>, 100%), 1fr)', () => {
    const all = css.match(/minmax\([^;]*?\)\s*,\s*1fr\)|minmax\([^()]*\)/g) ?? [];
    expect(all.length).toBeGreaterThanOrEqual(5);
    for (const m of all) expect(m, m).toMatch(/^minmax\(min\([\d.]+rem, 100%\), 1fr\)$/);
  });
});

describe('1.4.0: optional props keep the old output', () => {
  it('Button: small and pressed only when asked', () => {
    render(<><Button>Plain</Button><Button variant="secondary" size="sm" pressed>On</Button><Button variant="secondary" pressed={false}>Off</Button></>);
    const plain = screen.getByRole('button', { name: 'Plain' });
    expect(plain.className).toBe('btn btn-primary');
    expect(plain).not.toHaveAttribute('aria-pressed');
    expect(screen.getByRole('button', { name: 'On' })).toHaveClass('btn-sm');
    expect(screen.getByRole('button', { name: 'On' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Off' })).toHaveAttribute('aria-pressed', 'false');
  });
  it('Section: sectionId on <section>, headingClassName on <h2>; without them as before', () => {
    const { container } = render(<>
      <Section id="h-old" title="Old"><p>a</p></Section>
      <Section id="h-new" sectionId="tool" headingClassName="text-h2-article" title="New"><p>b</p></Section>
    </>);
    const [oldS, newS] = container.querySelectorAll('section');
    expect(oldS).not.toHaveAttribute('id');
    expect(oldS.querySelector('h2')).not.toHaveAttribute('class');
    expect(newS).toHaveAttribute('id', 'tool');
    expect(newS).toHaveAttribute('aria-labelledby', 'h-new');
    expect(screen.getByRole('heading', { name: 'New' })).toHaveClass('text-h2-article');
  });
  it('SiteHeader: sticky class only with the prop', () => {
    const nav = [{ href: '/', label: 'Home' }];
    const { container } = render(<><SiteHeader brand={{ href: '/', label: 'A' }} nav={nav} /><SiteHeader sticky brand={{ href: '/', label: 'B' }} nav={nav} navLabel="Second" /></>);
    const [a, b] = container.querySelectorAll('header');
    expect(a.className).toBe('site-header');
    expect(b).toHaveClass('site-header', 'site-header-sticky');
  });
  it('Tag: plain span by default, button and removable variants', () => {
    const remove = vi.fn();
    const { container } = render(<><Tag>Plain</Tag><Tag as="button">Add</Tag><Tag onRemove={remove}>React</Tag></>);
    expect(container.querySelector('span.tag')!.className).toBe('tag');
    expect(screen.getByRole('button', { name: 'Add' })).toHaveClass('tag', 'tag-button');
    expect(screen.getByRole('button', { name: 'Add' })).toHaveAttribute('type', 'button');
    fireEvent.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(remove).toHaveBeenCalledOnce();
  });
});

describe('Forms', () => {
  it('Field connects label, hint and error to the control', () => {
    render(<>
      <Field label="Name" hint="Short."><TextInput /></Field>
      <Field label="Email" error="Wrong email." id="email"><TextInput type="email" /></Field>
    </>);
    const name = screen.getByLabelText('Name');
    expect(name).toHaveClass('input');
    expect(name).toHaveAttribute('type', 'text');
    expect(name).toHaveAccessibleDescription('Short.');
    expect(name).not.toHaveAttribute('aria-invalid');
    const email = screen.getByLabelText('Email');
    expect(email).toHaveAttribute('id', 'email');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Wrong email.');
  });
  it('Range is a native range with its class', () => {
    render(<Field label="Boost"><Range min={0} max={10} defaultValue={5} /></Field>);
    expect(screen.getByRole('slider', { name: 'Boost' })).toHaveClass('range');
  });
  it('ColorField shows the hex value and reports changes', () => {
    // Colors built from parts: the CSS rules test above scans for hex literals.
    const blue = '#' + '78c2ff', red = '#' + 'ff0000';
    const change = vi.fn();
    render(<ColorField label="Glow" value={blue} onChange={change} />);
    const input = screen.getByLabelText('Glow');
    expect(input).toHaveAttribute('type', 'color');
    expect(screen.getByText(blue)).toHaveClass('color-field-value');
    fireEvent.change(input, { target: { value: red } });
    expect(change).toHaveBeenCalledWith(red);
  });
});

describe('Dropzone', () => {
  const file = new File(['x'], 'logo.png', { type: 'image/png' });
  it('is a label around a file input; choosing calls onFiles', () => {
    const onFiles = vi.fn();
    render(<Dropzone onFiles={onFiles} accept="image/*" title="Drop an image" hint="PNG" />);
    const input = screen.getByLabelText('Drop an image', { exact: false }) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveClass('visually-hidden');
    expect(input.closest('label')).toHaveClass('dropzone');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });
  it('drag sets data-drag, drop calls onFiles and clears it', () => {
    const onFiles = vi.fn();
    const { container } = render(<Dropzone onFiles={onFiles} />);
    const zone = container.querySelector('.dropzone')!;
    const dataTransfer = { types: ['Files'], files: [file], dropEffect: '' };
    fireEvent.dragEnter(zone, { dataTransfer });
    expect(zone).toHaveAttribute('data-drag');
    fireEvent.drop(zone, { dataTransfer });
    expect(zone).not.toHaveAttribute('data-drag');
    expect(onFiles).toHaveBeenCalledWith([file]);
  });
});

describe('CodeBlock', () => {
  it('has a label, a copy button and a focusable scroll area', () => {
    render(<CodeBlock label="CSS" code=".a { color: red; }" />);
    expect(screen.getByText('CSS', { selector: '.code-block-label' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy CSS' })).toHaveClass('btn', 'btn-sm');
    const region = screen.getByRole('region', { name: 'CSS code' });
    expect(region.tagName).toBe('PRE');
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveTextContent('.a { color: red; }');
  });
  const secure = (v: boolean) => Object.defineProperty(window, 'isSecureContext', { value: v, configurable: true });
  const clipboard = (writeText?: ReturnType<typeof vi.fn>) =>
    Object.defineProperty(navigator, 'clipboard', { value: writeText ? { writeText } : undefined, configurable: true });
  const exec = (result: boolean) => Object.defineProperty(document, 'execCommand', { value: vi.fn(() => result), configurable: true });
  afterEach(() => { vi.useRealTimers(); });

  it('shows "Copied" on the button for 2 s, announces it once, then shows "Copy" again', async () => {
    secure(true);
    const writeText = vi.fn().mockResolvedValue(undefined);
    clipboard(writeText);
    render(<CodeBlock label="JS" code="go()" />);
    const button = screen.getByRole('button', { name: 'Copy JS' });
    vi.useFakeTimers();
    await act(async () => { fireEvent.click(button); });
    expect(writeText).toHaveBeenCalledWith('go()');
    // The visible text is the accessible name: "Copied", not "Copy JS".
    expect(button).toHaveAccessibleName('Copied');
    await act(async () => { vi.advanceTimersByTime(100); });
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(button).toHaveAccessibleName('Copy JS');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
  it('keeps all texts in the button, so its width does not change', () => {
    render(<CodeBlock label="CSS" code="a" copiedMessage="Copied" failedMessage="Copy failed" />);
    const texts = screen.getByRole('button', { name: 'Copy CSS' }).querySelectorAll('.code-block-copy > span');
    expect(Array.from(texts, (t) => t.textContent)).toEqual(['Copy CSS', 'Copied', 'Copy failed']);
    expect(texts[0]).toHaveAttribute('data-active');
    expect(texts[1]).toHaveAttribute('aria-hidden', 'true');
  });
  it('falls back to execCommand outside a secure context (http://192.168.x.x)', async () => {
    secure(false);
    const writeText = vi.fn();
    clipboard(writeText);
    exec(true);
    render(<CodeBlock label="CSS" code=".a{}" />);
    const button = screen.getByRole('button', { name: 'Copy CSS' });
    button.focus();
    await act(async () => { fireEvent.click(button); });
    expect(writeText).not.toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleName('Copied');
  });
  it('falls back when the Clipboard API is missing or rejects; shows "Copy failed" when nothing works', async () => {
    secure(true);
    clipboard(vi.fn().mockRejectedValue(new Error('blocked')));
    exec(false);
    render(<CodeBlock label="HTML" code="<b>" />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy HTML' })); });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copy failed'));
  });
  it('uses onCopy from the project when given', async () => {
    exec(true);
    const onCopy = vi.fn().mockResolvedValue(true);
    render(<CodeBlock label="CSS" code="x" onCopy={onCopy} />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy CSS' })); });
    expect(onCopy).toHaveBeenCalledWith('x');
    expect(document.execCommand).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});

describe('1.4.1 Tag remove target', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/components.css');
  const px = (name: string) => parseFloat(read('../dist/css/tokens.css').match(new RegExp(`--${name}:\\s*([\\d.]+)rem`))![1]) * 16;
  it('the × has a 24×24 target that stays inside the tag', () => {
    const size = css.match(/\.tag-remove\s*{[^}]*inline-size:\s*var\(--([\w-]+)\);\s*block-size:\s*var\(--([\w-]+)\)/)!;
    const inset = css.match(/\.tag-remove::before\s*{[^}]*position:\s*absolute;\s*inset:\s*calc\(-1 \* var\(--([\w-]+)\)\)/)!;
    expect(px(size[1]) + 2 * px(inset[1])).toBeGreaterThanOrEqual(24);
    expect(px(size[2]) + 2 * px(inset[1])).toBeGreaterThanOrEqual(24);
    // Right: the target grows by the inset; the tag's right padding must cover it, so neighbours do not overlap.
    const pad = css.match(/\.tag-removable\s*{[^}]*gap:\s*var\(--([\w-]+)\);\s*padding-inline-end:\s*var\(--([\w-]+)\)/)!;
    expect(px(pad[2])).toBeGreaterThanOrEqual(px(inset[1]));
    expect(px(pad[1])).toBeGreaterThanOrEqual(px(inset[1]));
  });
});

describe('1.4.2 CSS fixes', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/components.css');
  it('Code Block does not grow to its longest line in a grid or flex', () => {
    expect(css).toMatch(/\.code-block\s*{\s*min-width:\s*0;\s*max-width:\s*100%;/);
    expect(css).toMatch(/\.code-block pre\s*{[^}]*overflow-x:\s*auto/);
  });
  it('Code Block inside .prose has no second border and keeps 14px code', () => {
    expect(css).toMatch(/\.prose \.code-block pre\s*{\s*border:\s*0;\s*border-radius:\s*0;\s*background:\s*none;/);
    expect(css).toMatch(/\.prose \.code-block code\s*{\s*font-size:\s*inherit;/);
    // The reset comes after the .prose pre rule, so it wins at the same specificity or higher.
    expect(css.indexOf('.prose .code-block pre')).toBeGreaterThan(css.indexOf('.prose pre {'));
    // .prose pre itself is unchanged.
    expect(css).toMatch(/\.prose pre\s*{\s*max-width:\s*100%;\s*background:\s*var\(--surface\);\s*border:\s*var\(--border-thin\) solid var\(--line\)/);
  });
  it('button tag lines up its content like the removable tag', () => {
    expect(css).toMatch(/\.tag-button\s*{\s*display:\s*inline-flex;\s*align-items:\s*center;\s*gap:\s*var\(--space-1\);/);
  });
});

describe('1.4.0 CSS', () => {
  const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const css = read('../src/css/components.css');
  it('interactive borders use --line-strong, errors use --danger', () => {
    expect(css).toMatch(/\.input\s*{[^}]*border:[^;]*var\(--line-strong\)/);
    expect(css).toMatch(/\.input\[aria-invalid='true'\]\s*{[^}]*var\(--danger\)/);
    expect(css).toMatch(/\.input::placeholder\s*{[^}]*color:\s*var\(--muted\)/);
    expect(css).toMatch(/\.range\s*{[^}]*accent-color:\s*var\(--accent\)/);
    expect(css).toMatch(/\.tag-button, \.tag-removable\s*{\s*border-color:\s*var\(--line-strong\)/);
  });
  it('pressed buttons have their own look and a forced-colors fallback', () => {
    expect(css).toMatch(/\.btn\[aria-pressed='true'\][^{]*{[^}]*background:\s*var\(--accent\)/);
    const forced = css.slice(css.indexOf('@media (forced-colors: active)'));
    expect(forced).toMatch(/\.btn\[aria-pressed='true'\]/);
  });
  it('dropzone shows the focus ring around the zone', () => {
    expect(css).toMatch(/\.dropzone:focus-within\s*{[^}]*outline:\s*var\(--border-thick\) solid var\(--focus\);\s*outline-offset:\s*var\(--focus-offset\)/);
  });
  it('sticky header is opt-in and turned off in print', () => {
    expect(css).toMatch(/\.site-header\s*{[^}]*}/);
    expect(css.match(/\.site-header\s*{[^}]*}/)![0]).not.toMatch(/sticky/);
    expect(css).toMatch(/\.site-header-sticky\s*{[^}]*position:\s*sticky/);
    expect(css).toMatch(/@media print\s*{\s*\.site-header-sticky\s*{\s*position:\s*static/);
  });
  it('spacing scale has 40 and 48', () => {
    const tokens = read('../dist/css/tokens.css');
    expect(tokens).toMatch(/--space-10:\s*2\.5rem/);
    expect(tokens).toMatch(/--space-12:\s*3rem/);
  });
});
