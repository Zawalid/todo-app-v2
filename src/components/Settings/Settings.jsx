import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';

export function Settings({ onClose }) {
  const [currentTab, setCurrentTab] = useState('account');

  return (
    <div className='fixed left-0 top-0 z-[999999] flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className='relative flex h-full w-full flex-col  overflow-hidden rounded-lg bg-background-primary  sm:flex-row md:h-[90%] md:w-3/4'>
        <button
          className='absolute right-4 top-4 h-7 w-7 rounded-full  transition-colors duration-300 hover:bg-background-tertiary'
          onClick={onClose}
        >
          <i className='fa-solid fa-xmark text-lg text-text-tertiary'></i>
        </button>
        <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <Content currentTab={currentTab} />
      </div>
    </div>
  );
}
