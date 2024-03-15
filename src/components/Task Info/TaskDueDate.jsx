import { useState } from 'react';
import { isTaskOverdue } from '../../utils/Dates';
import { DropDown } from '../Common/DropDown';
import { PiCalendarBold, PiX } from 'react-icons/pi';
import { IoChevronDownOutline } from 'react-icons/io5';
import { useFormatDateAndTime } from '../../hooks/useFormatDateAndTime';

export function TaskDueDate({ taskDueDate, setTaskDueDate }) {
  const [date, setDate] = useState(taskDueDate);
  const format = useFormatDateAndTime();
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
  }

  return (
    <>
      <label className='justify-self-start text-sm text-text-tertiary'>Due date</label>

      <div className='flex items-center gap-2'>
        {taskDueDate && (
          <button
            className={isOverDue ? 'text-red-500' : 'text-text-secondary'}
            onClick={() => setTaskDueDate('')}
          >
            <PiX />
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
              <PiCalendarBold />
            </DropDown.Toggler>
          }
          options={{ className: 'w-52', shouldCloseOnClick: false }}
        >
          <DropDown.Button
            onClick={() => handleAddDueDate('Today')}
            isCurrent={taskDueDate === today.toISOString().split('T')[0]}
          >
            <span>Today</span>
            <span className='text-end text-text-tertiary'>
              {today.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          </DropDown.Button>
          <DropDown.Button
            onClick={() => handleAddDueDate('Tomorrow')}
            isCurrent={taskDueDate === tomorrow.toISOString().split('T')[0]}
          >
            <span>Tomorrow</span>
            <span className='text-end text-text-tertiary'>
              {tomorrow.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>{' '}
          </DropDown.Button>

          <DropDown.NestedMenu
            toggler={
              <DropDown.Button isCurrent={isPicked && taskDueDate}>
                <span className='text-start'>
                  {isPicked ? format(taskDueDate, false) : 'Pick a date'}
                </span>
                <IoChevronDownOutline className='absolute right-2' />
              </DropDown.Button>
            }
            options={{ className: 'w-52', placement: 'bottom', shouldCloseOnClick: false }}
            togglerClassName='w-full relative'
          >
            <label className='text-text-primary '>
              <input
                type='date'
                className='w-full bg-transparent  focus:outline-none'
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
