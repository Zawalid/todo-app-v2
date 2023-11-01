import { useRef, useState } from 'react';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './MenuTasks';
import { Search } from './Search';
import { Trash } from './Trash/Trash';
import { useHref, useNavigate } from 'react-router-dom';

export function Menu({
  stickyNotesNumber,
  lists,
  onAddList,
  onRenameList,
  onDeleteList,
  onChangeListColor,
  onDuplicateList,
  tags,
  onAddTag,
  onDeleteTag,
  trash,
  onDeleteFromTrash,
  onEmptyTypeFromTrash,
  onEmptyTrash,
  onRestoreFromTrash,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const path = useHref().split('/');
  const [isTrashOpen, setIsTrashOpen] = useState(path.includes('trash'));
  const menu = useRef(null);
  const navigate = useNavigate();

  return (
    <aside
      className={
        'flex flex-col  rounded-l-xl  p-4  transition-[width]  duration-500   ' +
        (isOpen
          ? 'w-[22%] items-stretch bg-background-secondary '
          : 'w-0 items-center bg-background-primary  ')
      }
      ref={menu}
    >
      {isOpen || (
        <button onClick={() => setIsOpen(true)}>
          <i className='fa-solid fa-bars cursor-pointer text-text-secondary'></i>
        </button>
      )}
      {isOpen && (
        <>
          <div className='flex items-center justify-between pb-3'>
            <h2 className='text-xl font-bold text-text-secondary'>Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-secondary'></i>
            </button>
          </div>
          <div className='overflow-y-auto'>
            <Search />
            <MenuTasks stickyNotesNumber={stickyNotesNumber} />
            <MenuLists
              lists={lists}
              onAddList={onAddList}
              onRenameList={onRenameList}
              onDeleteList={onDeleteList}
              onChangeListColor={onChangeListColor}
              onDuplicateList={onDuplicateList}
            />
            <MenuTags tags={tags} onAddTag={onAddTag} onDeleteTag={onDeleteTag} />
          </div>
          <div className=' mt-auto  pt-3'>
            <button
              className='mb-2 grid cursor-pointer grid-cols-[25px_auto] items-center text-sm'
              onClick={() => {
                setIsTrashOpen(true);
                navigate('trash');
              }}
            >
              <i className='fa-solid fa-trash-can text-text-tertiary'></i>
              <span className='font-medium text-text-secondary'>Trash</span>
            </button>
          </div>
          {isTrashOpen && (
            <Trash
              trash={trash}
              onDelete={onDeleteFromTrash}
              onEmptyTypeFromTrash={onEmptyTypeFromTrash}
              onEmptyTrash={onEmptyTrash}
              onRestoreFromTrash={onRestoreFromTrash}
              onClose={() => {
                setIsTrashOpen(false);
                navigate(path.filter((part) => part !== 'trash').join('/'));
              }}
            />
          )}
        </>
      )}
    </aside>
  );
}
