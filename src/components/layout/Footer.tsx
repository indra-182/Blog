import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FaLinkedinIn } from 'react-icons/fa'

const socialLinks = [
  { href: 'https://github.com/indra-182', icon: FaGithub, label: 'GitHub' },
  { href: 'https://twitter.com/vwxmz', icon: FaXTwitter, label: 'Twitter' },
  { href: 'https://www.linkedin.com/in/mahadiindra182/', icon: FaLinkedinIn, label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="neo-card mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm font-bold">
        &copy; {new Date().getFullYear()} Indra&apos;s Blog. All rights reserved.
      </p>
      <div className="flex items-center gap-2">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="neo-btn"
            style={{ padding: '8px', background: 'var(--neo-bg)' }}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </footer>
  )
}
