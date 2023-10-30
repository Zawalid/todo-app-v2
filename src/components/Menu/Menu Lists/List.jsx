import { useEffect, useRef, useState } from 'react';
import { NavLink, useHref, useNavigate } from 'react-router-dom';
import { ListAction } from './ListAction';
import { ConfirmationModal } from '../../ConfirmationModal';
import { useIsTitleTaken } from './useIsTitleTaken';

export function List({
  id,
  title,
  color,
  tasksNumber,
  onRename,
  onDelete,
  onChangeColor,
  onDuplicateList,
  lists,
}) {
  const [isListActionsOpen, setIsListActionsOpen] = useState(false);
  const [isRenameInputOpen, setIsRenameInputOpen] = useState(false);
  const [isNewTitleTaken, , setTitle] = useIsTitleTaken(lists, id, title);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listColor, setListColor] = useState(color);
  const listActions = useRef(null);
  const newListTitle = useRef(null);
  const navigator = useNavigate();
  const path = useHref();

  useEffect(() => {
    function handleClickOutside(event) {
      if (listActions.current && !listActions.current.contains(event.target)) {
        setIsListActionsOpen(false);
      }
      if (newListTitle.current && !newListTitle.current.contains(event.target)) {
        setIsRenameInputOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [listActions]);

  function changeColor(color) {
    setListColor(color);
    onChangeColor(color);
  }
  function openRenameInput() {
    setIsRenameInputOpen(true);
    setTimeout(() => newListTitle.current.focus(), 50);
  }
  function renameList(e) {
    if (isNewTitleTaken) return;
    const newTitle = e.target.value.trim();
    onRename(newTitle);
    setIsRenameInputOpen(false);
    // Change the path to the new title if the renamed list is the active one
    path.replace(/%20/g, ' ') === `/${title}` && navigator(`/${newTitle}`);
  }
  return (
    <>
      <li className='relative flex gap-1 pr-2 '>
        <NavLink
          to={`/${title}`}
          className='menu_element group flex-1  grid-cols-[30px_auto_35px] '
        >
          <div
            className='h-4 w-4 rounded-[3px]'
            style={{
              backgroundColor: listColor,
            }}
          ></div>
          <span className='first-line: text-sm text-text-secondary outline-none transition-[color_font-weight] duration-100 group-hover:font-bold'>
            {title}
          </span>
          <div className='count mx-1 grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300 group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{tasksNumber}</span>
          </div>
        </NavLink>

        <button
          className='cursor-pinter relative rounded-md px-2 text-center transition-colors duration-300 hover:bg-background-primary'
          onClick={(e) => {
            e.stopPropagation();
            setIsListActionsOpen(true);
          }}
        >
          <i className='fas fa-ellipsis-vertical text-text-tertiary'></i>
          <ListAction
            isOpen={isListActionsOpen}
            reference={listActions}
            onDelete={() => setIsDeleteModalOpen(true)}
            onClose={() => setIsListActionsOpen(false)}
            onChangeColor={changeColor}
            onOpenRenameInput={openRenameInput}
            onDuplicateList={onDuplicateList}
          />
        </button>
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
      {isDeleteModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to delete this list?'
          confirmText='Delete'
          onConfirm={() => {
            if (path.replace(/%20/g, ' ') === `/${title}`) {
              navigator('/');
              onDelete();
            }
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
