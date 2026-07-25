import Link from 'next/link';

const socialLinks = [
  { href: 'https://github.com/indra-182', label: 'GitHub' },
  { href: 'https://twitter.com/vwxmz', label: 'Twitter' },
  { href: 'https://www.linkedin.com/in/mahadiindra182/', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="neo-card mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm font-bold">
        &copy; {new Date().getFullYear()} Indra&apos;s Blog. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase hover:text-(--neo-accent-1) transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
