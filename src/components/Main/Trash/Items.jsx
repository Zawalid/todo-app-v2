import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useModal } from '../../../hooks/useModal';

import {
  useTrashedTasks,
  useTrashedLists,
  useTrashedTags,
  useTrashedStickyNotes,
  useLists,
} from '../../../lib/react-query/queries';
import {
  useRestoreTask,
  useRestoreList,
  useRestoreTag,
  useRestoreStickyNote,
  useDeleteTaskPermanently,
  useDeleteListPermanently,
  useDeleteTagPermanently,
  useDeleteStickyNotePermanently,
} from '../../../lib/react-query/mutations';
import { toast } from 'sonner';
import { useEffect } from 'react';

function Items({ items, isLoading, emptyMessage, onRestore, onDelete }) {
  const [parent] = useAutoAnimate({ duration: 500 });

  if (items?.length === 0)
    return (
      <div className='grid h-full place-content-center justify-items-center '>
        <img src={trashIcon} alt='trash' className='w-20' />
        <span className='text-center text-sm font-bold text-text-tertiary'>{emptyMessage}</span>
      </div>
    );

  if (isLoading) return <Skeleton />;

  return (
    <ul className='flex flex-1 flex-col gap-2 overflow-auto overflow-x-hidden' ref={parent}>
      {items?.map((item) => (
        <Item key={item.$id} item={item} onRestore={onRestore} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export function TrashedTasks({ isOpen }) {
  const { trashedTasks, isLoading, isError, refetch } = useTrashedTasks();
  const { mutate: restoreTask } = useRestoreTask();
  const { mutate: deleteTask } = useDeleteTaskPermanently();
  const { openModal: confirmDelete } = useModal();

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items
      items={trashedTasks}
      isLoading={isLoading}
      emptyMessage='No trashed tasks'
      onRestore={restoreTask}
      onDelete={(id) =>
        confirmDelete({
          message: 'Are you sure you want to delete this task permanently?',
          title: 'Delete Task',
          onConfirm: async () => deleteTask({ id }),
          showCheckbox: false,
        })
      }
    />
  );
}

export function TrashedLists() {
  const { trashedLists, isLoading, isError } = useTrashedLists();
  const { mutate: restoreList } = useRestoreList();
  const { mutate: deleteList } = useDeleteListPermanently();
  const { openModal: confirmDelete } = useModal();
  const { lists } = useLists();

  const onRestore = ({ id, title }) => {
    const isListTitleTaken = lists?.some((list) => list.title === title);
    if (isListTitleTaken) {
      toast.error('A list with the same title already exists.');
      return;
    }
    restoreList({ id });
  };

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items
      type='lists'
      items={trashedLists}
      isLoading={isLoading}
      emptyMessage='No trashed lists'
      onRestore={onRestore}
      onDelete={(id) =>
        confirmDelete({
          message: 'Are you sure you want to delete this list permanently?',
          title: 'Delete List',
          onConfirm: async () => deleteList({ id }),
          showCheckbox: false,
        })
      }
    />
  );
}

export function TrashedTags() {
  const { trashedTags, isLoading, isError } = useTrashedTags();
  const { mutate: restoreTag } = useRestoreTag();
  const { mutate: deleteTag } = useDeleteTagPermanently();
  const { openModal: confirmDelete } = useModal();

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items
      type='tags'
      items={trashedTags}
      isLoading={isLoading}
      emptyMessage='No trashed tags'
      onRestore={restoreTag}
      onDelete={(id) =>
        confirmDelete({
          message: 'Are you sure you want to delete this tag permanently?',
          title: 'Delete Tag',
          onConfirm: async () => deleteTag({ id }),
          showCheckbox: false,
        })
      }
    />
  );
}

export function TrashedStickyNotes() {
  const { trashedStickyNotes, isLoading, isError } = useTrashedStickyNotes();
  const { mutate: restoreStickyNote } = useRestoreStickyNote();
  const { mutate: deleteStickyNote } = useDeleteStickyNotePermanently();
  const { openModal: confirmDelete } = useModal();

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items
      type='stickyNotes'
      items={trashedStickyNotes}
      isLoading={isLoading}
      emptyMessage='No trashed sticky notes'
      onRestore={restoreStickyNote}
      onDelete={(id) =>
        confirmDelete({
          message: 'Are you sure you want to delete this sticky note permanently?',
          title: 'Delete Sticky Note',
          onConfirm: async () => deleteStickyNote({ id }),
          showCheckbox: false,
        })
      }
    />
  );
}

function Skeleton() {
  return (
    <ul className='animate-pulse space-y-2'>
      {Array.from({ length: 5 }).map((_, index) => (
        <li
          key={index}
          className='flex items-center justify-between  rounded-lg bg-background-secondary  px-3 py-2'
        >
          <span className=' h-1 w-20 rounded-md bg-text-tertiary'></span>
          <div className='flex gap-3'>
            <span className='h-5 w-6 rounded-lg bg-text-tertiary'></span>
            <span className='h-5 w-6 rounded-lg bg-text-tertiary'></span>
          </div>
        </li>
      ))}
    </ul>
  );
}
