import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useHref, useNavigate } from 'react-router-dom';
import { ListAction } from './ListAction';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import { useIsTitleTaken, useLists, useTasks } from '../../../hooks';

export function List({ list }) {
  const { $id, title, color } = list;
  const { handleDeleteList, handleRenameList, handleChangeListColor } = useLists();
  const { tasks } = useTasks();
  const [isRenameInputOpen, setIsRenameInputOpen] = useState(false);
  const [isNewTitleTaken, setTitle] = useIsTitleTaken($id, title);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [listColor, setListColor] = useState(color);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const tasksCount = useMemo(
    () => tasks.filter((task) => task.listId === $id).length,
    [tasks, $id],
  );

  const newListTitle = useRef(null);
  const navigate = useNavigate();
  const path = useHref().split('app/')[1];

  useEffect(() => {
    function handleClickOutside(event) {
      if (newListTitle.current && !newListTitle.current.contains(event.target)) {
        setIsRenameInputOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function openRenameInput() {
    setIsRenameInputOpen(true);
    setTimeout(() => newListTitle.current.focus(), 50);
  }
  async function renameList(e) {
    if (isNewTitleTaken) return;
    const newTitle = e.target.value.trim();
    if (newTitle === title) return;
    setIsRenameInputOpen(false);
    await handleRenameList($id, newTitle);
    // Change the path to the new title if the renamed list is the active one
    path?.replace(/%20/g, ' ') === title && navigate(newTitle);
  }
  return (
    <>
      <li className='relative flex items-center gap-1 pr-2 '>
        <NavLink to={title} className='menu_element group flex-1  grid-cols-[30px_auto_35px] '>
          <div
            className='h-5 w-5 rounded-[3px]'
            style={{
              backgroundColor: listColor,
            }}
          ></div>
          <span className='truncate  text-sm text-text-secondary outline-none transition-[color,font-weight] duration-100 group-hover:font-bold'>
            {title}
          </span>
          <div className='count mx-1 grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300 group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{tasksCount}</span>
          </div>
        </NavLink>

        <ListAction
          onDelete={() => setIsConfirmationModalOpen(true)}
          onChangeColor={(color) => {
            setListColor(color);
            handleChangeListColor($id, color);
          }}
          color={listColor}
          onOpenRenameInput={openRenameInput}
        />
        <div
          className={
            'absolute  left-0 top-full z-10 w-[95%]  items-center overflow-hidden rounded-lg bg-background-primary px-3 shadow-[-4px_4px_1px_#EBEBEB] ' +
            (isRenameInputOpen ? 'flex' : 'hidden')
          }
        >
          <input
            type='text'
            className='w-full  border-none  py-2 text-sm  focus:outline-none '
            defaultValue={title}
            ref={newListTitle}
            onBlur={renameList}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isNewTitleTaken && e.target.blur()}
          />
          {isNewTitleTaken ? (
            <i className='fa-regular fa-circle-xmark text-text-error'></i>
          ) : (
            <i className='fa-regular fa-circle-check text-green-500'></i>
          )}
        </div>
      </li>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        sentence='Are you sure you want to delete this list?'
        confirmText='Delete'
        onConfirm={() => {
          setIsConfirmationModalOpen(false);
          handleDeleteList($id, deletePermanently);
          path?.replace(/%20/g, ' ') === title && navigate('/app');
          // To delete all the tasks of the deleted list
          // const tasksToDelete = tasks.filter((task) => task.listId === $id);
          // if (tasksToDelete.length === 0) return;
          // tasksToDelete.forEach(async (task) => await handleDeleteTask(task.$id));
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
        element='List'
        checked={deletePermanently}
        setChecked={setDeletePermanently}
      />
    </>
  );
}
