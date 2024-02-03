import { cloneElement } from 'react';
import { useUser } from '../../hooks';
import {
  PiSidebar,
  PiGear,
  PiDevices,
  PiLockKey,
  PiPalette,
  PiUserCircle,
  PiSignOut,
  PiSignOutBold,
} from 'react-icons/pi';
import { Overlay } from '../Common/Modal';
import { useModal } from '../../hooks/useModal';

export function Panel({ isOpen, onClose, currentTab, setCurrentTab }) {
  const { user, handleSignOut, handleSendVerificationEmail } = useUser();
  const {openModal : confirmSignOut} = useModal()

  return (
    <div>
      <Overlay isOpen={isOpen} onClose={onClose} />
      <aside
        className={`absolute top-0 flex h-full z-40 transition-[left] duration-500 w-[200px] sm:pt-[45px] flex-col items-start gap-3 border-r  border-border bg-background-secondary  p-3 shadow-md sm:static sm:shadow-none ${
          isOpen ? 'left-0' : '-left-full'
        }`}
      >
        <Tab
          tabName='account'
          icon={<PiUserCircle />}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          tabName='password'
          icon={<PiLockKey />}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          tabName='sessions'
          icon={<PiDevices />}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          tabName='general'
          icon={<PiGear />}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          tabName='theme'
          icon={<PiPalette />}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <Tab
          tabName='sidebar'
          icon={<PiSidebar />}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <div className='mt-auto w-full border-t border-border pt-2'>
          <button
            className='grid w-full grid-cols-[30px_1fr] items-center justify-items-start rounded-md px-3 py-2 text-red-500 hover:bg-background-tertiary'
            onClick={() => confirmSignOut({
              title : 'Sign Out',
              message : 'Are you sure you want to sign out?',
              onConfirm : handleSignOut,
              showCheckBox : false,
              confirmText : 'Sign Out',
              icon : <PiSignOutBold />
            })}
          >
            <PiSignOut size={22} /> <span className='text-sm font-semibold '>Sign Out</span>
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
    </div>
  );
}

function Tab({ tabName, icon, currentTab, setCurrentTab }) {
  return (
    <button
      className={
        'menu_element w-full justify-start gap-2 ' +
        (currentTab === tabName ? 'active text-text-secondary' : 'text-text-tertiary')
      }
      onClick={() => setCurrentTab(tabName)}
    >
      {cloneElement(icon, { size: '22' })}
      <span className='font-medium capitalize'>{tabName}</span>
    </button>
  );
}
