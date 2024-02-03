import { cloneElement } from 'react';
import { PiSidebar, PiGear, PiDevices, PiLockKey, PiPalette, PiUserCircle } from 'react-icons/pi';
import { useUser } from '../../hooks';
import { Overlay } from '../Common/Modal';

export function Panel({ isOpen, onClose, currentTab, setCurrentTab }) {
  const { user, handleSendVerificationEmail } = useUser();

  return (
    <>
      <Overlay isOpen={isOpen} onClose={onClose} />
      <div
        className={`absolute top-0 z-40 flex h-full w-[200px] flex-col items-start gap-3 border-r border-border bg-background-secondary p-3  shadow-md transition-[left]  duration-500 sm:static sm:pt-[45px] sm:shadow-none ${
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
      </div>
      {!user?.emailVerification && (
        <div
          className='absolute left-0 top-0 flex w-full items-center justify-between bg-red-500 px-5 py-2 md:py-3 sm:left-[200px] sm:w-[calc(100%-200px)]
        '
        >
          <p className='text-sm text-white'>
            Your account is not verified. Please check your email and verify your account.
          </p>
          <button
            className='text-sm text-white underline underline-offset-2 hover:text-gray-200'
            onClick={handleSendVerificationEmail}
          >
            Resend
          </button>
        </div>
      )}
    </>
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
