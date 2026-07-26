'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
];

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 py-4"
      style={{
        background: 'var(--neo-bg)',
        borderBottom: '3px solid var(--neo-border)',
        boxShadow: '0 3px 0px 0px var(--neo-border)',
      }}
    >
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-black uppercase tracking-tight"
          style={{ color: 'var(--neo-text)' }}
        >
          Indra.dev
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors text-(--neo-text) hover:bg-black hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
}
