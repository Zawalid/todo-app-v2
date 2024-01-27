import { useState } from 'react';
import { useUser } from '../../hooks';

export function SideBar({ currentTab, setCurrentTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, handleSendVerificationEmail } = useUser();

  return (
    <>
      <button
        className='icon-button not-active small absolute right-12 top-4 sm:hidden'
        onClick={() => setIsOpen(!isOpen)}
      >
        <i
          className={`fa-solid fa-chevron-right  text-text-tertiary transition-transform duration-500
          ${isOpen ? 'rotate-180' : ''}
           `}
        ></i>
      </button>
      <aside
        className={`absolute top-0 z-[100] flex h-full flex-col items-start gap-3 bg-zinc-50  p-3 shadow-md transition-[left] duration-500 sm:static  sm:shadow-none ${
          isOpen ? 'left-0' : '-left-full'
        }`}
      >
        <h2 className='mb-2 text-xl font-semibold text-text-secondary'>Settings</h2>
        <button
          className={
            'menu_element w-full justify-start gap-2 ' +
            (currentTab === 'account' ? 'active text-text-secondary' : 'text-text-tertiary')
          }
          onClick={() => setCurrentTab('account')}
        >
          <i className='fa-solid fa-user'></i>
          <span className='font-medium '>Account</span>
        </button>
        <button
          className={
            'menu_element w-full justify-start gap-2 ' +
            (currentTab === 'password' ? 'active text-text-secondary' : 'text-text-tertiary')
          }
          onClick={() => setCurrentTab('password')}
        >
          <i className='fa-solid fa-key'></i>
          <span className='font-medium '>Password</span>
        </button>
        <button
          className={
            'menu_element w-full justify-start gap-2 ' +
            (currentTab === 'sessions' ? 'active text-text-secondary' : 'text-text-tertiary')
          }
          onClick={() => setCurrentTab('sessions')}
        >
          <i className='fa-solid fa-laptop'></i>
          <span className='font-medium '>Sessions</span>
        </button>
        {!user?.emailVerification && (
          <div className='mt-auto'>
            <hr className='mb-2 w-full border-zinc-300' />
            <button
              className='grid w-full grid-cols-[30px_1fr] items-center justify-items-start rounded-md px-3 py-2   transition-colors duration-300 hover:bg-background-tertiary'
              onClick={handleSendVerificationEmail}
            >
              <i className='fa-solid fa-user-check text-text-tertiary'></i>
              <span className='text-sm font-semibold text-text-secondary'>Verify Account</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
