import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';

function SettingsWrapper({ isOpen, onClose }) {
  return window.innerWidth > 768 ? (
    <Overlay isOpen={isOpen}>
      <Settings isOpen={isOpen} onClose={onClose} />
    </Overlay>
  ) : (
    <Settings isOpen={isOpen} onClose={onClose} isMobile={true} />
  );
}

function Overlay({ children, isOpen }) {
  return (
    <div
      className={`fixed z-[9999] left-0 top-0  flex h-full w-full items-center justify-center bg-black/25 backdrop-blur-[1px] ${
        isOpen ? 'visible' : 'invisible'
      } `}
    >
      {children}
    </div>
  );
}
function Settings({ isOpen, onClose, isMobile }) {
  const [currentTab, setCurrentTab] = useState('account');

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg bg-background-primary sm:flex-row  md:h-[90%]  md:w-5/6 lg:w-3/4 md:border md:border-border 
${isOpen ? 'scale-100' : 'scale-0'} ${isMobile ? 'fixed left-0 top-0 z-[9999]' : 'relative'}
`}
    >
      <button className='icon-button not-active small absolute right-4 top-4' onClick={onClose}>
        <i className='fa-solid fa-xmark text-lg text-text-tertiary'></i>
      </button>
      <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <Content currentTab={currentTab} />
    </div>
  );
}

export { SettingsWrapper as Settings };
