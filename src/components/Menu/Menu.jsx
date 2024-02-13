import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {  useNavigate } from 'react-router-dom';
import { Lists } from './Lists/Lists';
import { Tags } from './Tags/Tags';
import { Tabs } from './Tabs';
import { SearchInput } from '../Main/Search/SearchInput';
import { DropDownProfile } from './DropDownProfile';
import Settings from '../Settings/Settings';
import Trash from '../Main/Trash/Trash';
import { useDispatch, useSelector } from 'react-redux';
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import CustomTippy from '../Common/CustomTippy';
import { toggleMenu } from '../../app/userSlice';

export function Menu() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const { showInSideBar } = useSelector((state) => state.settings.sidebar);
  const { isMenuOpen } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const menu = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const keyboardShortcuts = (e) => {
      e.ctrlKey && e.key === '/' && dispatch(toggleMenu());
      e.altKey && e.key === 'i' && navigate('/app/inbox');
      e.altKey && e.key === 't' && navigate('/app/today');
      e.altKey && e.key === 'u' && navigate('/app/upcoming');
      e.altKey && e.key === 'c' && navigate('/app/completed');
      e.altKey && e.key === 's' && navigate('/app/sticky-wall');
      e.ctrlKey && e.altKey && e.key === 'n' && navigate('/app/sticky-wall/new');
      e.ctrlKey && e.key === 'ArrowLeft' && navigate('/app/sticky-wall/');
      e.altKey && e.shiftKey && e.key === 'S' && setIsSettingsOpen(true);
      e.altKey && e.shiftKey && e.key === 'T' && setIsTrashOpen(true);

      e.key === 'Escape' && (isTrashOpen ? setIsTrashOpen(false) : setIsSettingsOpen(false));
    };

    document.addEventListener('keydown', keyboardShortcuts);
    return () => document.removeEventListener('keydown', keyboardShortcuts);
  }, [isSettingsOpen, isTrashOpen, isMenuOpen, navigate, dispatch]);

  return (
    <>
      <aside
        className={
          'fixed top-0 z-[15] flex h-full w-full flex-col  bg-background-primary transition-menu duration-500  sm:bg-background-secondary lg:relative lg:rounded-xl ' +
          (isMenuOpen
            ? 'left-0 mr-4 items-stretch p-4 pr-1 sm:w-[320px]'
            : '-left-full items-center p-0 lg:w-0  ')
        }
        ref={menu}
        id='menu'
      >
        {isMenuOpen && (
          <>
            <div className='grid grid-cols-[auto_35px] items-center pr-3'>
              <DropDownProfile
                setIsSettingsOpen={setIsSettingsOpen}
                setIsTrashOpen={setIsTrashOpen}
              />
              <MenuToggler />
            </div>

            <div className='mb-3 overflow-y-auto overflow-x-hidden pr-3'>
              <SearchInput />
              <Tabs />
              {showInSideBar.includes('lists') && <Lists />}
              {showInSideBar.includes('tags') && <Tags />}
            </div>
          </>
        )}
      </aside>
      {createPortal(
        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />,
        document.body,
      )}
      {createPortal(
        <Trash isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />,
        document.body,
      )}
    </>
  );
}

export function MenuToggler() {
  const { isMenuOpen } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <CustomTippy
      content={
        <span className='flex items-center gap-2'>
          {isMenuOpen ? 'Close' : 'Open'} Sidebar
          <code className='shortcut bg-background-tertiary'>
            <kbd>Ctrl</kbd> + <kbd>/</kbd>
          </code>
        </span>
      }
    >
      <button
        className='icon-button not-active'
        onClick={() => dispatch(toggleMenu())}
        id='closeMenu'
      >
        {isMenuOpen ? <BsLayoutSidebarInset /> : <BsLayoutSidebarInsetReverse  />}
      </button>
    </CustomTippy>
  );
}
