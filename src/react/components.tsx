import { cloneElement, useId, useRef, useState } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  DragEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
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
  /** sm: small button for toolbars and panels (Copy, Add). */
  size?: 'sm';
  /** Toggle button: sets aria-pressed. Use with variant="secondary". */
  pressed?: boolean;
  children: ReactNode;
  className?: string;
};
export type ButtonProps =
  | (ButtonOwnProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
  | (ButtonOwnProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>);

/** Button. With `href` it renders a link that looks like a button, otherwise a <button type="button">. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size, pressed, className, children, ...rest } = props;
  const cls = cx('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className);
  if (rest.href !== undefined) {
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
  }
  const { type = 'button', ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} className={cls} aria-pressed={pressed} {...btn}>{children}</button>;
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

export type TagProps = HTMLAttributes<HTMLElement> & {
  /** button: the whole tag is a <button type="button"> (add, toggle with aria-pressed). */
  as?: 'span' | 'button';
  /** Shows a remove button (×) after the text. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Default: "Remove <text>" when the text is a string. */
  removeLabel?: string;
  /** Only for as="button". */
  disabled?: boolean;
};
/** Tag. Plain by default; `as="button"` or `onRemove` make it interactive. */
export function Tag({ as = 'span', onRemove, removeLabel, disabled, className, children, ...rest }: TagProps) {
  if (as === 'button') {
    return <button type="button" className={cx('tag', 'tag-button', className)} disabled={disabled} {...rest}>{children}</button>;
  }
  if (onRemove) {
    const label = removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove');
    return (
      <span className={cx('tag', 'tag-removable', className)} {...rest}>
        {children}
        <button type="button" className="tag-remove" aria-label={label} onClick={onRemove}><span aria-hidden="true">×</span></button>
      </span>
    );
  }
  return <span className={cx('tag', className)} {...rest}>{children}</span>;
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
  /** id on the <section> itself, for anchors (#about). Must differ from `id`, which is on the heading. */
  sectionId?: string;
  /** Class on the <h2>. */
  headingClassName?: string;
};
/** Section with a numbered heading and a dimension line. */
export function Section({ id, title, link, sectionId, headingClassName, className, children, ...rest }: SectionProps) {
  return (
    <section id={sectionId} className={cx('section', className)} aria-labelledby={id} {...rest}>
      <div className="section-head">
        <h2 id={id} className={headingClassName}>{title}</h2>
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
  /** Keeps the header on top while the page scrolls (.site-header-sticky). Off by default. */
  sticky?: boolean;
};
export function SiteHeader({ brand, nav, navLabel = 'Main', sticky }: SiteHeaderProps) {
  return (
    <header className={cx('site-header', sticky && 'site-header-sticky')}>
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

/* ---------- Forms: Field, Text Input, Range, Color Field ---------- */

export type FieldProps = {
  label: ReactNode;
  /** Help text under the control. */
  hint?: ReactNode;
  /** Error text. When set, the control gets aria-invalid="true" and a --danger border. */
  error?: ReactNode;
  /** id of the control. Generated when not set. */
  id?: string;
  className?: string;
  /** One control: TextInput, Range, an <input>, <select> or <textarea>. */
  children: ReactElement<Record<string, unknown>>;
};
/** Label, control, hint and error. Connects them: for/id, aria-describedby, aria-invalid. */
export function Field({ label, hint, error, id, className, children }: FieldProps) {
  const auto = useId();
  const controlId = id ?? auto;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const own = children.props['aria-describedby'] as string | undefined;
  const describedBy = [own, hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx('field', className)}>
      <label className="field-label" htmlFor={controlId}>{label}</label>
      {cloneElement(children, {
        id: controlId,
        'aria-describedby': describedBy,
        ...(error ? { 'aria-invalid': true } : {}),
      })}
      {hint && <p className="field-hint" id={hintId}>{hint}</p>}
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** text (default), email, search, url, tel, password, number. */
  type?: 'text' | 'email' | 'search' | 'url' | 'tel' | 'password' | 'number';
};
/** Text input. Put it in a Field for the label, hint and error. */
export function TextInput({ type = 'text', className, ...rest }: TextInputProps) {
  return <input type={type} className={cx('input', className)} {...rest} />;
}

export type RangeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
/** Range slider in the accent color. Put it in a Field for the label. */
export function Range({ className, ...rest }: RangeProps) {
  return <input type="range" className={cx('range', className)} {...rest} />;
}

export type ColorFieldProps = {
  label: ReactNode;
  /** Color as #rrggbb. */
  value: string;
  onChange: (hex: string) => void;
  hint?: ReactNode;
  id?: string;
  className?: string;
  disabled?: boolean;
};
/** Native color picker with its hex value in mono. The color logic stays in the project. */
export function ColorField({ label, value, onChange, hint, id, className, disabled }: ColorFieldProps) {
  return (
    <Field label={label} hint={hint} id={id} className={className}>
      <ColorControl value={value} onChange={onChange} disabled={disabled} />
    </Field>
  );
}
function ColorControl({ value, onChange, ...rest }: { value: string; onChange: (hex: string) => void; disabled?: boolean }) {
  return (
    <span className="color-field">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
      <span className="color-field-value">{value}</span>
    </span>
  );
}

/* ---------- Dropzone ---------- */

export type DropzoneProps = {
  /** Called with the dropped or chosen files. Checks (type, size) are up to the project. */
  onFiles: (files: File[]) => void;
  /** Passed to the file input, for example "image/*". Filters the file dialog only. */
  accept?: string;
  multiple?: boolean;
  title?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  className?: string;
};
/** Drop area: a <label> around a visually hidden file input. Click, keyboard and drag and drop. */
export function Dropzone({ onFiles, accept, multiple, title = 'Drop a file here or choose one', hint, disabled, className }: DropzoneProps) {
  const [drag, setDrag] = useState(false);
  const depth = useRef(0);
  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes('Files');
  const hintId = useId();
  return (
    <label
      className={cx('dropzone', className)}
      data-drag={drag ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onDragEnter={(e) => { if (disabled || !hasFiles(e)) return; e.preventDefault(); depth.current += 1; setDrag(true); }}
      onDragOver={(e) => { if (disabled || !hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
      onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (depth.current === 0) setDrag(false); }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault(); depth.current = 0; setDrag(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
    >
      <input
        type="file" className="visually-hidden" accept={accept} multiple={multiple} disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = ''; // the same file can be chosen again
          if (files.length) onFiles(files);
        }}
      />
      <span className="dropzone-title">{title}</span>
      {hint && <span className="dropzone-hint" id={hintId}>{hint}</span>}
    </label>
  );
}

/* ---------- Code Block ---------- */

export type CodeBlockProps = {
  /** Panel label, for example HTML, CSS, JS. Also names the scroll area: "<label> code". */
  label: string;
  code: string;
  /** Text of the copy button and the status messages, for other languages. */
  copyLabel?: string;
  copiedMessage?: string;
  failedMessage?: string;
  className?: string;
};
/** Code panel with a label and a Copy button. The body scrolls sideways and takes keyboard focus. */
export function CodeBlock({ label, code, copyLabel = 'Copy', copiedMessage = 'Copied', failedMessage = 'Copy failed', className }: CodeBlockProps) {
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    clearTimeout(timer.current);
    let message = failedMessage;
    try {
      await navigator.clipboard.writeText(code);
      message = copiedMessage;
    } catch { /* clipboard blocked or not available */ }
    // Empty first, so the same message is announced again on a second click.
    setStatus('');
    timer.current = setTimeout(() => {
      setStatus(message);
      timer.current = setTimeout(() => setStatus(''), 3000);
    }, 100);
  };
  return (
    <figure className={cx('code-block', className)}>
      <div className="code-block-head">
        <span className="code-block-label">{label}</span>
        <Button variant="secondary" size="sm" onClick={copy} aria-label={`${copyLabel} ${label}`}>{copyLabel}</Button>
      </div>
      <pre tabIndex={0} role="region" aria-label={`${label} code`}><code>{code}</code></pre>
      <span className="visually-hidden" role="status">{status}</span>
    </figure>
  );
}
