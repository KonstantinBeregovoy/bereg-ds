import type { Meta, StoryObj } from '@storybook/react-vite';
import { Facts, FilterTabs, PostList, Section, Sections, SiteFooter, SiteHeader, Subhead, Timeline, Link } from '../src/react';
import { FIGMA } from './figma';

const meta = {
  title: 'Patterns/Sections and lists',
  parameters: { docs: { description: { component: `Section Head (numbered with a CSS counter, dimension line), Facts, Timeline, Post list, Filter tabs, Site header and footer. [Figma](${FIGMA})` } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SectionHead: Story = {
  name: 'Section Head',
  render: () => (
    <Sections>
      <Section id="s-help" title="How I help a business"><p>Section content.</p></Section>
      <Section id="s-projects" title="Selected projects" link={{ href: '#all', label: 'All projects' }}><p>Section content.</p></Section>
    </Sections>
  ),
};

export const FactsStory: Story = {
  name: 'Facts',
  render: () => (
    <Facts items={[
      { value: '15+', label: 'years in frontend' },
      { value: '8', label: 'engineers led at peak' },
      { value: '100x', label: 'customer growth supported at Perimeter 81' },
      { value: 'Top 3', label: 'software development creator in Israel (Favikon, Sep 2026)' },
    ]} />
  ),
};

export const TimelineStory: Story = {
  name: 'Timeline',
  render: () => (
    <Timeline items={[
      { period: 'Jul 2026 to now', title: 'Frontend Technical Lead, OleOle', text: 'Building the frontend of a pre-launch social platform for football fans.' },
      { period: 'Dec 2022 to Jan 2026', title: 'Frontend Team Lead (Founding Engineer), Payouts.com', text: 'First engineering hire. Built the frontend from scratch and grew the team to 8 engineers.' },
    ]} />
  ),
};

export const Posts: Story = {
  name: 'Post list',
  render: () => (
    <div>
      <Subhead>Best writing</Subhead>
      <PostList posts={[
        { href: '#hdr', title: 'Brighter than #fff: building an HDR logo tool in the browser', date: '15 Oct 2026', datetime: '2026-10-15', kind: 'article', description: 'How I built hdr-glow, a free browser tool that makes parts of a logo glow on HDR screens.', tags: ['frontend', 'web-standards'] },
        { href: '#ruby', title: 'If <script> is for JS, then what is <ruby> for?', date: '3 Jun 2026', datetime: '2026-06-03', kind: 'post', description: 'The ruby element is a semantic HTML gem for phonetic annotations.', tags: ['frontend', 'accessibility'] },
      ]} />
    </div>
  ),
};

export const Filters: Story = {
  name: 'Filter tabs',
  render: () => (
    <FilterTabs label="Filter projects" current="#all" items={[
      { href: '#all', label: 'All' }, { href: '#os', label: 'Open source' }, { href: '#std', label: 'Standards' },
      { href: '#pro', label: 'Professional' }, { href: '#personal', label: 'Personal' },
    ]} />
  ),
};

export const HeaderFooter: Story = {
  name: 'Site header and footer',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <SiteHeader brand={{ href: '#home', label: 'Konstantin Beregovoy', logoSrc: '/assets/logo.png' }}
        nav={[{ href: '#home', label: 'Home', current: true }, { href: '#about', label: 'About' }, { href: '#projects', label: 'Projects' }, { href: '#blog', label: 'Blog' }, { href: '#contact', label: 'Contact' }]} />
      <div style={{ height: '8rem' }} />
      <SiteFooter note={<>Lighthouse 100 · Security Headers A+ · <Link href="#built" variant="muted">How this site is built</Link></>}>
        <span>© 2026 Konstantin Beregovoy</span>
        <span><Link href="#in" variant="muted">LinkedIn</Link> · <Link href="#gh" variant="muted">GitHub</Link> · <Link href="#rss" variant="muted">RSS</Link></span>
      </SiteFooter>
    </div>
  ),
};
