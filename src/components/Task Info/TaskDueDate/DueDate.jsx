import Tippy from '@tippyjs/react';
import { useEffect, useRef, useState } from 'react';
import { isTaskOverdue } from '../../../utils/Moment';

export function DueDate({ taskDueDate, setTaskDueDate }) {
  const [isOpen, setIsOpen] = useState();
  const instanceRef = useRef(null);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isOverDue = isTaskOverdue(taskDueDate);

  function handleAddDueDate(dueDate) {
    const date =
      dueDate === 'Today'
        ? today.toISOString().split('T')[0]
        : dueDate === 'Tomorrow'
        ? tomorrow.toISOString().split('T')[0]
        : dueDate;
    setTaskDueDate(date);
    instanceRef?.current?.hide();
  }

  return (
    <div className='flex items-center gap-2'>
      <Tippy
        content={
          <Dates
            isOpen={isOpen}
            taskDueDate={taskDueDate}
            onAdd={handleAddDueDate}
            today={today}
            tomorrow={tomorrow}
          />
        }
        className='w-52 rounded-lg bg-background-primary shadow-md'
        trigger='click'
        interactive={true}
        arrow={false}
        placement='bottom'
        onClickOutside={(instance) => instance.hide()}
        onMount={(instance) => (instanceRef.current = instance)}
      >
        <div
          className={
            'flex w-32 cursor-pointer items-center justify-between rounded-lg border border-background-tertiary p-2 ' +
            (isOverDue ? 'text-text-error' : 'text-text-secondary')
          }
          id='dueDate'
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className='text-sm'>
            {!taskDueDate && 'Not set'}
            {taskDueDate === today.toISOString().split('T')[0]
              ? 'Today'
              : taskDueDate === tomorrow.toISOString().split('T')[0]
              ? 'Tomorrow'
              : taskDueDate}
          </span>
          <i className='fa-solid fa-calendar-days  text-sm'></i>
        </div>
      </Tippy>
      {taskDueDate && (
        <button
          className={isOverDue ? 'text-text-error' : 'text-text-secondary'}
          onClick={() => setTaskDueDate('')}
        >
          <i className='fa-solid fa-xmark'></i>
        </button>
      )}
    </div>
  );
}

function Dates({ isOpen, taskDueDate, onAdd, today, tomorrow }) {
  const [isPickerOpen, setIsPickerOpen] = useState();

  useEffect(() => {
    isOpen || setIsPickerOpen(false);
  }, [isOpen]);

  return (
    <ul>
      <li
        className='flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-colors duration-300 hover:bg-background-secondary'
        onClick={() => onAdd('Today')}
      >
        <i className='fa-solid fa-calendar cursor-pointer  text-text-tertiary'></i>
        <span className='flex-1 text-text-primary'>Today</span>
        <span className='text-text-tertiary'>
          {today.toLocaleDateString(undefined, { weekday: 'short' })}
        </span>
      </li>
      <li
        className='flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-colors duration-300 hover:bg-background-secondary'
        onClick={() => onAdd('Tomorrow')}
      >
        <i className='fa-solid fa-calendar cursor-pointer  text-text-tertiary'></i>
        <span className='flex-1 text-text-primary'>Tomorrow</span>
        <span className='text-text-tertiary'>
          {tomorrow.toLocaleDateString(undefined, { weekday: 'short' })}
        </span>
      </li>
      <li
        className='relative flex cursor-pointer items-center justify-between gap-3 rounded-md  border-t border-t-background-secondary p-2 transition-colors duration-300 hover:bg-background-secondary'
        onClick={() => setIsPickerOpen(!isPickerOpen)}
      >
        <i className='fa-solid fa-calendar cursor-pointer  text-text-tertiary'></i>
        <span className='flex-1 text-text-primary'>Pick a date</span>
      </li>
      <li
        className={
          'flex cursor-pointer items-center justify-between gap-3 rounded-md  transition-all duration-300 hover:bg-background-secondary ' +
          (isPickerOpen ? 'h-[37px] p-2' : 'h-0 p-0')
        }
      >
        <input
          type='date'
          className='h-full w-full bg-transparent text-text-primary focus:outline-none'
          value={taskDueDate}
          onChange={(e) => onAdd(e.target.value)}
        />
      </li>
    </ul>
  );
}
