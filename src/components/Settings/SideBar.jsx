import { useState } from 'react';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { useUserAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export function SideBar({ currentTab, setCurrentTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleDeleteAccount } = useUserAuth();
  const navigate = useNavigate();

  return (
    <>
      <aside className='relative space-y-3'>
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
        <div className='border-t absolute bottom-0 pt-3 space-y-3'>
          <button className='grid grid-cols-[30px_1fr] justify-items-start items-center  pl-5 '>
            <i className='fa-solid fa-user-check text-text-tertiary'></i>
            <span className='text-sm font-semibold text-text-secondary'>Verify Account</span>
          </button>
          <button className='grid grid-cols-[30px_1fr] justify-items-start items-center  pl-5 ' onClick={() => setIsModalOpen(true)}>
            <i className='fa-solid fa-trash-can  text-text-error'></i>
            <span className='text-sm font-semibold text-text-error'>Delete Account</span>
          </button>
        </div>
      </aside>
      {isModalOpen && (
        <ConfirmationModal
          sentence='Deleting your account will delete all of your data. This action cannot be undone. Are you sure you want to proceed?'
          element='Account'
          confirmText='Delete'
          showCheckBox={false}
          onConfirm={() => {
            setIsModalOpen(false);
            handleDeleteAccount();
            navigate('/sign-in');
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
