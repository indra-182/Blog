'use client';

import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-10 w-10" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      className="magic-icon-button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <LuSun size={18} /> : <LuMoon size={18} />}
    </button>
  );
}
