import { useState } from 'react';
import { useUser } from '../../hooks';

export function SideBar({ currentTab, setCurrentTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, handleSignOut, handleSendVerificationEmail } = useUser();

  return (
    <>
      <button
        className='icon-button not-active small absolute right-12 top-4 sm:hidden'
        onClick={() => setIsOpen(!isOpen)}
      >
        <i
          className={`fa-solid fa-chevron-right  text-text-tertiary  
          ${isOpen ? 'rotate-180' : ''}
           `}
        ></i>
      </button>
      <aside
        className={`absolute top-0 w-[200px] z-[100] flex h-full flex-col items-start gap-3 bg-background-secondary  p-3 shadow-md  sm:static border-r border-border sm:shadow-none ${
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
        <div className='mt-auto w-full border-t border-border pt-2'>
          <button
            className='grid w-full grid-cols-[30px_1fr] items-center justify-items-start rounded-md px-3 py-2    hover:bg-background-tertiary'
            onClick={handleSignOut}
          >
            <i className='fa-solid fa-sign-out  text-red-500'></i>
            <span className='text-sm font-semibold text-red-500'>Sign Out</span>
          </button>
          {!user?.emailVerification && (
            <button
              className='grid w-full grid-cols-[30px_1fr] items-center justify-items-start rounded-md px-3 py-2    hover:bg-background-tertiary'
              onClick={handleSendVerificationEmail}
            >
              <i className='fa-solid fa-user-check text-text-tertiary'></i>
              <span className='text-sm font-semibold text-text-secondary'>Verify Account</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
