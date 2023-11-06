import { Tabs } from './Tabs';
import { useMemo, useRef, useState } from 'react';
import { ConfirmationModal } from '../../ConfirmationModal';
import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';
import { useTrash } from '../../../hooks/useTrash';
import { useRestoreElement } from '../../../hooks/useRestoreElement';
export function Trash({ onClose }) {
  const {
    trash,
    handleDeleteFromTrash,
    handleEmptyType,
    handleEmptyTrash,
    handleRestoreFromTrash,
    currentTab,
    setCurrentTab,
  } = useTrash();
  const { handleRestoreElement } = useRestoreElement();

  const [currentItem, setCurrentItem] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const whichDelete = useRef(null);
  const trashLength = useMemo(
    () =>
      Object.keys(trash)
        .map((key) => trash[key].length)
        .reduce((acc, cur) => acc + cur, 0),
    [trash],
  );

  return (
    <div className='fixed left-0 top-0  z-[99]  flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' relative flex h-80 w-1/2 flex-col rounded-lg bg-white p-4'>
        <div className='flex items-center justify-between pb-5'>
          <h2 className='text-xl font-bold text-text-secondary'>
            Trash <span className='text-lg text-text-tertiary'>({trashLength})</span>
          </h2>
          <button
            onClick={() => {
              onClose();
              setCurrentTab('tasks');
            }}
          >
            <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-tertiary'></i>
          </button>
        </div>
        <Tabs />
        <ul className='flex h-[170px] flex-1 flex-col gap-2 overflow-auto py-5'>
          {trash[currentTab].length > 0 &&
            trash[currentTab].map((item) => (
              <Item
                key={JSON.parse(item).id}
                title={JSON.parse(item).title}
                onDelete={() => {
                  setIsConfirmationModalOpen(true);
                  setCurrentItem(JSON.parse(item));
                  whichDelete.current = 'item';
                }}
                onRestore={async () => {
                  await handleRestoreFromTrash(currentTab, JSON.parse(item).id);
                  handleRestoreElement(currentTab);
                }}
              />
            ))}
          {trash[currentTab].length === 0 && (
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
            isTrash={true}
          />
        )}
        <div className='mt-auto flex justify-between border-t-2 pt-3'>
          <button
            className={
              'rounded-lg bg-text-error px-4 py-1 text-sm text-white ' +
              (trash[currentTab].length === 0 ? 'cursor-not-allowed opacity-50' : '')
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
              'rounded-lg bg-text-error px-4 py-1 text-sm text-white ' +
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
      </div>
    </div>
  );
}
