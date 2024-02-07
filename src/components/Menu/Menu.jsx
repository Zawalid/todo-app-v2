import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHref, useNavigate } from 'react-router-dom';
import { Lists } from './Lists/Lists';
import { Tags } from './Tags/Tags';
import { Tabs } from './Tabs';
import { SearchInput } from '../Main/Search/SearchInput';
import { DropDownProfile, IconThemeToggler } from './DropDownProfile';
import Settings from '../Settings/Settings';
import Trash from '../Main/Trash/Trash';
import { useSelector } from 'react-redux';
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import CustomTippy from '../Common/CustomTippy';

export function Menu() {
  const [isOpen, setIsOpen] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const { showInSideBar } = useSelector((state) => state.settings.sidebar);
  const menu = useRef(null);
  const activeTab = useHref();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, [activeTab]);

  useEffect(() => {
    const keyboardShortcuts = (e) => {
      e.ctrlKey && e.key === '/' && setIsOpen(!isOpen);
      e.altKey && e.key === 'i' && navigate('/app/inbox');
      e.altKey && e.key === 't' && navigate('/app/today');
      e.altKey && e.key === 'u' && navigate('/app/upcoming');
      e.altKey && e.key === 'c' && navigate('/app/completed');
      e.altKey && e.key === 's' && navigate('/app/sticky-wall');
      e.ctrlKey && e.altKey && e.key === 'n' && navigate('/app/sticky-wall/new');
      e.altKey && e.shiftKey && e.key === 'S' && setIsSettingsOpen(true);
      e.altKey && e.shiftKey && e.key === 'T' && setIsTrashOpen(true);

      e.key === 'Escape' && (isTrashOpen ? setIsTrashOpen(false) : setIsSettingsOpen(false));
    };

    document.addEventListener('keydown', keyboardShortcuts);
    return () => document.removeEventListener('keydown', keyboardShortcuts);
  }, [isSettingsOpen, isTrashOpen, isOpen, navigate]);

  return (
    <>
      <aside
        className={
          'fixed top-0 z-[15] flex h-full w-full flex-col  bg-background-primary transition-menu duration-500  sm:bg-background-secondary lg:relative lg:rounded-xl ' +
          (isOpen
            ? 'left-0 mr-4 items-stretch p-4 pr-1 sm:w-[320px]'
            : '-left-full items-center p-0 lg:w-0  ')
        }
        ref={menu}
        id='menu'
      >
        {isOpen && (
          <>
            <div className='grid grid-cols-[auto_35px] items-center pr-3'>
              <DropDownProfile
                setIsSettingsOpen={setIsSettingsOpen}
                setIsTrashOpen={setIsTrashOpen}
              />
              <CustomTippy
                content={
                  <span className='flex items-center gap-2'>
                    Close Sidebar
                    <code className='shortcut bg-background-tertiary'>
                      <kbd>Ctrl</kbd> + <kbd>/</kbd>
                    </code>
                  </span>
                }
              >
                <button
                  className='icon-button not-active'
                  onClick={() => setIsOpen(false)}
                  id='closeMenu'
                >
                  <BsLayoutSidebarInset />
                </button>
              </CustomTippy>
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
      {isOpen ||
        createPortal(
          <CustomTippy
            content={
              <span className='flex items-center gap-2'>
                Open Sidebar
                <code className='shortcut bg-background-tertiary'>
                  <kbd>Ctrl</kbd> + <kbd>/</kbd>
                </code>
              </span>
            }
          >
            <button className='icon-button  not-active' onClick={() => setIsOpen(true)}>
              <BsLayoutSidebarInsetReverse />
            </button>
          </CustomTippy>,
          (activeTab.match(/\/app\/sticky-wall\/(.+)/)
            ? document.querySelector('#actionBar > div')
            : document.querySelector('#title > div')) || document.body,
        )}
      {isOpen ||
        createPortal(
          <IconThemeToggler />,
          document.querySelector('#actionBar .themeToggler') || document.body,
        )}
    </>
  );
}
