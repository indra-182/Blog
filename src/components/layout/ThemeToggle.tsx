'use client';

import { PiMoon, PiSun } from 'react-icons/pi';
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
        <PiSun size={20} aria-hidden="true" />
      ) : (
        <PiMoon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
