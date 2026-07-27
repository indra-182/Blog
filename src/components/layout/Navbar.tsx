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
    <nav aria-label="Primary" className="site-nav fixed inset-x-0 top-0 z-50">
      <div className="site-nav__inner flex items-center justify-between">
        <Link href="/" className="site-brand">
          Indra.dev
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
}
