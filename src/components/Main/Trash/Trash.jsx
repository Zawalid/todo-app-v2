import { Tabs } from '../../Common/Tabs';
import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';
import { useRestoreElement, useLists, useTrash } from '../../../hooks';
import { toast } from 'sonner';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useModal } from '../../Common/ConfirmationModal';
import { Actions } from './Actions';

export default function Trash({ isOpen, onClose }) {
  const {
    trash,
    currentTab,
    trashLength,
    handleDeleteFromTrash,
    handleEmptyType,
    handleEmptyTrash,
    setCurrentTab,
    handleRestoreFromTrash,
    handleRestoreType,
  } = useTrash();
  const { lists } = useLists();
  const { handleRestoreElement } = useRestoreElement();
  const [parent] = useAutoAnimate({ duration: 300 });
  const { confirmDelete } = useModal();

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
    <div
      className={`fixed left-0 top-0 z-[9999] flex h-full w-full flex-col gap-5 overflow-auto rounded-lg border border-border bg-background-primary px-5 py-3 shadow-md   md:static md:h-[350px] md:w-[500px]
    ${isOpen ? 'scale-100' : 'scale-0'}`}
      ref={parent}
    >
      <div className='flex items-start justify-between gap-5'>
        <Tabs
          tabs={['Tasks', 'Lists', 'Tags', 'Sticky Notes']}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          className='gap-5 sm:gap-8'
        />
        <div className='flex gap-2'>
          <Actions
            trash={trash}
            currentTab={currentTab}
            trashLength={trashLength}
            onDeleteAll={() => {
              confirmDelete({
                title: 'Delete All',
                message: `Are you sure you want to delete all ${
                  currentTab === 'stickyNotes' ? 'sticky notes' : currentTab
                } permanently ?`,
                confirmText: 'Delete All',
                showCheckBox: false,
                onConfirm: async () => {
                  handleEmptyType(currentTab);
                },
              });
            }}
            onEmptyTrash={() => {
              confirmDelete({
                title: 'Empty Trash',
                message: 'Are you sure you want to empty trash ?',
                confirmText: 'Empty',
                showCheckBox: false,
                onConfirm: async () => {
                  handleEmptyTrash();
                },
              });
            }}
            onRestoreAll={async () => {
              await handleRestoreType(currentTab);
              handleRestoreElement(currentTab);
            }}
          />
          {onClose && (
            <button className='icon-button not-active small' onClick={onClose}>
              <i className='fa-solid fa-xmark'></i>
            </button>
          )}
        </div>
      </div>
      <Items
        trash={trash}
        currentTab={currentTab}
        onDelete={(item) => {
          confirmDelete({
            title: 'Delete',
            message: `Are you sure you want to delete this ${
              currentTab === 'stickyNotes'
                ? 'sticky note'
                : currentTab.slice(0, currentTab.length - 1)
            } permanently ?`,
            showCheckBox: false,
            onConfirm: async () => {
              handleDeleteFromTrash(currentTab, JSON.parse(item).id);
            },
          });
        }}
        onRestore={onRestore}
      />
      <Info />
    </div>
  );
}

function Items({ trash, currentTab, onDelete, onRestore }) {
  const [parent] = useAutoAnimate({ duration: 500 });

  if (trash[currentTab]?.length === 0)
    return (
      <div className='grid h-full place-content-center justify-items-center '>
        <img src={trashIcon} alt='trash' className='w-20' />
        <span className='text-center text-sm font-bold text-text-tertiary'>
          No {currentTab === 'stickyNotes' ? 'sticky notes' : currentTab} in trash
        </span>
      </div>
    );

  return (
    <ul className='flex flex-1  flex-col gap-2 overflow-auto overflow-x-hidden' ref={parent}>
      {trash[currentTab]?.map((item) => (
        <Item
          key={JSON.parse(item).id}
          title={JSON.parse(item).title}
          onDelete={() => onDelete(item)}
          onRestore={() => onRestore(item)}
        />
      ))}
    </ul>
  );
}

function Info() {
  return (
    <div className='flex items-center justify-center gap-2'>
      <i className='fa-solid fa-info-circle text-blue-400'></i>
      <p className='text-[10px] font-medium text-text-tertiary sm:text-xs '>
        Items in the trash will be automatically cleared after 30 days.
      </p>
    </div>
  );
}
