'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

export type Theme = 'light' | 'dark';
export type StoredTheme = Theme | 'system';

const STORAGE_KEY = 'theme';
const THEME_CHANGE_EVENT = 'theme-change';

const ThemeContext = createContext<{
  theme: StoredTheme;
  resolvedTheme: Theme;
  setTheme: (theme: StoredTheme) => void;
} | null>(null);

function getStoredTheme(): StoredTheme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribeToTheme(callback: () => void) {
  const notify = () => callback();
  window.addEventListener('storage', notify);
  window.addEventListener(THEME_CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
  };
}

function subscribeToSystemTheme(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function resolveTheme(theme: StoredTheme): Theme {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    () => 'dark' as StoredTheme,
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    () => 'dark' as Theme,
  );
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: StoredTheme) => {
    localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    applyTheme(resolveTheme(nextTheme));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme harus digunakan di dalam ThemeProvider');
  return context;
}
