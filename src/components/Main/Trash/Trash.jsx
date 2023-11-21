import { Tabs } from '../../Common/Tabs';
import { useRef, useState } from 'react';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';
import { useTrash } from '../../../hooks/useTrash';
import { useRestoreElement } from '../../../hooks/';

export function Trash() {
  const {
    trash,
    currentTab,
    trashLength,
    handleDeleteFromTrash,
    handleEmptyType,
    handleEmptyTrash,
    handleRestoreFromTrash,
    setCurrentTab,
  } = useTrash();
  const { handleRestoreElement } = useRestoreElement();
  const [currentItem, setCurrentItem] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const whichDelete = useRef(null);

  return (
    <div className='relative flex h-full flex-col overflow-auto '>
      <Tabs
        tabs={['Tasks', 'Lists', 'Tags', 'Sticky Notes']}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <ul className='flex h-[170px] flex-1 flex-col gap-2 overflow-auto py-5'>
        {trash[currentTab]?.length > 0 &&
          trash[currentTab]?.map((item) => (
            <Item
              key={JSON.parse(item).id}
              title={JSON.parse(item).title}
              onDelete={() => {
                setIsConfirmationModalOpen(true);
                setCurrentItem(JSON.parse(item));
                whichDelete.current = 'item';
              }}
              onRestore={async () => {
                await handleRestoreFromTrash(
                  currentTab,
                  JSON.parse(item).id,
                  null,
                  handleRestoreElement,
                );
                handleRestoreElement(currentTab);
              }}
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
      {isConfirmationModalOpen && (
        <ConfirmationModal
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
      )}
      <div className='mt-auto flex items-center justify-between border-t-2 pt-3'>
        <button
          className={
            'rounded-lg bg-text-error px-4 py-2 text-sm text-white ' +
            (trash[currentTab]?.length === 0 ? 'cursor-not-allowed opacity-50' : '')
          }
          onClick={() => {
            if (trash[currentTab].length === 0) return;
            setIsConfirmationModalOpen(true);
            whichDelete.current = 'type';
          }}
        >
          <i className='fa-solid fa-trash-can '></i>
          <span className='ml-2'>Delete All </span>
        </button>
        <button
          className={
            'rounded-lg bg-text-error px-4 py-2 text-sm text-white ' +
            (trashLength === 0 ? 'cursor-not-allowed opacity-50' : '')
          }
          onClick={() => {
            if (trashLength === 0) return;
            setIsConfirmationModalOpen(true);
            whichDelete.current = 'all';
          }}
        >
          <i className='fa-solid fa-trash-can '></i>
          <span className='ml-2'>Empty Trash</span>
        </button>
      </div>
      <div className='mt-2 flex items-center justify-center gap-2'>
        <i className='fa-solid fa-info-circle text-blue-400'></i>
        <p className='text-xs font-medium text-text-tertiary '>
          Items in the trash will be automatically cleared after 30 days.
        </p>
      </div>
    </div>
  );
}
