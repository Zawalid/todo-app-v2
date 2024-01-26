import { Tabs } from '../../Common/Tabs';
import { useRef, useState } from 'react';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';
import { useRestoreElement, useLists, useTrash } from '../../../hooks/';
import { toast } from 'sonner';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function Trash() {
  const {
    trash,
    currentTab,
    trashLength,
    handleDeleteFromTrash,
    handleEmptyType,
    handleEmptyTrash,
    setCurrentTab,
    handleRestoreFromTrash,
  } = useTrash();
  const { lists } = useLists();
  const { handleRestoreElement } = useRestoreElement();
  const [currentItem, setCurrentItem] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const whichDelete = useRef(null);

  const onRestore = async (item) => {
    if (currentTab === 'lists') {
      // If a list with the same title already exists, don't restore the list
      const listTitle = JSON.parse(item).title;
      const isListTitleTaken = lists?.some((list) => list.title === listTitle);
      if (isListTitleTaken) {
        toast.error('Failed to restore list . A list with the same title already exists.');
        return;
      }
    }
    await handleRestoreFromTrash(currentTab, JSON.parse(item).id);
    handleRestoreElement(currentTab);
  };

  return (
    <div className='relative flex h-full flex-col overflow-auto '>
      <Tabs
        tabs={['Tasks', 'Lists', 'Tags', 'Sticky Notes']}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <Items
        trash={trash}
        currentTab={currentTab}
        onDelete={(item) => {
          setCurrentItem(item);
          setIsConfirmationModalOpen(true);
          whichDelete.current = 'item';
        }}
        onRestore={onRestore}
        setCurrentItem={setCurrentItem}
      />
      <Footer
        trash={trash}
        currentTab={currentTab}
        trashLength={trashLength}
        onDeleteAll={() => {
          if (trash[currentTab].length === 0) return;
          setIsConfirmationModalOpen(true);
          whichDelete.current = 'type';
        }}
        onEmptyTrash={() => {
          if (trashLength === 0) return;
          setIsConfirmationModalOpen(true);
          whichDelete.current = 'all';
        }}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        sentence={`Are you sure you want to   ${
          whichDelete.current === 'item'
            ? 'delete this ' +
              (currentTab === 'stickyNotes' ? 'sticky notes' : currentTab).slice(
                0,
                currentTab.length - 1,
              ) +
              ' permanently'
            : whichDelete.current === 'type'
            ? 'delete all ' +
              (currentTab === 'stickyNotes' ? 'sticky notes' : currentTab) +
              ' permanently'
            : ' empty trash '
        } ? `}
        confirmText={
          whichDelete.current === 'item' || whichDelete.current === 'type' ? 'Delete' : 'Empty'
        }
        onConfirm={() => {
          if (whichDelete.current === 'item') handleDeleteFromTrash(currentTab, currentItem.id);
          if (whichDelete.current === 'type') handleEmptyType(currentTab);
          if (whichDelete.current === 'all') handleEmptyTrash();
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
        element={whichDelete.current === 'all' ? 'Trash' : 'Permanently'}
        showCheckBox={false}
      />
    </div>
  );
}

function Items({ trash, currentTab, onDelete, onRestore }) {
  const [parent] = useAutoAnimate({ duration: 500 });

  return (
    <ul
      className='flex h-[170px] flex-1 flex-col  gap-2 overflow-auto overflow-x-hidden py-5'
      ref={parent}
    >
      {trash[currentTab]?.length > 0 &&
        trash[currentTab]?.map((item) => (
          <Item
            key={JSON.parse(item).id}
            title={JSON.parse(item).title}
            onDelete={onDelete}
            onRestore={() => onRestore(item)}
          />
        ))}
      {trash[currentTab]?.length === 0 && (
        <div className='grid h-full place-content-center justify-items-center '>
          <img src={trashIcon} alt='trash' className='w-20' />
          <span className='text-center text-sm font-bold text-text-tertiary'>
            No {currentTab === 'stickyNotes' ? 'sticky notes' : currentTab} in trash
          </span>
        </div>
      )}
    </ul>
  );
}

function Footer({ trash, currentTab, trashLength, onDeleteAll, onEmptyTrash }) {
  return (
    <>
      <div className='mt-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t-2 pt-3'>
        <button
          className={
            'min-w-[140px] flex-1 rounded-lg bg-text-error px-4 py-2 text-sm text-white sm:flex-none ' +
            (trash[currentTab]?.length === 0 ? 'cursor-not-allowed opacity-50' : '')
          }
          onClick={onDeleteAll}
        >
          <i className='fa-solid fa-trash-can '></i>
          <span className='ml-2'>Delete All </span>
        </button>
        <button
          className={
            'min-w-[140px] flex-1 rounded-lg bg-text-error px-4 py-2 text-sm text-white sm:flex-none ' +
            (trashLength === 0 ? 'cursor-not-allowed opacity-50' : '')
          }
          onClick={onEmptyTrash}
        >
          <i className='fa-solid fa-ban '></i>
          <span className='ml-2'>Empty Trash</span>
        </button>
      </div>
      <div className='mt-3 flex items-center justify-center gap-2'>
        <i className='fa-solid fa-info-circle text-blue-400'></i>
        <p className='text-[10px] font-medium text-text-tertiary sm:text-xs '>
          Items in the trash will be automatically cleared after 30 days.
        </p>
      </div>
    </>
  );
}
