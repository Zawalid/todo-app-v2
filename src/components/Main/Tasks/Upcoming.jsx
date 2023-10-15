import { useEffect, useRef, useState } from 'react';
import { Task } from './Task';
import { AddTask } from './AddTask';
import moment from 'moment';

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
export function Upcoming({
  todayTasks,
  tomorrowTasks,
  thisWeekTasks,
  onAdd,
  onOpen,
  onComplete,
  lists,
  tags,
}) {
  const wrapper = useRef(null);
  return (
    <div className='relative flex  h-full flex-wrap gap-5 overflow-auto pr-2 ' ref={wrapper}>
      {periods.map((period, i) => (
        <PeriodTasks
          key={period.id}
          title={period.title}
          period={period}
          onAdd={onAdd}
          todayTasks={todayTasks}
          tomorrowTasks={tomorrowTasks}
          thisWeekTasks={thisWeekTasks}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
          parentRef={wrapper}
          isToday={i === 0}
        />
      ))}
    </div>
  );
}

function PeriodTasks({
  title,
  todayTasks,
  tomorrowTasks,
  thisWeekTasks,
  period,
  onAdd,
  onOpen,
  onComplete,
  lists,
  tags,
  parentRef,
  isToday,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
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
        'relative  flex max-h-[400px] pb-4 min-w-[400px] flex-1 flex-col  rounded-lg border border-background-tertiary bg-background-primary ' +
        (isFullScreen ? 'full_screen ' : '') +
        (isToday ? 'w-full basis-auto' : '')
      }
    >
      <h1 className='mb-3 border-b p-4 pb-3 text-2xl font-bold text-text-primary'>
        {title}
        {title === 'This Week' && (
          <span className='ml-3 text-xs text-text-tertiary'>(Mon - Sun)</span>
        )}
      </h1>
      <i
        className={
          'fa-solid absolute right-3 top-5 cursor-pointer ' +
          (isFullScreen
            ? 'fa-down-left-and-up-right-to-center'
            : 'fa-up-right-and-down-left-from-center ')
        }
        onClick={() => setIsFullScreen((prev) => !prev)}
      ></i>

      <div className='flex mb-3 mx-4 items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <AddTask
          onAdd={(title) => {
            onAdd(title, period.dueDate);
          }}
        />
      </div>
      <ul
        className={' flex-1 space-y-2 overflow-auto  px-4 ' + (isFullScreen ? '' : 'max-h-[280px]')}
      >
        {tasks[period.tasks]?.length > 0 ? (
          tasks[period.tasks]?.map((task) => (
            <Task
              key={task.id}
              task={task}
              onOpen={() => onOpen(task)}
              onComplete={(isCompleted) => onComplete(task.id, isCompleted, task.period)}
              lists={lists}
              tags={tags}
              
            />
          ))
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


