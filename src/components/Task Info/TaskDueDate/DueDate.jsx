import Tippy from '@tippyjs/react';
import { useRef, useState } from 'react';
import { isTaskOverdue } from '../../../utils/Moment';
import { Dates } from './Dates';

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
        className='w-52'
        theme='light'
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

