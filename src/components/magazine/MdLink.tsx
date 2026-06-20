import Link from "next/link";
import { isUrlPublished, normalizeUrl } from "@/lib/magazine";

/**
 * Renderer for `<a>` inside article markdown. Internal links auto-activate:
 *  - target live now  -> real <Link>
 *  - target not yet live -> plain <span> (no dead link, no 404). The next nightly
 *    rebuild turns it into a link automatically once the target publishes.
 * External links open safely in a new tab.
 */
export default function MdLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  if (!href) return <>{children}</>;

  // anchors / mailto / tel
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return <a href={href}>{children}</a>;
  }

  // external
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  // internal
  const url = normalizeUrl(href);
  if (isUrlPublished(url)) {
    return (
      <Link href={url} className="text-accent-red underline-offset-4 hover:underline">
        {children}
      </Link>
    );
  }
  // dormant target — keep the words, drop the link
  return <span>{children}</span>;
}
