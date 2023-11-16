import { useState } from 'react';
import { Content } from './Content';
import { SideBar } from './SideBar';

export function Settings() {
  const [currentTab, setCurrentTab] = useState('editProfile');
  return (
    <div className='fixed -top-1 left-0 z-[999999] flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' flex w-3/5  gap-12 rounded-lg bg-white p-8'>
        <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <Content currentTab={currentTab} />
      </div>
    </div>
  );
}
