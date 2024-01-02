import { useRef, useState } from 'react';
import { isTaskOverdue } from '../../utils/Moment';
import { DropDown } from '../Common/DropDown';

export function TaskDueDate({ taskDueDate, setTaskDueDate }) {
  const [date, setDate] = useState(taskDueDate);
  const instanceRef = useRef(null);
  const today = new Date();
  const tomorrow = new Date(today);
  const isOverDue = isTaskOverdue(taskDueDate);

  tomorrow.setDate(today.getDate() + 1);

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
    <>
      <label className='justify-self-start text-sm text-text-tertiary'>Due date</label>
      <div className='flex items-center gap-2'>
        {taskDueDate && (
          <button
            className={isOverDue ? 'text-text-error' : 'text-text-secondary'}
            onClick={() => setTaskDueDate('')}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        )}
        <DropDown
          toggler={
            <DropDown.Toggler>
              <span
                className={'text-sm ' + (isOverDue ? 'text-text-error' : 'text-text-secondary')}
              >
                {!taskDueDate && 'Not set'}
                {taskDueDate === today.toISOString().split('T')[0]
                  ? 'Today'
                  : taskDueDate === tomorrow.toISOString().split('T')[0]
                  ? 'Tomorrow'
                  : taskDueDate}
              </span>
              <i className='fa-solid fa-calendar-days  text-sm'></i>
            </DropDown.Toggler>
          }
          options={{ className: 'w-52', shouldCloseOnClick: false }}
        >
          <DropDown.Button onClick={() => handleAddDueDate('Today')}>
            <i className='fa-solid fa-calendar  text-text-tertiary'></i>
            <span className='flex-1 text-start text-text-primary '>Today</span>
            <span className='text-text-tertiary'>
              {today.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          </DropDown.Button>
          <DropDown.Button onClick={() => handleAddDueDate('Tomorrow')}>
            <i className='fa-solid fa-calendar  text-text-tertiary'></i>
            <span className='flex-1 text-start text-text-primary '>Tomorrow</span>
            <span className='text-text-tertiary'>
              {tomorrow.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>{' '}
          </DropDown.Button>

          <DropDown.NestedMenu
            toggler={
              <DropDown.Button>
                <i className='fa-solid fa-calendar  text-text-tertiary'></i>
                <span className='flex-1 text-start text-text-primary '>Pick a date</span>
                <i className='fa-solid fa-chevron-down text-text-tertiary transition-transform duration-300'></i>
              </DropDown.Button>
            }
            options={{ className: 'w-52', placement: 'bottom', shouldCloseOnClick: false }}
            togglerClassName='w-full'
          >
            <input
              type='date'
              className='w-full bg-transparent p-2 text-text-primary focus:outline-none'
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                handleAddDueDate(e.target.value);
              }}
            />
          </DropDown.NestedMenu>
        </DropDown>
      </div>
    </>
  );
}
