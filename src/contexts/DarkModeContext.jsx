import { createContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

export const DarkModeContext = createContext();

export default function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    'darkMode',
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    [isDarkMode],
  );

  function toggleDarkMode() {
    document.documentElement.classList.add('color-transition');
    setIsDarkMode((isDark) => !isDark);
    setTimeout(() => {
      document.documentElement.classList.remove('color-transition');
    }, 400);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
