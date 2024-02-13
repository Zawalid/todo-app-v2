import trashIcon from '../../../assets/trash.png';
import { Item } from './Item';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useModal } from '../../../hooks/useModal';

import {
  useTrashedTasks,
  useTrashedLists,
  useTrashedTags,
  useTrashedStickyNotes,
} from '../../../lib/react-query/queries';
import { useDeleteTaskPermanently, useRestoreTask } from '../../../lib/react-query/mutations';

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

export function TrashedTasks() {
  const { trashedTasks, isLoading, isError } = useTrashedTasks();
  const { mutate: restoreTask } = useRestoreTask();
  const { mutate: deleteTask } = useDeleteTaskPermanently();
  const { openModal: confirmDelete } = useModal();

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
          showCheckbox : false
        })
      }
    />
  );
}

export function TrashedLists() {
  const { trashedLists, isLoading, isError } = useTrashedLists();

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items
      type='lists'
      items={trashedLists}
      isLoading={isLoading}
      emptyMessage='No trashed lists'
    />
  );
}

export function TrashedTags() {
  const { trashedTags, isLoading, isError } = useTrashedTags();

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items type='tags' items={trashedTags} isLoading={isLoading} emptyMessage='No trashed tags' />
  );
}

export function TrashedStickyNotes() {
  const { trashedStickyNotes, isLoading, isError } = useTrashedStickyNotes();

  if (isError) return <p>Something went wrong</p>;
  return (
    <Items
      type='stickyNotes'
      items={trashedStickyNotes}
      isLoading={isLoading}
      emptyMessage='No trashed sticky notes'
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
