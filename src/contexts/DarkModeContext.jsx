import { createContext, useCallback, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useSelector } from 'react-redux';

export const DarkModeContext = createContext();

export default function DarkModeProvider({ children }) {
  const [theme, setTheme] = useLocalStorageState(
    'theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );

  const { primaryTheme, autoDarkMode } = useSelector((state) => state.settings.theme);

  const toggleDarkMode = useCallback(
    (theme) => {
      // This is used to add a color transition to all elements to avoid flickering
      document.documentElement.classList.add('color-transition');
      document.documentElement.setAttribute('data-theme', theme);
      setTheme(theme);
      setTimeout(() => {
        document.documentElement.classList.remove('color-transition');
      }, 400);
    },
    [setTheme],
  );

  useEffect(() => {
    toggleDarkMode(theme);
  }, [theme, toggleDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-primary', primaryTheme);
  }, [primaryTheme]);

  useEffect(() => {
    if (!autoDarkMode) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.onchange = (e) => (e.matches ? toggleDarkMode('dark') : toggleDarkMode('light'));

    return () => (media.onchange = null);
  }, [autoDarkMode, toggleDarkMode]);

  return (
    <DarkModeContext.Provider value={{ theme, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
