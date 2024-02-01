import { useEffect, useRef } from 'react';

export function Tab({ children }) {
  const parent = useRef(null);

  useEffect(() => {
    const tab = parent.current;
    setTimeout(() => {
      tab.classList.remove('opacity-0');
    }, 200);

    return () => tab.classList.add('opacity-0');
  }, []);
  return (
    <div
      className='flex flex-1  flex-col overflow-auto px-5 pt-16 pb-4 opacity-0 transition-opacity duration-500 sm:px-8 '
      ref={parent}
    >
      {children}
    </div>
  );
}
