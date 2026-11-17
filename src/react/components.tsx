import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from 'react';

/* React wrappers for the CSS components in components.css.
   They hold no styles of their own: they only render the right markup and classes,
   so CSS and React users get exactly the same result. */

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ') || undefined;

type Heading = 'h2' | 'h3' | 'h4';

/* ---------- Layout ---------- */

/** Page container: max width --wrap, side padding 24px. */
export function Wrap({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('wrap', className)} {...rest} />;
}

/* ---------- Button ---------- */

type ButtonOwnProps = {
  /** primary: filled accent, hover highlight. secondary: outlined. */
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
};
export type ButtonProps =
  | (ButtonOwnProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
  | (ButtonOwnProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>);

/** Button. With `href` it renders a link that looks like a button, otherwise a <button type="button">. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', className, children, ...rest } = props;
  const cls = cx('btn', `btn-${variant}`, className);
  if (rest.href !== undefined) {
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
  }
  const { type = 'button', ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} className={cls} {...btn}>{children}</button>;
}

/* ---------- Link ---------- */

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** inline: accent, underlined. muted: footer and secondary links. */
  variant?: 'inline' | 'muted';
};
export function Link({ variant = 'inline', className, ...rest }: LinkProps) {
  return <a className={cx(variant === 'muted' && 'link-muted', className)} {...rest} />;
}

/* ---------- Nav Link ---------- */

export type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { current?: boolean };
/** Navigation item. `current` sets aria-current="page" (accent and an underline). */
export function NavLink({ current, className, ...rest }: NavLinkProps) {
  return <a className={cx('nav-link', className)} aria-current={current ? 'page' : undefined} {...rest} />;
}

/* ---------- Tag ---------- */

export function Tag({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('tag', className)} {...rest} />;
}

export type TagsProps = HTMLAttributes<HTMLUListElement> & { items: string[] };
/** List of tags. Give it an aria-label, for example "Stack". */
export function Tags({ items, className, ...rest }: TagsProps) {
  if (items.length === 0) return null;
  return (
    <ul className={cx('tags', className)} {...rest}>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

/* ---------- Card ---------- */

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: ReactNode;
  /** The title becomes a link that covers the whole card. */
  href?: string;
  /** Small mono line above the title, for example "Open source · 2026". */
  meta?: ReactNode;
  tags?: string[];
  tagsLabel?: string;
  headingLevel?: Heading;
  /** Optional HDR accent: url of a gain-map swatch. Needs hdr.css. */
  hdrSwatch?: string;
};
export function Card({ title, href, meta, tags, tagsLabel = 'Tags', headingLevel: H = 'h3', hdrSwatch, className, style, children, ...rest }: CardProps) {
  const hdrStyle = hdrSwatch ? ({ '--hdr-swatch': `url("${hdrSwatch}")` } as CSSProperties) : undefined;
  return (
    <article className={cx('card', hdrSwatch && 'hdr-card', className)} style={{ ...hdrStyle, ...style }} {...rest}>
      {meta && <span className="meta">{meta}</span>}
      <div className="card-body">
        <H className="card-title">{href ? <a className="stretch" href={href}>{title}</a> : title}</H>
        {children && <p className="card-text">{children}</p>}
      </div>
      {tags && <Tags items={tags.slice(0, 4)} aria-label={tagsLabel} />}
    </article>
  );
}

/* ---------- Quote ---------- */

export type QuoteProps = HTMLAttributes<HTMLQuoteElement> & {
  name: string;
  role?: ReactNode;
  /** Link to the author's profile. */
  href?: string;
};
export function Quote({ name, role, href, className, children, ...rest }: QuoteProps) {
  return (
    <blockquote className={cx('quote', className)} {...rest}>
      <p>{children}</p>
      <footer className="quote-author">
        <strong>{href ? <a href={href}>{name}</a> : name}</strong>
        {role}
      </footer>
    </blockquote>
  );
}

/* ---------- Book Promo ---------- */

export type BookPromoProps = {
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
  href: string;
  /** Link text, for example "Book on Amazon". */
  label: string;
  layout?: 'stack' | 'row';
  className?: string;
};
export function BookPromo({ src, srcSet, alt, width, height, href, label, layout = 'stack', className }: BookPromoProps) {
  return (
    <div className={cx('card', 'book-promo', layout === 'row' && 'book-promo-row', className)}>
      <img src={src} srcSet={srcSet} alt={alt} width={width} height={height} />
      <a className="stretch" href={href}>{label}</a>
    </div>
  );
}

/* ---------- Filter Tabs ---------- */

export type FilterTabsProps = {
  /** Accessible name of the navigation, for example "Filter projects". */
  label: string;
  items: Array<{ href: string; label: string }>;
  /** href of the current item. */
  current?: string;
  className?: string;
};
export function FilterTabs({ label, items, current, className }: FilterTabsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="filters">
        {items.map((i) => (
          <li key={i.href}>
            <a className="filter-tab" href={i.href} aria-current={i.href === current ? 'true' : undefined}>{i.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Sections with Section Head ---------- */

/** Wraps numbered sections: the counter "01 /", "02 /" ... restarts here. */
export function Sections({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('sections', className)} {...rest} />;
}

export type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Used for the heading id and aria-labelledby. */
  id: string;
  title: ReactNode;
  /** Optional link on the right of the heading. */
  link?: { href: string; label: string };
};
/** Section with a numbered heading and a dimension line. */
export function Section({ id, title, link, className, children, ...rest }: SectionProps) {
  return (
    <section className={cx('section', className)} aria-labelledby={id} {...rest}>
      <div className="section-head">
        <h2 id={id}>{title}</h2>
        {link && <a href={link.href}>{link.label}</a>}
      </div>
      {children}
    </section>
  );
}

/* ---------- Facts ---------- */

export type FactsProps = { items: Array<{ value: ReactNode; label: ReactNode }>; label?: string; className?: string };
/** Key facts as a blueprint title block. */
export function Facts({ items, label = 'Key facts', className }: FactsProps) {
  return (
    <ul className={cx('facts', className)} aria-label={label}>
      {items.map((f, i) => <li key={i}><strong>{f.value}</strong><span>{f.label}</span></li>)}
    </ul>
  );
}

/* ---------- Timeline ---------- */

export type TimelineProps = { items: Array<{ period: ReactNode; title: ReactNode; text?: ReactNode }>; headingLevel?: Heading; className?: string };
export function Timeline({ items, headingLevel: H = 'h3', className }: TimelineProps) {
  return (
    <ol className={cx('timeline', className)}>
      {items.map((e, i) => (
        <li key={i}>
          <span className="meta">{e.period}</span>
          <div>
            <H>{e.title}</H>
            {e.text && <p>{e.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Post List ---------- */

export type Post = { href: string; title: ReactNode; date: string; datetime?: string; kind?: string; description?: ReactNode; tags?: string[] };
export type PostListProps = { posts: Post[]; headingLevel?: Heading; className?: string };
export function PostList({ posts, headingLevel: H = 'h3', className }: PostListProps) {
  return (
    <ul className={cx('posts', className)}>
      {posts.map((p) => (
        <li key={p.href}>
          <span className="meta"><time dateTime={p.datetime}>{p.date}</time>{p.kind && ` · ${p.kind}`}</span>
          <div>
            <H><a href={p.href}>{p.title}</a></H>
            {p.description && <p>{p.description}</p>}
            {p.tags && <Tags items={p.tags} aria-label="Tags" />}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Small uppercase label above a list, for example "Best writing". */
export function Subhead({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('subhead', className)} {...rest} />;
}

/* ---------- Site Header and Footer ---------- */

export type SiteHeaderProps = {
  brand: { href: string; label: string; logoSrc?: string; logoClassName?: string };
  nav: Array<{ href: string; label: string; current?: boolean }>;
  navLabel?: string;
};
export function SiteHeader({ brand, nav, navLabel = 'Main' }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="wrap">
        <a className="brand" href={brand.href} aria-label={`${brand.label}, home`}>
          {brand.logoSrc && <img src={brand.logoSrc} alt="" className={brand.logoClassName} />}
          <span>{brand.label}</span>
        </a>
        <nav aria-label={navLabel} className="site-nav">
          <ul>
            {nav.map((n) => <li key={n.href}><NavLink href={n.href} current={n.current}>{n.label}</NavLink></li>)}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export type SiteFooterProps = { children: ReactNode; note?: ReactNode };
export function SiteFooter({ children, note }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        {children}
        {note && <span className="site-note">{note}</span>}
      </div>
    </footer>
  );
}
