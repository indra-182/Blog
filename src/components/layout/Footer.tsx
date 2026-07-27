import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedinIn } from 'react-icons/fa';

const socialLinks = [
  { href: 'https://github.com/indra-182', icon: FaGithub, label: 'GitHub' },
  { href: 'https://twitter.com/vwxmz', icon: FaXTwitter, label: 'Twitter' },
  {
    href: 'https://www.linkedin.com/in/mahadiindra182/',
    icon: FaLinkedinIn,
    label: 'LinkedIn',
  },
];

export function Footer() {
  return (
    <footer className="magic-footer w-full px-6">
      <div className="mx-auto flex max-w-(--container) flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm">
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
              className="magic-icon-button"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
