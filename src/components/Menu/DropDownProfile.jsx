import {
  PiGear,
  PiMoonStars,
  PiSignOut,
  PiSignOutBold,
  PiSunDim,
  PiTrashLight,
} from 'react-icons/pi';
import { IoChevronDownOutline, IoSyncOutline } from 'react-icons/io5';
import { useUser } from '../../hooks/useUser';
import { useModal } from '../../hooks/useModal';
import { DropDown } from '../Common/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { changeThemeMode } from '../../app/settingsSlice';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

export function DropDownProfile({ setIsSettingsOpen, setIsTrashOpen }) {
  return (
    <DropDown
      toggler={<Profile />}
      togglerClassName='flex items-center justify-between gap-8 pr-3'
      options={{ className: 'w-full', shouldCloseOnClick: false }}
    >
      <DropDown.Button onClick={() => setIsSettingsOpen(true)}>
        <PiGear className='text-text-tertiary' />
        <span>Settings</span>
        <code className='shortcut'>
          <kbd>Alt</kbd> + <kbd>⇧ </kbd> + <kbd>S</kbd>
        </code>
      </DropDown.Button>

      <DropDown.Button onClick={() => setIsTrashOpen((prev) => !prev)}>
        <PiTrashLight className='text-text-tertiary' />
        <span>Trash</span>
        <code className='shortcut'>
          <kbd>Alt</kbd> + <kbd>⇧ </kbd> + <kbd>T</kbd>
        </code>
      </DropDown.Button>
      <DropDown.Divider />

      <ThemeToggler />
      <SyncButton />

      <DropDown.Divider />

      <SignOutButton />
    </DropDown>
  );
}

function Profile() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className='transition-color flex flex-1 items-center justify-between gap-3 rounded-md px-1.5 py-1 duration-200 hover:bg-background-tertiary'>
      <div className='flex items-center gap-3 '>
        <div
          className='h-8 w-8 rounded-full bg-cover'
          style={{
            backgroundImage: `url('${user?.avatar}')`,
          }}
        ></div>
        <div className='flex flex-col text-start'>
          <span className='text-sm font-semibold text-text-primary'>{user?.name}</span>
          <span className='text-xs font-medium text-text-tertiary '>{user?.email}</span>
        </div>
      </div>
      <IoChevronDownOutline className='text-text-secondary' />
    </div>
  );
}

function ThemeToggler() {
  const { themeMode } = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();

  return (
    <DropDown.Button
      onClick={() => dispatch(changeThemeMode(themeMode === 'dark' ? 'light' : 'dark'))}
      className='relative py-[18px]'
      id='themeToggler'
    >
      <div className={themeMode === 'dark' ? 'translate-y-9' : 'translate-y-0'}>
        <PiMoonStars size={18} />
        <span>Dark Mode</span>
      </div>
      <div className={themeMode === 'light' ? 'translate-y-9' : 'translate-y-0'}>
        <PiSunDim size={18} />
        <span>Light Mode</span>
      </div>
    </DropDown.Button>
  );
}

function SyncButton() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  return (
    <DropDown.Button onClick={() => queryClient.invalidateQueries()}>
      <IoSyncOutline className={isFetching ? 'animate-spin' : ''} />
      <span>{isFetching ? 'Syncing...' : 'Sync'}</span>
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
          showCheckbox: false,
          confirmText: 'Sign Out',
          icon: <PiSignOutBold />,
        })
      }
    >
      <PiSignOut size={22} /> <span>Sign Out</span>
    </DropDown.Button>
  );
}

export function IconThemeToggler() {
  const { themeMode } = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => dispatch(changeThemeMode(themeMode === 'dark' ? 'light' : 'dark'))}
      className='icon-button not-active'
    >
      {themeMode === 'dark' ? <PiSunDim size={20} /> : <PiMoonStars size={20} />}
    </button>
  );
}
