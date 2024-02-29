import { Tabs } from '../../Common/Tabs';
import Modal from '../../Common/Modal';
import { PiX } from 'react-icons/pi';
import { TrashedTasks, TrashedLists, TrashedTags, TrashedStickyNotes } from './Items';
import { useEffect, useState } from 'react';

export default function Trash({ isOpen, onClose }) {
  const [currentTab, setCurrentTab] = useState('tasks');

  useEffect(() => {
    setCurrentTab('tasks');
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='relative h-full w-full gap-5 overflow-auto px-5 py-3 sm:h-[400px] sm:w-[600px] sm:border'
    >
      <div className='flex items-start justify-between gap-5'>
        <Tabs
          tabs={['Tasks', 'Lists', 'Tags', 'Sticky Notes']}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          className='gap-5 sm:gap-8'
        />
        <div className='flex gap-2'>
          <button className='icon-button not-active small' onClick={onClose}>
            <PiX />
          </button>
        </div>
      </div>
      {
        {
          tasks: <TrashedTasks isOpen={isOpen} />,
          lists: <TrashedLists />,
          tags: <TrashedTags />,
          stickyNotes: <TrashedStickyNotes />,
        }[currentTab]
      }
    </Modal>
  );
}
