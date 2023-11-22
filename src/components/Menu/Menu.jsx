import { useRef, useState } from 'react';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { Search } from './Search';
import { NavLink } from 'react-router-dom';
import { useTrash } from '../../hooks';
import { Profile } from './Profile';
import { Settings } from '../Settings/Settings';

export function Menu() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menu = useRef(null);
  const { trashLength } = useTrash();

  return (
    <aside
      className={
        'flex flex-col rounded-l-xl p-4 transition-[width_opacity] duration-500  ' +
        (isOpen
          ? 'w-[22%] items-stretch bg-background-secondary '
          : 'w-0 items-center bg-background-primary  ')
      }
      ref={menu}
      id='menu'
    >
      {isOpen || (
        <button onClick={() => setIsOpen(true)}>
          <i className='fa-solid fa-angles-right cursor-pointer text-text-secondary'></i>
        </button>
      )}
      {isOpen && (
        <>
          <div className='mb-3 flex items-center justify-between gap-8 pb-3'>
            <Profile onOpenSettings={() => setIsSettingsOpen(true)} />
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
          <div className='mt-auto'>
            <NavLink to='trash' className='menu_element  group  pt-3'>
              <i className='fa-solid fa-trash-can text-text-tertiary'></i>
              <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
                Trash
              </span>
              <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
                <span className='text-xs font-semibold text-text-secondary'>{trashLength}</span>
              </div>
            </NavLink>
          </div>
          {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
        </>
      )}
    </aside>
  );
}
