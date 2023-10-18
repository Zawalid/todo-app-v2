import { Tabs } from './Tabs';
import { useRef, useState } from 'react';
import { ConfirmationModal } from '../../ConfirmationModal';
import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';

export function Trash({
  trash,
  onDelete,
  onEmptyTypeFromTrash,
  onEmptyTrash,
  onRestoreFromTrash,
  onClose,
}) {
  const [currentTab, setCurrentTab] = useState('tasks');
  const [currentItemId, setCurrentItemId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const whichDelete = useRef(null);
  return (
    <div className='fixed left-0 top-0  z-[99]  flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' flex h-80 w-1/2 flex-col rounded-lg bg-white p-4'>
        <div className='flex items-center justify-between pb-5'>
          <h2 className='text-xl font-bold text-text-secondary'>Trash</h2>
          <button
            onClick={() => {
              onClose();
              setCurrentTab('tasks');
            }}
          >
            <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-tertiary'></i>
          </button>
        </div>
        <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <ul className='flex h-[170px] flex-1 flex-col gap-2 overflow-auto py-5'>
          {trash[currentTab].length > 0 &&
            trash[currentTab].map((item) => (
              <Item
                key={item.id}
                title={item.title}
                onDelete={() => {
                  setIsConfirmationModalOpen(true);
                  setCurrentItemId(item.id);
                  whichDelete.current = 'item';
                }}
                onRestore={() => onRestoreFromTrash(item.id, item.index, currentTab)}
              />
            ))}
          {trash[currentTab].length === 0 && (
            <div className='grid h-full place-content-center justify-items-center '>
              <img src={trashIcon} alt='trash' className='w-20' />
              <span className='text-center text-sm font-bold text-text-tertiary'>
                No {currentTab} in trash
              </span>
            </div>
          )}
        </ul>
        {isConfirmationModalOpen && (
          <ConfirmationModal
            sentence={`Are you sure you want to   ${
              whichDelete.current === 'item'
                ? 'delete this ' + currentTab.slice(0, currentTab.length - 1) + ' permanently'
                : whichDelete.current === 'type'
                ? 'delete all ' + currentTab + ' permanently'
                : ' empty trash '
            } ? `}
            confirmText={
              whichDelete.current === 'item'
                ? 'Delete'
                : whichDelete.current === 'type'
                ? 'Delete All'
                : 'Empty Trash'
            }
            onConfirm={() => {
              if (whichDelete.current === 'item') onDelete(currentItemId, currentTab);
              if (whichDelete.current === 'type') onEmptyTypeFromTrash(currentTab);
              if (whichDelete.current === 'all') onEmptyTrash();
              setIsConfirmationModalOpen(false);
            }}
            onCancel={() => setIsConfirmationModalOpen(false)}
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
              (Object.values(trash).every((item) => item.length === 0)
                ? 'cursor-not-allowed opacity-50'
                : '')
            }
            onClick={() => {
              if (Object.values(trash).every((item) => item.length === 0)) return;
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
