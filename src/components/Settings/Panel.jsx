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
} from 'react-icons/pi';
import { Overlay } from '../Common/Modal';

export function Panel({ isOpen, onClose, currentTab, setCurrentTab }) {
  const { user, handleSignOut, handleSendVerificationEmail } = useUser();

  return (
    <div>
      <Overlay isOpen={isOpen} onClose={onClose} />
      <aside
        className={`absolute top-0 z-[99999] flex h-full w-[200px] sm:pt-[45px] flex-col items-start gap-3 border-r  border-border bg-background-secondary  p-3 shadow-md sm:static sm:shadow-none ${
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
            onClick={handleSignOut}
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