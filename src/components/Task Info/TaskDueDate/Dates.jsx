import { useEffect, useState } from 'react';

export function Dates({ isOpen, taskDueDate, onAdd, today, tomorrow }) {
  const [isPickerOpen, setIsPickerOpen] = useState();
  const [date, setDate] = useState(taskDueDate);

  useEffect(() => {
    isOpen || setIsPickerOpen(false);
  }, [isOpen]);

  return (
    <ul>
      <li
        className='flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-colors duration-300 hover:bg-background-secondary'
        onClick={() => onAdd('Today')}
      >
        <i className='fa-solid fa-calendar  text-text-tertiary'></i>
        <span className='flex-1 text-text-primary '>Today</span>
        <span className='text-text-tertiary'>
          {today.toLocaleDateString(undefined, { weekday: 'short' })}
        </span>
      </li>
      <li
        className='flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-colors duration-300 hover:bg-background-secondary'
        onClick={() => onAdd('Tomorrow')}
      >
        <i className='fa-solid fa-calendar  text-text-tertiary'></i>
        <span className='flex-1 text-text-primary '>Tomorrow</span>
        <span className='text-text-tertiary'>
          {tomorrow.toLocaleDateString(undefined, { weekday: 'short' })}
        </span>
      </li>
      <li
        className='relative flex cursor-pointer items-center justify-between gap-3 rounded-md  border-t border-t-background-secondary p-2 transition-colors duration-300 hover:bg-background-secondary'
        onClick={() => setIsPickerOpen(!isPickerOpen)}
      >
        <i className='fa-solid fa-calendar  text-text-tertiary'></i>
        <span className='flex-1 text-text-primary '>Pick a date</span>
        <i
          className={`fa-solid fa-chevron-${isPickerOpen ? 'up' : 'down'}  text-text-tertiary`}
        ></i>
      </li>
      <li
        className={
          'flex cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-md transition-all duration-300 hover:bg-background-secondary ' +
          (isPickerOpen ? 'h-[37px] p-2' : 'h-0 p-0')
        }
      >
        <input
          type='date'
          className='h-full w-full bg-transparent text-text-primary focus:outline-none'
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            onAdd(e.target.value);
          }}
        />
      </li>
    </ul>
  );
}
