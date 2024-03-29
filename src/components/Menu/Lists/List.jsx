import { useRef, useState } from 'react';
import { NavLink, useHref } from 'react-router-dom';
import { ListAction } from './ListAction';
import { useModal } from '../../../hooks/useModal';
import { PiCheckCircle } from 'react-icons/pi';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { useListTasks, useTasks } from '../../../lib/react-query/queries';
import { useDeleteList, useDeleteTasks, useUpdateList } from '../../../lib/react-query/mutations';
import CustomTippy from '../../Common/CustomTippy';
import { useListTitle } from '../../../hooks/useListTitle';
import { useSelector } from 'react-redux';

export function List({ list }) {
  const { $id, title, color } = list;
  const [listColor, setListColor] = useState(color);
  const [isRenameInputOpen, setIsRenameInputOpen] = useState(false);
  const { newTitle, setNewTitle, error } = useListTitle($id, title);
  const { tasks } = useTasks();
  const { deleteTasksWithList } = useSelector((state) => state.settings.general.tasks);

  const newListTitle = useRef(null);
  const path = useHref().split('/app/lists/')[1];

  const { mutate: deleteList } = useDeleteList();
  const { mutate: updateList } = useUpdateList();
  const { mutate: deleteAllTasks } = useDeleteTasks();
  const { listTasks } = useListTasks($id);
  const { openModal: confirmDelete } = useModal();

  function handleRename(e) {
    e.preventDefault();
    if (error || newTitle === title) return;
    setIsRenameInputOpen(false);
    updateList({
      id: $id,
      list: { title: newTitle },
      isCurrentList: path?.replace(/%20/g, ' ').trim() === title.trim(),
    });
  }
  return (
    <>
      <li className='relative flex items-center gap-2 pr-2 '>
        <NavLink
          to={`lists/${title}`}
          className='menu_element group flex-1  grid-cols-[30px_auto_35px] '
        >
          <div
            className='h-5 w-5 rounded-[3px]'
            style={{
              backgroundColor: `var(${listColor})`,
            }}
          ></div>
          <span className='truncate  text-sm text-text-secondary outline-none'>{title}</span>
          <div className='count mx-1'>
            <span className='text-xs font-semibold text-text-secondary'>{listTasks?.length}</span>
          </div>
        </NavLink>

        <ListAction
          onDelete={() =>
            confirmDelete({
              title: 'Delete List',
              message: `Are you sure you want to delete this list ?`,
              onConfirm: async (deletePermanently) => {
                deleteList({ id: $id, deletePermanently });
                // To delete all the tasks of the deleted list
                if (!deleteTasksWithList) return;
                const tasksToDelete = tasks.filter((task) => task.listId === $id);
                if (tasksToDelete.length === 0) return;
                deleteAllTasks({
                  deleted: tasksToDelete.map((task) => task.$id),
                  deletePermanently,
                });
              },
            })
          }
          onChangeColor={(color) => {
            setListColor(color);
            updateList({ id: $id, list: { color } });
          }}
          color={listColor}
          onOpenRenameInput={() => {
            setIsRenameInputOpen(true);
            setTimeout(() => newListTitle.current.focus(), 50);
          }}
        />
        <form
          className={
            'absolute left-0 top-full z-[5] w-[90%] items-center overflow-hidden rounded-lg border border-border bg-background-primary px-3 py-1 shadow-[-4px_4px_1px_rgb(0,0,0,0.16)] ' +
            (isRenameInputOpen ? 'flex' : 'hidden')
          }
          onSubmit={handleRename}
          onBlur={() => {
            setIsRenameInputOpen(false);
            setNewTitle(title);
          }}
        >
          <input
            type='text'
            className='w-full  border-none bg-transparent py-2 text-sm text-text-primary  focus:outline-none '
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            ref={newListTitle}
          />
          {error ? (
            <CustomTippy content={error}>
              <span>
                <FaRegCircleXmark className='text-lg text-red-500' />
              </span>
            </CustomTippy>
          ) : (
            <PiCheckCircle className='text-xl text-green-500' />
          )}
        </form>
      </li>
    </>
  );
}
