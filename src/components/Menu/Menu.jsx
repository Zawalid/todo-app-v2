import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHref } from 'react-router-dom';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { SearchInput } from '../Main/Search/SearchInput';
import { DropDownProfile } from './DropDownProfile';
import Settings from '../Settings/Settings';
import Trash from '../Main/Trash/Trash';

export function Menu() {
  const [isOpen, setIsOpen] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const menu = useRef(null);
  const activeTab = useHref();

  useEffect(() => {
    setIsOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, [activeTab]);

  return (
    <>
      <aside
        className={
          'fixed top-0 z-[15] flex h-full w-full flex-col  bg-background-primary transition-menu duration-500  sm:bg-background-secondary lg:relative lg:rounded-xl ' +
          (isOpen
            ? 'left-0 items-stretch p-4 pr-1 sm:w-[300px] '
            : '-left-full items-center p-0 lg:w-0  ')
        }
        ref={menu}
        id='menu'
      >
        {isOpen && (
          <>
            <div className='grid grid-cols-[auto_20px] items-center pr-3'>
              <DropDownProfile
                setIsSettingsOpen={setIsSettingsOpen}
                setIsTrashOpen={setIsTrashOpen}
              />
              <button
                className='icon-button  not-active small'
                onClick={() => setIsOpen(false)}
                id='closeMenu'
              >
                <i className='fa-solid fa-angles-left cursor-pointer'></i>
              </button>
            </div>

            <div className='mb-3 overflow-y-auto overflow-x-hidden pr-3'>
              <SearchInput />
              <MenuTasks />
              <MenuLists />
              <MenuTags />
            </div>
          </>
        )}
      </aside>
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
            className='absolute left-1 top-1/2 h-16 w-[6px] -translate-y-1/2 rounded-lg bg-text-tertiary lg:left-1'
            onClick={() => setIsOpen(true)}
          ></button>,
          document.body,
        )}
    </>
  );
}
