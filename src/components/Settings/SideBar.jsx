import { useState } from 'react';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { useUser } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export function SideBar({ currentTab, setCurrentTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { user, handleDeleteAccount, handleSendVerificationEmail } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <button
        className='not-active small absolute right-12 top-4 sm:hidden'
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
        <div className=' bottom-0 mt-auto w-full space-y-4 border-t border-zinc-300 pt-3'>
          {!user?.emailVerification && (
            <button
              className='grid grid-cols-[30px_1fr] items-center justify-items-start'
              onClick={handleSendVerificationEmail}
            >
              <i className='fa-solid fa-user-check text-text-tertiary'></i>
              <span className='text-sm font-semibold text-text-secondary'>Verify Account</span>
            </button>
          )}
          <button
            className='grid w-full grid-cols-[30px_1fr] items-center justify-items-start rounded-lg px-3 py-2 text-text-error transition-colors duration-300 hover:bg-red-500 hover:text-white'
            onClick={() => setIsConfirmationModalOpen(true)}
          >
            <i className='fa-solid fa-trash-can  '></i>
            <span className='text-sm font-semibold'>Delete Account</span>
          </button>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        sentence='Deleting your account will delete all of your data. This action cannot be undone. Are you sure you want to proceed?'
        element='Account'
        confirmText='Delete'
        showCheckBox={false}
        onConfirm={() => {
          setIsConfirmationModalOpen(false);
          handleDeleteAccount();
          navigate('/sign-in');
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </>
  );
}
