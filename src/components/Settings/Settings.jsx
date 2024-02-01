import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';
import Modal from '../Common/Modal';
import { PiArrowRight, PiX } from 'react-icons/pi';

export default function Settings({ isOpen, onClose }) {
  const [currentTab, setCurrentTab] = useState('general');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`flex h-full w-full flex-col overflow-hidden sm:flex-row  md:h-[90%]  md:w-5/6 md:border md:border-border lg:w-3/4
      ${window.innerWidth > 768 ? 'relative' : 'fixed left-0 top-0 z-[9999]'}
      `}
    >
      <div className='absolute left-0 z-10 flex w-full justify-between border-b border-border bg-background-primary px-5 py-2 sm:left-[200px] sm:w-[calc(100%-200px)]'>
        <h3 className='text-lg font-bold capitalize text-text-primary sm:text-xl'>{currentTab}</h3>
        <div className='flex gap-2'>
          <button
            className='icon-button not-active small  sm:hidden'
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
            <PiArrowRight className={isSideBarOpen ? 'rotate-180' : ''} />
          </button>
          <button className='icon-button not-active small  text-text-tertiary' onClick={onClose}>
            <PiX />
          </button>
        </div>
      </div>
      <SideBar
        isOpen={isSideBarOpen}
        onClose={() => setIsSideBarOpen(false)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <Content currentTab={currentTab} />
    </Modal>
  );
}
