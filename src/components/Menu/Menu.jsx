import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHref } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { PiGear, PiMoonStars, PiSunDim, PiTrashLight } from 'react-icons/pi';
import { TfiReload } from "react-icons/tfi";
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { SearchInput } from '../Main/Search/SearchInput';
import { useDarkMode, useTrash } from '../../hooks';
import { Profile } from './Profile';
import Settings from '../Settings/Settings';
import Trash from '../Main/Trash/Trash';
import { useFetchAllElements } from '../../hooks/useFetchAllElements';

export function Menu() {
  const [isOpen, setIsOpen] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const menu = useRef(null);
  const { trashLength } = useTrash();
  const activeTab = useHref();

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
            setIsSettingsOpen={setIsSettingsOpen}
            setIsTrashOpen={setIsTrashOpen}
            trashLength={trashLength}
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
      <SearchInput />
      <MenuTasks />
      <MenuLists />
      <MenuTags />
    </div>
  );
}

function UserActionMenu({ setIsSettingsOpen, setIsTrashOpen, trashLength }) {
  return (
    <div className='mt-auto space-y-1 pr-2'>
      <Tippy
        content={<Trash isOpen={true} />}
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
          onClick={() => setIsTrashOpen((prev) => !prev)}
        >
          <PiTrashLight size={18} className='text-text-tertiary' />
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
          <PiGear className='text-text-tertiary' />
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
      className='relative mt-[2px] h-5  w-5  justify-self-center text-text-secondary  hover:text-text-tertiary'
      onClick={toggleDarkMode}
    >
      <PiMoonStars
      size={18}
        className={`absolute top-0 transition-transform  ${isDarkMode ? 'scale-0' : 'scale-100 '}`}
      />

      <PiSunDim
      size={18}
        className={`absolute top-0  transition-transform ${isDarkMode ? 'scale-100' : 'scale-0 '}`}
      />
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
      <TfiReload size={14} />
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
