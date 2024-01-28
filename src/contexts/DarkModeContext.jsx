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
    setIsDarkMode((isDark) => !isDark);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
