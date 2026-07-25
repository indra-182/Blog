import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
]

export function Navbar() {
  return (
    <nav className="neo-card flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Indra's Blog" width={100} height={28} className="h-7 w-auto" />
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
