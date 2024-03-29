import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { format, addDays, setDay } from 'date-fns';
import { Title } from '../Title';
import { Task } from './Task Components/Task';
import { AddTask } from './Task Components/AddTask';
import { UpcomingSkeleton } from '../../Skeletons';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useUpcomingTasks } from '../../../lib/react-query/queries';
import Error from '../../Common/Error';

const periods = [
  {
    title: 'Today',
    id: 'today',
    tasks: 'todayTasks',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    title: 'Tomorrow',
    id: 'tomorrow',
    tasks: 'tomorrowTasks',
    dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  },
  {
    title: 'This Week',
    id: 'thisWeek',
    tasks: 'thisWeekTasks',
    dueDate: (weeklyDueDate) => {
      const dueDay = dayMapping[weeklyDueDate];
      const dueDate = setDay(new Date(), dueDay);
      return format(dueDate, 'yyyy-MM-dd');
    },
  },
];
const dayMapping = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function Upcoming() {
  const { upcomingTasks, isLoading, error } = useUpcomingTasks();
  const wrapper = useRef(null);

  useEffect(() => {
    document.title = `I Do | Upcoming`;
  }, []);

  if (error) return <Error message={error.message} />;

  return (
    <>
      <Title title='Upcoming' count={upcomingTasks?.length} />

      {isLoading ? (
        <UpcomingSkeleton />
      ) : (
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
      )}
    </>
  );
}

function PeriodTasks({ title, period, parentRef, isToday }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { todayTasks, tomorrowTasks, thisWeekTasks } = useUpcomingTasks();
  const [parent] = useAutoAnimate({
    duration: 500,
  });
  const {
    dateAndTime: { weekStartsOn },
    tasks: { weeklyDueDate },
  } = useSelector((state) => state.settings.general);

  const tasks = {
    todayTasks,
    tomorrowTasks,
    thisWeekTasks,
  };
  useEffect(() => {
    if (isFullScreen) {
      parentRef.current.scrollTo(0, 0);
      parentRef.current.classList.replace('overflow-auto', 'overflow-hidden');
    } else {
      parentRef.current.classList.replace('overflow-hidden', 'overflow-auto');
    }
  }, [isFullScreen, parentRef]);

  return (
    <div
      className={
        'relative flex max-h-[400px] min-w-full flex-1 flex-col rounded-lg border  border-border bg-background-primary sm:min-w-[400px] ' +
        (isFullScreen ? 'full_screen ' : 'pb-4 ') +
        (isToday ? 'w-full basis-auto' : '')
      }
    >
      <h1 className='mb-3 border-b border-border p-4 pb-3 text-xl font-bold text-text-primary sm:text-2xl'>
        {title}
        {title === 'This Week' && (
          <span className='ml-3 text-xs text-text-tertiary'>
            {weekStartsOn === 1 ? 'Mon - Sun' : 'Sun - Sat'}
          </span>
        )}
      </h1>
      <i
        className={
          'fa-solid absolute right-3 top-5 cursor-pointer text-text-primary ' +
          (isFullScreen
            ? 'fa-down-left-and-up-right-to-center'
            : 'fa-up-right-and-down-left-from-center ')
        }
        onClick={() => setIsFullScreen((prev) => !prev)}
      ></i>

      <AddTask
        dueDate={period.title === 'This Week' ? period.dueDate(weeklyDueDate) : period.dueDate}
        className='mx-4 mb-3'
      />
      <ul
        className={
          'flex-1 space-y-2 overflow-auto overflow-x-hidden  px-4 ' +
          (isFullScreen ? '' : 'max-h-[280px]')
        }
        ref={parent}
      >
        {tasks[period.tasks]?.length > 0 ? (
          tasks[period.tasks]?.map((task) => <Task key={task.$id} task={task} />)
        ) : (
          <div className='  flex h-full flex-col items-center justify-center'>
            <h5 className='font-semibold text-text-secondary'>You don&apos;t have any tasks</h5>
            <p className=' text-xs font-medium text-text-tertiary'>Add a new task to get started</p>
          </div>
        )}
      </ul>
    </div>
  );
}
