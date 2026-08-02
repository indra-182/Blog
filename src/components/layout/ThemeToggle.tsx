'use client';

import { IconMoon, IconSun } from '@/components/ui/Icons';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className="nav-icon-button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
    >
      {isDark ? (
        <IconSun size={20} aria-hidden="true" />
      ) : (
        <IconMoon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
