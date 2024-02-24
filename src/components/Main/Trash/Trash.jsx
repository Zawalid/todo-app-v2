import { Tabs } from '../../Common/Tabs';
import { Actions } from './Actions';
import Modal from '../../Common/Modal';
import { PiX } from 'react-icons/pi';
import { TrashedTasks, TrashedLists, TrashedTags, TrashedStickyNotes } from './Items';
import { useState } from 'react';

export default function Trash({ isOpen, onClose }) {
  const [currentTab, setCurrentTab] = useState('tasks');

  // const onRestore = async (item) => {
  //   if (currentTab === 'lists') {
  //     // If a list with the same title already exists, don't restore the list
  //     const listTitle = JSON.parse(item).title;
  //     const isListTitleTaken = lists?.some((list) => list.title === listTitle);
  //     if (isListTitleTaken) {
  //       toast.error('Failed to restore list . A list with the same title already exists.');
  //       return;
  //     }
  //   }
  //   // await handleRestoreFromTrash(currentTab, JSON.parse(item).id);
  //   // handleRestoreElement(currentTab);
  // };

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
          <Actions />
          <button className='icon-button not-active small' onClick={onClose}>
            <PiX />
          </button>
        </div>
      </div>
      {
        {
          tasks: <TrashedTasks />,
          lists: <TrashedLists />,
          tags: <TrashedTags />,
          stickyNotes: <TrashedStickyNotes />,
        }[currentTab]
      }
    </Modal>
  );
}
