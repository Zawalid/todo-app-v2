import { useEffect, useState } from 'react';
import { useHref } from 'react-router-dom';

export default function useDeleteMultiple({
  selectedItems,
  setSelectedItems,
  itemType,
  onConfirm,
}) {
  const activeTab = useHref().split('/app/')[1];
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] = useState(false);
  const selectedItemsNumber = selectedItems.length;

  useEffect(() => {
    setIsSelecting(false);
  }, [activeTab]);

  useEffect(() => {
    selectedItems.length > 0 && isSelecting
      ? setIsDeleteMultipleModalOpen(true)
      : setIsDeleteMultipleModalOpen(false);
  }, [selectedItems, isSelecting]);

  useEffect(() => {
    !isDeleteMultipleModalOpen &&
      selectedItems.length !== 0 &&
      !isSelecting &&
      setSelectedItems([]);
  }, [isDeleteMultipleModalOpen, selectedItems, isSelecting, setSelectedItems]);

  return {
    isSelecting,
    setIsSelecting,
    setIsDeleteMultipleModalOpen,

    Modal: (
      <div
        className={`fixed left-1/2 z-[999999] flex w-[90%] -translate-x-1/2 items-center justify-between rounded-lg border border-border bg-background-primary px-5 py-3 shadow-lg transition-[bottom] duration-500 sm:w-[500px]  ${
          isDeleteMultipleModalOpen ? 'bottom-11' : '-bottom-[100px]'
        }`}
      >
        <h2 className='text-sm font-semibold text-text-secondary '>
          <span className='mr-2 rounded-md bg-primary px-2 py-1 text-white  '>
            {selectedItemsNumber}
          </span>
          {selectedItemsNumber === 1 ? itemType : itemType + 's'} selected
        </h2>
        <div className='flex items-center  gap-3 '>
          <button
            className='rounded-lg bg-background-secondary px-2 py-2 text-xs font-semibold text-text-secondary transition-colors duration-300 hover:bg-background-tertiary sm:px-4'
            onClick={() => {
              setIsDeleteMultipleModalOpen(false);
              setIsSelecting(false);
            }}
          >
            Cancel
          </button>
          <button
            className='rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-red-600 sm:px-4'
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    ),
  };
}
