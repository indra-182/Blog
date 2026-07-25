import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
]

export function Navbar() {
  return (
    <nav className="neo-card flex items-center justify-between mb-8">
      <Link href="/" className="text-2xl font-black uppercase tracking-tight hover:text-(--neo-accent-1) transition-colors">
        Indra&apos;s Blog
      </Link>
      <div className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-bold uppercase text-sm hover:text-(--neo-accent-1) transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </nav>
  )
}
