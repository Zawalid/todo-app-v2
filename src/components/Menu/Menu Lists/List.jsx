import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useHref, useNavigate } from 'react-router-dom';
import { ListAction } from './ListAction';
import { useIsTitleTaken, useLists, useTasks } from '../../../hooks';
import { useModal } from '../../../hooks/useModal';

export function List({ list }) {
  const { $id, title, color } = list;
  const { handleDeleteList, handleRenameList, handleChangeListColor } = useLists();
  const { tasks } = useTasks();
  const [isRenameInputOpen, setIsRenameInputOpen] = useState(false);
  const [isNewTitleTaken, setTitle] = useIsTitleTaken($id, title);
  const [listColor, setListColor] = useState(color);
  const { openModal : confirmDelete  } = useModal();
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
        <NavLink to={`lists/${title}`} className='menu_element group flex-1  grid-cols-[30px_auto_35px] '>
          <div
            className='h-5 w-5 rounded-[3px]'
            style={{
              backgroundColor: `var(${listColor})`,
            }}
          ></div>
          <span className='truncate  text-sm text-text-secondary outline-none   '>
            {title}
          </span>
          <div className='count mx-1'>
            <span className='text-xs font-semibold text-text-secondary'>{tasksCount}</span>
          </div>
        </NavLink>

        <ListAction
          onDelete={() =>
            confirmDelete({
              title: 'Delete List',
              message: `Are you sure you want to delete this list ?`,
              onConfirm: async () => handleDeleteList($id),
            })
          }
          onChangeColor={(color) => {
            setListColor(color);
            handleChangeListColor($id, color);
          }}
          color={listColor}
          onOpenRenameInput={openRenameInput}
        />
        <div
          className={
            'absolute  left-0 top-full z-10 w-[95%]  items-center overflow-hidden rounded-lg bg-background-primary px-3 shadow-[-4px_4px_1px_rgb(0,0,0,0.16)] ' +
            (isRenameInputOpen ? 'flex' : 'hidden')
          }
        >
          <input
            type='text'
            className='w-full  border-none bg-transparent py-2 text-sm text-text-primary  focus:outline-none '
            defaultValue={title}
            ref={newListTitle}
            onBlur={renameList}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isNewTitleTaken && e.target.blur()}
          />
          {isNewTitleTaken ? (
            <i className='fa-regular fa-circle-xmark text-red-500'></i>
          ) : (
            <i className='fa-regular fa-circle-check text-green-500'></i>
          )}
        </div>
      </li>
    </>
  );
}
