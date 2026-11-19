import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Link, Section, Sections, SiteFooter, SiteHeader } from '../src/react';

// In a project the class goes on <body>. Storybook renders stories inside its own root element,
// so here a wrapper <div class="page blueprint"> stands in for <body>.
const meta = {
  title: 'Pages/Page layout',
  parameters: {
    layout: 'fullscreen',
    // Each story in its own frame: the layout fills the frame's height, as a page fills the screen.
    docs: {
      story: { inline: false, height: '640px' },
      description: { component: 'Optional `.page` class on `<body>`: on a short page the footer sits at the bottom of the screen, on a long page it follows the content. `<main>`, `.site-header` and `.site-footer` are direct children. Here a wrapper `<div class="page blueprint">` stands in for `<body>`.' },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="page blueprint">
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader brand={{ href: '#home', label: 'Konstantin Beregovoy', logoSrc: '/assets/logo.png' }}
        nav={[{ href: '#home', label: 'Home' }, { href: '#projects', label: 'Projects' }, { href: '#blog', label: 'Blog' }, { href: '#contact', label: 'Contact', current: true }]} />
      <main id="main" style={{ paddingBlock: 'var(--space-16)' }}>
        <div className="wrap">{children}</div>
      </main>
      <SiteFooter>
        <span>© 2026 Konstantin Beregovoy</span>
        <span><Link href="#in" variant="muted">LinkedIn</Link> · <Link href="#gh" variant="muted">GitHub</Link></span>
      </SiteFooter>
    </div>
  );
}

export const Short: Story = {
  name: 'Short content',
  render: () => (
    <Page>
      <h1>Contact</h1>
      <p className="text-lede">Write to me on LinkedIn. The footer stays at the bottom of the screen.</p>
    </Page>
  ),
};

export const Long: Story = {
  name: 'Long content',
  render: () => (
    <Page>
      <h1>Blog</h1>
      <Sections>
        {Array.from({ length: 6 }, (_, i) => (
          <Section key={i} id={`long-${i}`} title={`Section ${i + 1}`}>
            <p>Long page: the footer follows the content and appears only after scrolling to the end.</p>
            <p>The blueprint grid stays at the top of the page and fades out downwards, as on a page without the layout class.</p>
          </Section>
        ))}
      </Sections>
    </Page>
  ),
};
