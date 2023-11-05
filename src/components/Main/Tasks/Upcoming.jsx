import { useRef } from 'react';
import moment from 'moment';
import { PeriodTasks } from './PeriodTasks';

const periods = [
  {
    title: 'Today',
    id: 'today',
    tasks: 'todayTasks',
    dueDate: moment().format('YYYY-MM-DD'),
  },
  {
    title: 'Tomorrow',
    id: 'tomorrow',
    tasks: 'tomorrowTasks',
    dueDate: moment().add(1, 'day').format('YYYY-MM-DD'),
  },
  {
    title: 'This Week',
    id: 'thisWeek',
    tasks: 'thisWeekTasks',
    dueDate: moment().endOf('week').format('YYYY-MM-DD'),
  },
];
export function Upcoming() {
  
  const wrapper = useRef(null);
  return (
    <div className='relative flex  h-full flex-wrap gap-5 overflow-auto pr-2 ' ref={wrapper}>
      {periods.map((period, i) => (
        <PeriodTasks
          key={period.id}
          title={period.title}
          period={period}
          parentRef={wrapper}
          isToday={i === 0}
        />
      ))}
    </div>
  );
}


