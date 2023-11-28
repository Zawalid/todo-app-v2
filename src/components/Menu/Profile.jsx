import { useUser } from '../../hooks';
import { useEffect, useRef, useState } from 'react';

export function Profile({ onOpenSettings }) {
  const { user, handleSignOut } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const actions = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (actions.current && event.target.id !== 'close' && !actions.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actions]);

  return (
    <div className='relative flex flex-1 items-center gap-2'>
      <div
        className='h-6 w-6 rounded-full bg-cover'
        style={{
          backgroundImage: `url('${user?.avatar}')`,
        }}
      ></div>
      <span className='flex-1 text-sm font-semibold text-text-primary '>{user?.name}</span>
      <div className=' relative'>
        <button onClick={() => setIsOpen(!isOpen)}>
          <i
            className={`fa-solid fa-chevron-${
              isOpen ? 'up' : 'down'
            }  cursor-pointer text-xs text-text-tertiary`}
            id='close'
          ></i>
        </button>
        <ul
          className={
            'absolute right-1 top-full z-10 mt-2 w-48 cursor-auto space-y-2 rounded-lg bg-background-primary px-3 py-2 shadow-md ' +
            (isOpen ? 'block' : 'hidden')
          }
          ref={actions}
        >
          <li>
            <span className='border-b pb-2 text-xs font-semibold text-text-tertiary '>
              {user?.email}
            </span>
          </li>
          <li className='transition-opacity  duration-300 hover:opacity-70'>
            <button className='mt-4 flex w-full items-center gap-3 px-2' onClick={onOpenSettings}>
              <i className='fa-solid fa-gear text-sm text-text-tertiary'></i>
              <span className='text-xs   text-text-secondary'>Settings</span>
            </button>
          </li>
          <li className='transition-opacity duration-300 hover:opacity-70'>
            <button className='flex w-full items-center gap-3 px-2' onClick={handleSignOut}>
              <i className='fa-solid fa-sign-out text-sm text-text-error'></i>
              <span className='text-xs  font-medium text-text-error'>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
