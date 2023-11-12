import { useRef, useState } from 'react';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { Search } from './Search';
import { NavLink } from 'react-router-dom';
import { useTrash } from '../../hooks/useTrash';
import { useUserAuth } from '../../hooks/useUserAuth';
import { ConfirmationModal } from '../Common/ConfirmationModal';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menu = useRef(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const { trashLength } = useTrash();
  const { handleSignOut } = useUserAuth();

  return (
    <aside
      className={
        'flex flex-col rounded-l-xl p-4 transition-[width] duration-500  ' +
        (isOpen
          ? 'w-[22%] items-stretch bg-background-secondary '
          : 'w-0 items-center bg-background-primary  ')
      }
      ref={menu}
    >
      {isOpen || (
        <button onClick={() => setIsOpen(true)}>
          <i className='fa-solid fa-bars cursor-pointer text-text-secondary'></i>
        </button>
      )}
      {isOpen && (
        <>
          <div className='flex items-center justify-between pb-3'>
            <h2 className='text-xl font-bold text-text-secondary'>Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-secondary'></i>
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

            <button
              className='mt-3 flex items-center gap-3 px-3'
              onClick={() => setIsSignOutModalOpen(true)}
            >
              <i className='fa-solid fa-sign-out text-text-error'></i>
              <span className='text-sm  text-text-error font-medium'>
                Sign Out
              </span>
            </button>
          </div>
          {isSignOutModalOpen && <ConfirmationModal
            sentence='Are you sure you want to sign out?'
            element='Sign Out'
            confirmText='Sign Out'
            onConfirm={handleSignOut}
            onCancel={() => setIsSignOutModalOpen(false)}
          />}
        </>
      )}
    </aside>
  );
}
