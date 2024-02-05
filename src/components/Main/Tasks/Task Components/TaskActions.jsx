import { useState } from 'react';
import Drawer from '../../../Common/Drawer';
import { TaskDates } from './TaskDates';
import { IoDuplicateOutline, IoCopyOutline } from 'react-icons/io5';
import { PiCheckBold, PiSignOut, PiTrash } from 'react-icons/pi';
import { PiX } from 'react-icons/pi';
import { IoChevronBack } from 'react-icons/io5';

export default function TaskActions({
  isOpen,
  onClose,
  onDelete,
  onCopy,
  onDuplicate,
  date,
  lists,
  onMove,
  currentListId,
}) {
  const [listSelectionOpen, setListSelectionOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <Drawer onClose={onClose} shouldClose={!listSelectionOpen}>
      <div>
        <button className='menu_element w-full justify-items-start' onClick={onCopy}>
          <IoCopyOutline />
          <span className='font-semibold text-text-secondary'>Copy to clipboard</span>
        </button>
        <button className='menu_element w-full justify-items-start' onClick={onDuplicate}>
          <IoDuplicateOutline />
          <span className='font-semibold text-text-secondary'>Duplicate Task</span>
        </button>
        <button
          className='menu_element w-full justify-items-start'
          onClick={() => setListSelectionOpen(true)}
        >
          <PiSignOut /> <span className='font-semibold text-text-secondary'>Move Task To</span>
        </button>
        <button
          className='menu_element trash w-full justify-items-start text-red-500
           hover:bg-red-500 hover:text-white'
          onClick={onDelete}
        >
          <PiTrash className='text-red-500' />
          <span className='font-semibold '>Delete Task</span>
        </button>
      </div>
      <div className='mt-2 border-t-2 border-border pt-3'>
        <TaskDates date={date} />
      </div>
      <SelectList
        lists={lists}
        onClose={onClose}
        onMove={onMove}
        listSelectionOpen={listSelectionOpen}
        setListSelectionOpen={setListSelectionOpen}
        currentListId={currentListId}
      />
    </Drawer>
  );
}

function SelectList({
  lists,
  onClose,
  onMove,
  listSelectionOpen,
  setListSelectionOpen,
  currentListId,
}) {
  return (
    <div
      className={
        'absolute top-0 h-full w-full bg-background-primary p-3 pt-11  ' +
        (listSelectionOpen ? 'left-0' : 'left-full')
      }
    >
      <div className='flex items-center justify-between'>
        <button onClick={() => setListSelectionOpen(false)}>
          <IoChevronBack className='text-text-secondary' />
        </button>
        <h3 className='flex-1 text-center text-lg font-semibold text-text-secondary'>
          Select List
        </h3>
        <button
          onClick={() => {
            setListSelectionOpen(false);
            onClose();
          }}
        >
          <PiX size={20} className='text-text-secondary' />
        </button>
      </div>
      <ul className='mt-3 h-[150px] space-y-2 overflow-auto overflow-x-hidden pr-2'>
        {lists.map((list) => (
          <li
            className={`menu_element w-full justify-items-start ${
              currentListId === list.id
                ? 'grid-cols-[30px_30px_auto_50px]'
                : 'grid-cols-[30px_auto_50px]'
            }`}
            key={list.id}
            onClick={() => {
              setListSelectionOpen(false);
              currentListId !== list.id && onMove(list.id);
            }}
          >
            {currentListId === list.id && <PiCheckBold className='text-text-secondary' />}
            <span
              className='h-5 w-5 rounded-sm'
              style={{ backgroundColor: `var(${list.color})` }}
            ></span>
            <span className='w-[90%] overflow-auto font-semibold text-text-primary'>
              {list.title}
            </span>
            <span className='text-xs font-medium text-text-tertiary'>{list.tasksLength} Tasks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
