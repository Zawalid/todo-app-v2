import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHref } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { Search } from './Search';
import { useDarkMode, useTrash } from '../../hooks';
import { Profile } from './Profile';
import Settings from '../Settings/Settings';
import Trash from '../Main/Trash/Trash';
import { useFetchAllElements } from '../../hooks/useFetchAllElements';

export function Menu() {
  const [isOpen, setIsOpen] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const menu = useRef(null);
  const { trashLength } = useTrash();
  const activeTab = useHref().split('/app/')[1];

  useEffect(() => {
    setIsOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, [activeTab]);

  return (
    <aside
      className={
        'fixed top-0 z-[9999] flex h-full w-full  flex-col bg-background-primary  sm:bg-background-secondary lg:static lg:rounded-xl ' +
        (isOpen
          ? 'left-0 items-stretch p-4 pr-1 sm:w-[300px] '
          : '-left-full items-center p-0 lg:w-0  ')
      }
      ref={menu}
      id='menu'
    >
      {isOpen && (
        <>
          <ProfileAndCloseMenu onClose={() => setIsOpen(false)} />
          <NavigationMenu />
          <UserActionMenu
            {...{
              setIsSettingsOpen,
              isTrashOpen,
              setIsTrashOpen,
              trashLength,
            }}
          />
        </>
      )}

      <MenuToggleAndModals
        {...{ isOpen, setIsOpen, isTrashOpen, setIsTrashOpen, isSettingsOpen, setIsSettingsOpen }}
      />
    </aside>
  );
}

function ProfileAndCloseMenu({ onClose }) {
  return (
    <div className='mb-3 flex items-center justify-between gap-8 pb-3 pr-3'>
      <Profile />
      <button className='icon-button not-active small' onClick={onClose} id='closeMenu'>
        <i className='fa-solid fa-angles-left cursor-pointer'></i>
      </button>
    </div>
  );
}

function NavigationMenu() {
  return (
    <div className='mb-3 overflow-y-auto overflow-x-hidden pr-3'>
      <Search />
      <MenuTasks />
      <MenuLists />
      <MenuTags />
    </div>
  );
}

function UserActionMenu({ setIsSettingsOpen, isTrashOpen, setIsTrashOpen, trashLength }) {
  return (
    <div className='mt-auto space-y-1 pr-2'>
      <Tippy
        content={<Trash />}
        interactive={true}
        placement='right-end'
        trigger='click'
        theme='light'
        offset={[0, 20]}
        arrow={false}
        animation='fade'
      >
        <button
          to='trash'
          className='menu_element  group w-full justify-items-start  pt-3'
          onClick={() => setIsTrashOpen(!isTrashOpen)}
        >
          <i className='fa-solid fa-trash-can text-text-tertiary'></i>
          <span className='text-sm  text-text-secondary  group-hover:font-bold'>Trash</span>
          <div className='count justify-self-stretch'>
            <span className='text-xs font-semibold text-text-secondary'>{trashLength}</span>
          </div>
        </button>
      </Tippy>
      <div className='grid grid-cols-[auto_50px] items-center gap-8  pr-2'>
        <button
          className='menu_element w-full justify-items-start'
          onClick={() => setIsSettingsOpen(true)}
        >
          <i className='fa-solid fa-gear  text-text-tertiary'></i>
          <span className='text-sm font-medium text-text-secondary'>Settings</span>
        </button>
        <div className='flex items-center justify-between'>
          <SyncButton />
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
}

function ThemeToggler() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <button
      className='relative h-5 w-5  justify-self-center text-text-secondary   hover:text-text-tertiary'
      onClick={toggleDarkMode}
    >
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 16 16'
        height='1em'
        width='1em'
        className={`absolute top-0   ${isDarkMode ? 'scale-0' : 'scale-100 '}`}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z'></path>
        <path d='M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z'></path>
      </svg>
      <svg
        stroke='currentColor'
        fill='none'
        strokeWidth='2'
        viewBox='0 0 24 24'
        strokeLinecap='round'
        strokeLinejoin='round'
        height='1.2em'
        width='1.2em'
        className={`absolute top-0   ${isDarkMode ? 'scale-100' : 'scale-0 '}`}
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='12' cy='12' r='4'></circle>
        <path d='M12 2v2'></path>
        <path d='M12 20v2'></path>
        <path d='m4.93 4.93 1.41 1.41'></path>
        <path d='m17.66 17.66 1.41 1.41'></path>
        <path d='M2 12h2'></path>
        <path d='M20 12h2'></path>
        <path d='m6.34 17.66-1.41 1.41'></path>
        <path d='m19.07 4.93-1.41 1.41'></path>
      </svg>
    </button>
  );
}

function SyncButton() {
  const { handleFetchAllElements, isLoading } = useFetchAllElements();

  return (
    <button
      className={`text-text-secondary duration-0 hover:text-text-tertiary ${
        isLoading ? 'animate-spin' : ''
      }`}
      onClick={handleFetchAllElements}
    >
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 16 16'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z'></path>
        <path
          fillRule='evenodd'
          d='M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z'
        ></path>
      </svg>
    </button>
  );
}
function MenuToggleAndModals({
  isOpen,
  setIsOpen,
  isTrashOpen,
  setIsTrashOpen,
  isSettingsOpen,
  setIsSettingsOpen,
}) {
  return (
    <>
      {createPortal(
        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />,
        document.body,
      )}

      {window.matchMedia('(max-width: 768px)').matches &&
        createPortal(
          <Trash isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />,
          document.body,
        )}

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
