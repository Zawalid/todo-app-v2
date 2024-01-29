import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';
import Modal from '../Common/Modal';

export default function Settings({ isOpen, onClose }) {
  const [currentTab, setCurrentTab] = useState('account');

  return (
    <Modal
      isOpen={isOpen}
      className={`flex h-full w-full flex-col overflow-hidden sm:flex-row  md:h-[90%]  md:w-5/6 md:border md:border-border lg:w-3/4
      ${window.innerWidth > 768 ? 'relative' : 'fixed left-0 top-0 z-[9999]'}
      `}
    >
      <button className='icon-button not-active small absolute right-4 top-4' onClick={onClose}>
        <i className='fa-solid fa-xmark text-lg text-text-tertiary'></i>
      </button>
      <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <Content currentTab={currentTab} />
    </Modal>
  );
}
