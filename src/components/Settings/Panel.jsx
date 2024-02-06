import { cloneElement } from 'react';
import { PiSidebar, PiGear, PiDevices, PiLockKey, PiPalette, PiUserCircle } from 'react-icons/pi';
import { Overlay } from '../Common/Modal';
import { BiReset } from 'react-icons/bi';
import { Button } from '../Common/Button';
import { useDispatch } from 'react-redux';
import { resetSettings } from '../../app/settingsSlice';
import { useModal } from '../../hooks';

export function Panel({ isOpen, onClose, currentTab, setCurrentTab }) {
  const dispatch = useDispatch();
  const { openModal: confirmReset } = useModal();

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
        <Button
          type='outline-delete'
          size='small'
          className='mt-auto flex w-full items-center gap-3'
          onClick={() =>
            confirmReset({
              title: 'Reset Settings',
              message: 'Are you sure you want to reset all settings to default?',
              onConfirm: () => dispatch(resetSettings()),
              confirmText: 'Reset',
              showCheckbox: false,
            })
          }
        >
          <BiReset size={20} />
          <span className='font-medium'>Reset Settings</span>
        </Button>
      </div>
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
