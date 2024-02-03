import Tippy from '@tippyjs/react';
import {
  PiGear,
  PiMoonStars,
  PiSignOut,
  PiSignOutBold,
  PiSunDim,
  PiTrashLight,
} from 'react-icons/pi';
import { IoChevronDownOutline, IoSyncOutline } from 'react-icons/io5';
import { useDarkMode, useTrash, useUser, useFetchAllElements, useModal } from '../../hooks';
import { DropDown } from '../Common/DropDown';
import Trash from '../Main/Trash/Trash';

export function DropDownProfile({ setIsSettingsOpen, setIsTrashOpen }) {
  return (
    <DropDown
      toggler={<Profile />}
      togglerClassName='flex items-center justify-between gap-8  pr-3'
      options={{ className: 'w-full', shouldCloseOnClick: false }}
    >
      <DropDown.Button onClick={() => setIsSettingsOpen(true)}>
        <PiGear className='text-text-tertiary' />
        <span>Settings</span>
      </DropDown.Button>
      <TrashToggler setIsTrashOpen={setIsTrashOpen} />

      <DropDown.Divider />

      <ThemeToggler />
      <SyncButton />

      <DropDown.Divider />

      <SignOutButton />
    </DropDown>
  );
}

function Profile() {
  const { user } = useUser();

  return (
    <div className='transition-color flex  flex-1 items-center justify-between gap-3 rounded-md p-2 duration-200 hover:bg-background-tertiary'>
      <div className='flex items-center gap-3 '>
        <div
          className='h-8 w-8 rounded-full bg-cover'
          style={{
            backgroundImage: `url('${user?.avatar}')`,
          }}
        ></div>
        <div className='flex flex-col text-start'>
          <span className='flex-1 text-sm font-semibold text-text-primary'>{user?.name}</span>
          <span className='text-xs font-medium text-text-tertiary '>{user?.email}</span>
        </div>
      </div>
      <IoChevronDownOutline className='text-text-secondary' />
    </div>
  );
}

function TrashToggler({ setIsTrashOpen }) {
  const { trashLength } = useTrash();

  return (
    <Tippy
      content={<Trash isOpen={true} />}
      interactive={true}
      placement='right-end'
      trigger='click'
      theme='light'
      offset={[0, 20]}
      arrow={false}
      animation='fade'
      className='shadow-md'
    >
      <div>
        <DropDown.Button onClick={() => setIsTrashOpen((prev) => !prev)}>
          <PiTrashLight className='text-text-tertiary' />
          <span className='flex-1'>Trash</span>
          <span className='text-xs font-semibold text-text-secondary'>{trashLength}</span>
        </DropDown.Button>
      </div>
    </Tippy>
  );
}

function ThemeToggler() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <DropDown.Button onClick={toggleDarkMode} className='relative py-[18px]' id='themeToggler'>
      <div className={isDarkMode ? 'translate-y-9' : 'translate-y-0'}>
        <PiMoonStars size={18} />
        <span>Dark Mode</span>
      </div>
      <div className={isDarkMode ? 'translate-y-0' : 'translate-y-9'}>
        <PiSunDim size={18} />
        <span>Light Mode</span>
      </div>
    </DropDown.Button>
  );
}

function SyncButton() {
  const { handleFetchAllElements, isLoading } = useFetchAllElements();
  return (
    <DropDown.Button onClick={handleFetchAllElements}>
      <IoSyncOutline className={isLoading ? 'animate-spin' : ''} />
      <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
      {/*
       Todo :  Add the last sync time
       */}
    </DropDown.Button>
  );
}

function SignOutButton() {
  const { handleSignOut } = useUser();
  const { openModal: confirmSignOut } = useModal();
  return (
    <DropDown.Button
      className='text-red-500 hover:text-red-500'
      onClick={() =>
        confirmSignOut({
          title: 'Sign Out',
          message: 'Are you sure you want to sign out?',
          onConfirm: handleSignOut,
          showCheckBox: false,
          confirmText: 'Sign Out',
          icon: <PiSignOutBold />,
        })
      }
    >
      <PiSignOut size={22} /> <span>Sign Out</span>
    </DropDown.Button>
  );
}
