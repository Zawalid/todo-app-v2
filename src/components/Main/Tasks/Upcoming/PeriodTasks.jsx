import { useEffect, useState } from 'react';
import { Task } from '../Task';
import { AddTask } from '../AddTask';
import { useTasks } from '../../../../hooks/useTasks';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export function PeriodTasks({ title, period, parentRef, isToday }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { handleAddTask, todayTasks, tomorrowTasks, thisWeekTasks } = useTasks();
  const [parent] = useAutoAnimate({
    duration: 500,
  });

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
        'relative  flex max-h-[400px] min-w-[400px] flex-1 flex-col rounded-lg  border border-zinc-200 bg-background-primary pb-4 ' +
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

      <div className='mx-4 mb-3 flex items-center gap-3 rounded-xl border border-zinc-200 px-5 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <AddTask
          onAdd={(title) => {
            const newTask = {
              title,
              note: '',
              dueDate: period.dueDate || '',
              listId: 'none',
              subtasks: [],
              isCompleted: false,
              tagsIds: [],
              priority: 0,
            };
            handleAddTask(newTask);
          }}
        />
      </div>
      <ul
        className={' flex-1 space-y-2 overflow-auto  px-4 ' + (isFullScreen ? '' : 'max-h-[280px]')}
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
