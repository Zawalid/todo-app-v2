import { useRef, useState } from 'react';
import { isTaskOverdue } from '../../utils/Dates';
import { DropDown } from '../Common/DropDown';

export function TaskDueDate({ taskDueDate, setTaskDueDate, inSettings }) {
  const [date, setDate] = useState(taskDueDate);
  const instanceRef = useRef(null);
  const today = new Date();
  const tomorrow = new Date(today);
  const isOverDue = isTaskOverdue(taskDueDate);
  tomorrow.setDate(today.getDate() + 1);

  const isPicked = ![
    today.toISOString().split('T')[0],
    tomorrow.toISOString().split('T')[0],
    '',
  ].includes(taskDueDate);


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
      {inSettings || (
        <label className='justify-self-start text-sm text-text-tertiary'>Due date</label>
      )}
      <div className='flex items-center gap-2'>
        {taskDueDate && (
          <button
            className={isOverDue ? 'text-red-500' : 'text-text-secondary'}
            onClick={() => setTaskDueDate('')}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        )}
        <DropDown
          toggler={
            <DropDown.Toggler>
              <span className={'text-sm ' + (isOverDue ? 'text-red-500' : 'text-text-secondary')}>
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
          <DropDown.Button
            onClick={() => handleAddDueDate('Today')}
            isCurrent={taskDueDate === today.toISOString().split('T')[0]}
          >
            <i className='fa-solid fa-calendar  text-text-tertiary'></i>
            <span className='text-start text-text-primary '>Today</span>
            <span className='text-text-tertiary'>
              {today.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          </DropDown.Button>
          <DropDown.Button
            onClick={() => handleAddDueDate('Tomorrow')}
            isCurrent={taskDueDate === tomorrow.toISOString().split('T')[0]}
          >
            <i className='fa-solid fa-calendar  text-text-tertiary'></i>
            <span className='text-start text-text-primary '>Tomorrow</span>
            <span className='text-text-tertiary'>
              {tomorrow.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>{' '}
          </DropDown.Button>

          <DropDown.NestedMenu
            toggler={
              <DropDown.Button isCurrent={isPicked && taskDueDate}>
                <i className='fa-solid fa-calendar  text-text-tertiary'></i>
                <span className='text-start text-text-primary '>
                  {isPicked ? taskDueDate : 'Pick a date'}
                </span>
                <i className='fa-solid fa-chevron-down text-text-tertiary  '></i>
              </DropDown.Button>
            }
            options={{ className: 'w-52', placement: 'bottom', shouldCloseOnClick: false }}
            togglerClassName='w-full'
          >
            <label className='text-text-primary '>
              <input
                type='date'
                className='w-full bg-transparent p-2 focus:outline-none'
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  handleAddDueDate(e.target.value);
                }}
              />
            </label>
          </DropDown.NestedMenu>
        </DropDown>
      </div>
    </>
  );
}
