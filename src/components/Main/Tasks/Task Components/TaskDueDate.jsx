import {
  checkIfToday,
  checkIfTomorrow,
  checkIfYesterday
} from '../../../../utils/Dates';
import { PiCalendarBold } from 'react-icons/pi';
import { useFormatDateAndTime } from '../../../../hooks/useFormatDateAndTime';

export function TaskDueDate({ dueDate, isPassed, checked }) {
  const format = useFormatDateAndTime();

  if (!dueDate) return null;
  return (
    <div className='flex items-center gap-2'>
      <PiCalendarBold
        className={'fas fa-calendar-alt  ' + (isPassed && !checked ? 'text-red-500' : 'text-text-tertiary')} />
      <span
        className={'text-xs font-semibold ' + (isPassed && !checked ? 'text-red-500' : 'text-text-secondary')}
      >
        {checkIfToday(dueDate)
          ? 'Today'
          : checkIfTomorrow(dueDate)
            ? 'Tomorrow'
            : checkIfYesterday(dueDate)
              ? 'Yesterday'
              : format(dueDate, false)}
      </span>
    </div>
  );
}
