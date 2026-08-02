'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PiList, PiX } from 'react-icons/pi';
import { SearchBar } from '@/components/search/SearchBar';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/categories', label: 'Kategori' },
  { href: '/tags', label: 'Tag' },
];

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map((link) => {
        const active =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className="nav-link"
            data-active={active}
            aria-current={active ? 'page' : undefined}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-nav sticky inset-block-start-0 z-50">
      <nav
        aria-label="Navigasi utama"
        className="site-nav__inner flex items-center justify-between gap-3"
      >
        <Link href="/" className="site-brand" aria-label="Indra.dev, kembali ke beranda">
          Indra.dev
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavigationLinks />
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          <button
            type="button"
            className="nav-icon-button md:hidden"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <PiX size={22} aria-hidden="true" />
            ) : (
              <PiList size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="mobile-menu md:hidden">
          <div className="mx-auto flex max-w-(--container) flex-col gap-2">
            <NavigationLinks onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
