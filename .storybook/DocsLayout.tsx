import type { AnchorHTMLAttributes, ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

/** Links in MDX docs: external ones open in a new tab, Storybook links navigate the whole app. */
export function DocsLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const attrs = isExternal(href)
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : href?.startsWith('?') || href?.startsWith('/')
      ? { target: '_top' }
      : {};
  return <a href={href} {...attrs} {...props} />;
}

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Footer on every docs page, same content as on bereg.dev. */
function DocsFooter() {
  return (
    <footer className="site-footer sb-unstyled" style={{ marginTop: 'var(--space-16)' }}>
      <div className="wrap" style={{ paddingInline: 0 }}>
        <span>© {new Date().getFullYear()} Konstantin Beregovoy</span>
        <span>
          <a href="https://bereg.dev" {...external}>bereg.dev</a> ·{' '}
          <a href="https://www.linkedin.com/in/konstantin-beregovoy/" {...external} rel="me noopener noreferrer">LinkedIn</a> ·{' '}
          <a href="https://github.com/KonstantinBeregovoy/bereg-ds" {...external}>GitHub</a> ·{' '}
          <a href="https://www.npmjs.com/package/bereg-ds" {...external}>npm</a>
        </span>
      </div>
    </footer>
  );
}

export function DocsLayout({ children, ...props }: ComponentProps<typeof DocsContainer>) {
  return (
    <DocsContainer {...props}>
      {children}
      <DocsFooter />
    </DocsContainer>
  );
}
