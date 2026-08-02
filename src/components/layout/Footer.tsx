import Link from 'next/link';

const links = [
  { href: 'https://github.com/indra-182', label: 'GitHub', external: true },
  { href: 'https://twitter.com/vwxmz', label: 'X', external: true },
  {
    href: 'https://www.linkedin.com/in/mahadiindra182/',
    label: 'LinkedIn',
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t-3 border-(--border)" aria-label="Informasi situs">
      <div className="page-frame flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-(--text-weak)">
          &copy; {new Date().getFullYear()} Indra.dev. Dibuat untuk pembaca yang ingin
          terus membangun.
        </p>
        <nav aria-label="Tautan footer" className="flex flex-wrap items-center gap-2">
          <Link href="/rss.xml" className="neo-tag neo-tag--accent">
            RSS
          </Link>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="neo-tag"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
