import { useEffect, useRef, useState } from 'react';
import { NavLink, useHref, useNavigate } from 'react-router-dom';
import { ListAction } from './ListAction';
import { useIsTitleTaken, useLists } from '../../../hooks';
import { useModal } from '../../../hooks/useModal';
import { PiCheckCircle } from 'react-icons/pi';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { useListTasks } from '../../../lib/react-query/queries';

export function List({ list }) {
  const { $id, title, color } = list;
  const { handleDeleteList, handleRenameList, handleChangeListColor } = useLists();
  const { listTasks } = useListTasks($id);
  const [isRenameInputOpen, setIsRenameInputOpen] = useState(false);
  const [isNewTitleTaken, setTitle] = useIsTitleTaken($id, title);
  const [listColor, setListColor] = useState(color);
  const { openModal: confirmDelete } = useModal();

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
      <li className='relative flex items-center gap-2 pr-2 '>
        <NavLink
          to={`/app/${title}`}
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
              onConfirm: async (deletePermanently) => handleDeleteList($id, deletePermanently),
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
            'absolute  left-0 top-full z-[5] w-[95%] items-center overflow-hidden rounded-lg bg-background-primary px-3 shadow-[-4px_4px_1px_rgb(0,0,0,0.16)] ' +
            (isRenameInputOpen ? 'flex' : 'hidden')
          }
        >
          <input
            type='text'
            className='w-full  border-none bg-transparent py-2 text-sm text-text-primary  focus:outline-none '
            defaultValue={title}
            ref={newListTitle}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && renameList(e)}
          />
          {isNewTitleTaken ? (
            <FaRegCircleXmark className='text-red-500' />
          ) : (
            <PiCheckCircle className='text-green-500' />
          )}
        </div>
      </li>
    </>
  );
}
