import { useEffect, useRef, useState } from 'react';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { Search } from './Search';
import { NavLink, useHref } from 'react-router-dom';
import { useTrash, useUser } from '../../hooks';
import { Profile } from './Profile';
import { Settings } from '../Settings/Settings';
import { createPortal } from 'react-dom';
import { useSwipe } from '../../hooks/useSwipe';

export function Menu() {
  const [isOpen, setIsOpen] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menu = useRef(null);
  const { handleSignOut } = useUser();
  const { trashLength } = useTrash();
  const activeTab = useHref().split('/app/')[1];
  const { onSwipeStart, onSwipeLeft, onSwipeRight } = useSwipe(300);

  useEffect(() => {
    setIsOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, [activeTab]);

  useEffect(() => {
    const body = document.body;
    body.addEventListener('touchstart', onSwipeStart);
    body.addEventListener('touchmove', (e) => onSwipeLeft(e, () => setIsOpen(false)));
    body.addEventListener('touchmove', (e) => onSwipeRight(e, () => setIsOpen(true)));
  }, []);

  return (
    <>
      <aside
        className={
          'fixed top-0 z-[99999] flex h-full w-full  flex-col bg-background-primary transition-[width,opacity,left] duration-500 sm:bg-background-secondary lg:static lg:rounded-xl ' +
          (isOpen
            ? 'left-0 items-stretch p-4 pr-1 sm:w-[300px] '
            : '-left-full items-center p-0 lg:w-0  ')
        }
        ref={menu}
        id='menu'
      >
        {isOpen && (
          <>
            <div className='mb-3 flex items-center justify-between gap-8 pb-3 pr-3'>
              <Profile />
              <button onClick={() => setIsOpen(false)} id='closeMenu'>
                <i className='fa-solid fa-angles-left cursor-pointer text-text-secondary'></i>
              </button>
            </div>
            <div className='mb-3 overflow-y-auto pr-3'>
              <Search />
              <MenuTasks />
              <MenuLists />
              <MenuTags />
            </div>
            <div className='mt-auto space-y-1 pr-2'>
              <NavLink to='trash' className='menu_element  group  pt-3'>
                <i className='fa-solid fa-trash-can text-text-tertiary'></i>
                <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
                  Trash
                </span>
                <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
                  <span className='text-xs font-semibold text-text-secondary'>{trashLength}</span>
                </div>
              </NavLink>
              <button
                className='menu_element w-full justify-items-start'
                onClick={() => setIsSettingsOpen(true)}
              >
                <i className='fa-solid fa-gear  text-text-tertiary'></i>
                <span className='text-sm font-medium text-text-secondary'>Settings</span>
              </button>
              <button className='menu_element w-full justify-items-start' onClick={handleSignOut}>
                <i className='fa-solid fa-sign-out  text-text-error'></i>
                <span className='text-sm font-medium text-text-error'>Sign Out</span>
              </button>
            </div>
            {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
          </>
        )}
      </aside>
      {isOpen ||
        createPortal(
          <button
            className='absolute left-1 top-1/2 z-50 h-16 w-[6px] -translate-y-1/2 rounded-lg bg-text-tertiary lg:left-1'
            onClick={() => setIsOpen(true)}
          ></button>,
          document.body,
        )}
    </>
  );
}
