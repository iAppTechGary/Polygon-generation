import { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, Theme }             from '../Context/ThemeContext';

interface Props {
  children: ReactNode;
}

/**
 * ThemeProvider
 *
 * Persists the user's theme preference in localStorage and applies the
 * `dark` class to <html> so Tailwind's `dark:` variants activate globally.
 */
export default function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) ?? 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
