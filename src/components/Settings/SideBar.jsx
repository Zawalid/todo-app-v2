import { useState } from 'react';
import { ConfirmationModal } from '../Common/ConfirmationModal';

export function SideBar({ currentTab, setCurrentTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <aside className='space-y-3'>
        <button
          className={
            'menu_element gap-2 ' +
            (currentTab === 'editProfile' ? 'active text-text-secondary' : 'text-text-tertiary')
          }
          onClick={() => setCurrentTab('editProfile')}
        >
          <i className='fa-solid fa-user'></i>
          <span className='font-medium'>Edit Profile</span>
        </button>
        <button
          className={
            'menu_element gap-2 ' +
            (currentTab === 'password' ? 'active text-text-secondary' : 'text-text-tertiary')
          }
          onClick={() => setCurrentTab('password')}
        >
          <i className='fa-solid fa-lock'></i>
          <span className='font-medium'>Password</span>
        </button>
        <button
          className={
            'menu_element gap-2 ' +
            (currentTab === 'sessions' ? 'active text-text-secondary' : 'text-text-tertiary')
          }
          onClick={() => setCurrentTab('sessions')}
        >
          <i className='fa-solid fa-right-to-bracket'></i>
          <span className='font-medium'>Sessions</span>
        </button>
        <button
          className='mt-3 flex items-center gap-3 border-t pl-5 pt-3'
          onClick={() => setIsModalOpen(true)}
        >
          <i className='fa-solid fa-trash-can  text-text-error'></i>
          <span className='text-sn font-medium text-text-error'>Delete Account</span>
        </button>
      </aside>
      {isModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to delete your account?'
          element='Account'
          confirmText='Delete'
          showCheckBox={false}
          onConfirm={() => console.log('delete')}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}


