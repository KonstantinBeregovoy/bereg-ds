import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookPromo, Button, Card, Facts, Link, PostList, Quote, Section, Sections, SiteFooter, SiteHeader, Subhead, Timeline } from '../src/react';

const meta = {
  title: 'Pages/Home (bereg.dev)',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'The bereg.dev home page assembled only from Bereg DS components. Same check as the "Home (check)" page in Figma.' } } },
} satisfies Meta;
export default meta;

const projects = [
  ['Open source · 2026', 'hdr-glow', 'Free open-source tool that makes selected colors of a logo, image or text glow on HDR screens.', ['TypeScript', 'React', 'Web Workers', 'OKLab']],
  ['Personal · 2024', 'Shahmatland', 'Chess education platform that grew from a personal MVP to almost 10,000 users, 20+ schools and 13+ instructors.', ['React 19', 'Vite', 'WebSocket', 'Stockfish']],
  ['Personal · 2026', 'CSS Unit Rulebook', 'Reference site for all 63 CSS units, with live demos and browser support computed from MDN data.', ['Astro', 'TypeScript', 'CSS', 'Web Components']],
  ['Open source · 2026', 'Jay Framework: a11y-validator', 'Open-source accessibility rules for Jay Framework (Wix): structural gaps that Lighthouse does not catch.', ['TypeScript', 'WCAG 2.x', 'HTML semantics', 'Static analysis']],
  ['Open source · 2026', 'Plain A11y', 'Free Chrome and Firefox extension that turns accessibility audit results into plain-language fixes for designers, writers and product teams.', ['TypeScript', 'Manifest V3', 'axe-core', 'React']],
  ['Standards · 2026', 'Interop 2027: Temporal API proposal', 'Focus area proposal asking browsers to align on the Temporal API in the Interop 2027 cycle.', ['Temporal', 'Web standards', 'web-platform-tests']],
] as const;

export const Home: StoryObj = {
  render: () => (
    <div className="blueprint">
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader brand={{ href: '#home', label: 'Konstantin Beregovoy', logoSrc: '/assets/logo.png' }}
        nav={[{ href: '#home', label: 'Home', current: true }, { href: '#about', label: 'About' }, { href: '#projects', label: 'Projects' }, { href: '#certificates', label: 'Certificates' }, { href: '#blog', label: 'Blog' }, { href: '#contact', label: 'Contact' }]} />
      <main id="main" style={{ padding: 'var(--space-16) 0' }}>
        <div className="wrap">
          <Sections>
            <section className="section" aria-labelledby="hero-title" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', columnGap: 'var(--space-8)', rowGap: 'var(--space-6)' }}>
              <h1 id="hero-title">Konstantin Beregovoy<span className="text-h1-subtitle muted" style={{ display: 'block', marginTop: 'var(--space-4)' }}>Senior AI Frontend Engineer, Tech &amp; Team Lead</span></h1>
              <p className="text-lede-hero" style={{ margin: 0, gridColumn: 1 }}>I build and lead frontend teams for complex products in fintech, platforms and developer tools. React, TypeScript, accessibility and web standards.</p>
              <div className="actions" style={{ gridColumn: 1 }}>
                <Button href="#projects">Projects</Button>
                <Button href="#contact" variant="secondary">Contact</Button>
                <Link href="#in">LinkedIn</Link>
                <Link href="#gh">GitHub</Link>
              </div>
              <div style={{ gridColumn: 2, gridRow: '1 / span 3', alignSelf: 'center' }}>
                <BookPromo src="/assets/css-unit-rulebook-cover-140.webp" srcSet="/assets/css-unit-rulebook-cover-280.webp 2x" width={140} height={200} alt="Cover of CSS Unit Rulebook, 2026 edition" href="#amazon" label="Book on Amazon" />
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-8)' }}>
                <Facts items={[{ value: '15+', label: 'years in frontend' }, { value: '8', label: 'engineers led at peak' }, { value: '100x', label: 'customer growth supported at Perimeter 81' }, { value: 'Top 3', label: 'software development creator in Israel (Favikon, Sep 2026)' }]} />
              </div>
            </section>

            <Section id="help" title="How I help a business">
              <div className="grid grid-4">
                <Card title="Faster delivery">AI-assisted workflows and AI code review cut pull request turnaround to under 24 hours and sped up development cycles about 3x at Payouts.com.</Card>
                <Card title="Shorter time to market">A unified design system and strict API contracts reduced time to market by 70% across products.</Card>
                <Card title="Scale without chaos">A modular UI architecture and an internal analytics platform supported 100x customer growth (30 to 3,000+) at Perimeter 81.</Card>
                <Card title="Accessible and audit-ready">WCAG compliance and SOC 2 preparation built into the frontend, plus open source work on accessibility validation.</Card>
              </div>
            </Section>

            <Section id="projects" title="Selected projects" link={{ href: '#all-projects', label: 'All projects' }}>
              <div className="grid">
                {projects.map(([m, t, d, tags]) => <Card key={t} meta={m} title={t} href={`#${t}`} tags={[...tags]} tagsLabel="Stack">{d}</Card>)}
              </div>
            </Section>

            <Section id="experience" title="Experience" link={{ href: '#history', label: 'Full history' }}>
              <Timeline items={[
                { period: 'Jul 2026 to now', title: 'Frontend Technical Lead (consultant, part-time), OleOle', text: 'Building the frontend of a pre-launch social platform for football fans in a pnpm monorepo: a Mini Programs developer portal, a wallet and a feed.' },
                { period: 'Dec 2024 to now', title: 'Founder and Technical Lead (volunteer), Shahmatland', text: 'A chess education platform with almost 10,000 users, 20+ schools and 13+ instructors.' },
                { period: 'Dec 2022 to Jan 2026', title: 'Frontend Team Lead (Founding Engineer), Payouts.com', text: 'First engineering hire. Built the frontend from scratch and grew the team to 8 engineers.' },
              ]} />
            </Section>

            <Section id="recs" title="Recommendations" link={{ href: '#linkedin', label: 'On LinkedIn' }}>
              <div className="quotes">
                <Quote name="Sergei Antonov" role="VP of R&D, Payouts.com">He doesn’t just write exceptional React/TypeScript code; he builds autonomous engineering cultures.</Quote>
                <Quote name="Barak Hirchson" role="Founder & Chief AI Officer, Payouts.com">He is an outstanding Frontend Lead and a true business partner.</Quote>
                <Quote name="Barak Yerushalmi" role="VP of Products, Payouts.com" href="#by">Under his leadership, our frontend architecture became far more modular, testable, and future-proof.</Quote>
              </div>
            </Section>

            <Section id="writing" title="Writing" link={{ href: '#blog', label: 'All writing' }}>
              <Subhead>Best writing</Subhead>
              <PostList posts={[
                { href: '#hdr', title: 'Brighter than #fff: building an HDR logo tool in the browser', date: '15 Oct 2026', datetime: '2026-10-15', kind: 'article', description: 'How I built hdr-glow, a free browser tool that makes parts of a logo glow on HDR screens.', tags: ['frontend', 'web-standards'] },
                { href: '#ruby', title: 'If <script> is for JS, then what is <ruby> for?', date: '3 Jun 2026', datetime: '2026-06-03', kind: 'post', description: 'The ruby element is a semantic HTML gem for phonetic annotations, with zero JavaScript and native accessibility.', tags: ['frontend', 'accessibility'] },
              ]} />
            </Section>

            <Section id="contact" title="Contact">
              <p className="lede">Open to frontend leadership, consulting and interesting product problems.</p>
              <div className="actions"><Button href="#in">LinkedIn</Button><Button href="#gh" variant="secondary">GitHub</Button></div>
            </Section>
          </Sections>
        </div>
      </main>
      <SiteFooter note={<>Lighthouse 100 · Security Headers A+ · <Link href="#built" variant="muted">How this site is built</Link></>}>
        <span>© 2026 Konstantin Beregovoy</span>
        <span><Link href="#in" variant="muted">LinkedIn</Link> · <Link href="#gh" variant="muted">GitHub</Link> · <Link href="#rss" variant="muted">RSS</Link></span>
      </SiteFooter>
    </div>
  ),
};
