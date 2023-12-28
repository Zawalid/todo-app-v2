import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';

export function Settings({ onClose }) {
  const [currentTab, setCurrentTab] = useState('editProfile');

  return (
    <div className='fixed top-0 left-0 z-[999999] flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className='relative flex h-full w-full flex-col gap-12 overflow-hidden rounded-lg bg-background-primary px-5 sm:px-8 py-4 sm:py-6 sm:flex-row md:h-[90%] md:w-3/5'>
        <button
          className='absolute right-4 top-4 h-7 w-7 rounded-full bg-background-secondary transition-colors duration-300 hover:bg-background-tertiary'
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
