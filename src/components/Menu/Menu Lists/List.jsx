import { useEffect, useRef, useState } from 'react';
import { ListAction } from './ListAction';

export function List({
  title,
  color,
  tasksNumber,
  onRename,
  onDelete,
  onChangeColor,
  onDuplicateList,
  id,
}) {
  const [isListActionsOpen, setIsListActionsOpen] = useState(false);
  const [isRenameInputOpen, setIsRenameInputOpen] = useState(false);
  const [listColor, setListColor] = useState(color);
  const listActions = useRef(null);
  const newListTitle = useRef(null);

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
  return (
    <li className='menu_element group relative grid-cols-[30px_auto_35px_20px] ' data-tab={id}>
      <div
        className='h-4 w-4 rounded-[3px]'
        style={{
          backgroundColor: listColor,
        }}
      ></div>
      <span className='first-line: text-sm text-text-secondary outline-none transition-[color_font-weight] duration-100 group-hover:font-bold'>
        {title}
      </span>
      <div className='mx-1 grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300 group-hover:bg-background-primary'>
        <span className='text-xs font-semibold text-text-secondary'>{tasksNumber}</span>
      </div>
      <button
        className='cursor-pinter relative rounded-md text-center transition-colors duration-300 hover:bg-background-primary'
        onClick={(e) => {
          e.stopPropagation();
          setIsListActionsOpen(true);
        }}
      >
        <i className='fas fa-ellipsis-vertical text-text-tertiary'></i>
        <ListAction
          isOpen={isListActionsOpen}
          reference={listActions}
          onRename={(title) => onRename(title)}
          onDelete={onDelete}
          onClose={() => setIsListActionsOpen(false)}
          onChangeColor={changeColor}
          onOpenRenameInput={openRenameInput}
          onDuplicateList={onDuplicateList}
        />
      </button>

      <input
        type='text'
        className={
          'absolute  left-0 top-full z-10 w-full rounded-lg border-none bg-background-primary px-3 py-2 text-sm shadow-[-4px_4px_1px_#EBEBEB] focus:outline-none ' +
          (isRenameInputOpen ? 'block' : 'hidden')
        }
        defaultValue={title}
        ref={newListTitle}
        onBlur={(e) => {
          onRename(e.target.value);
          setIsRenameInputOpen(false);
        }}
        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
      />
    </li>
  );
}
