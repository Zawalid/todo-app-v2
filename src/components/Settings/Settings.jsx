import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';

export function Settings({ isOpen, onClose }) {
  const [currentTab, setCurrentTab] = useState('account');

  return (
    <div
      className={`fixed left-0 top-0  flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px] ${
        isOpen ? 'z-[9999] opacity-100' : '-z-10 opacity-0'
      } `}
    >
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-lg  bg-background-primary transition-transform duration-500  sm:flex-row md:h-[90%] md:w-3/4 
        ${isOpen ? 'scale-100' : 'scale-0'}`}
      >
        <button className='icon-button not-active small absolute right-4 top-4' onClick={onClose}>
          <i className='fa-solid fa-xmark text-lg text-text-tertiary'></i>
        </button>
        <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <Content currentTab={currentTab} />
      </div>
    </div>
  );
}

