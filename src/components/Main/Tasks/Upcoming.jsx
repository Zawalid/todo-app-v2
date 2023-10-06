import { useEffect, useRef, useState } from 'react';
import { AddTask } from './AddTask';
import { Task } from './Task';
import { TasksPeriod } from './TaskPeriod';

const periods = ['days', 'weeks', 'months', 'years'];

export function Upcoming({ tasks, onAdd, onOpen, onComplete, lists, tags }) {
  const wrapper = useRef(null);
  return (
    <div className='relative flex  h-full flex-wrap gap-5 overflow-auto pr-2 ' ref={wrapper}>
      {periods.map((period) => (
        <PeriodTasks
          key={period}
          period={period}
          tasks={tasks}
          onAdd={onAdd}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
          parentRef={wrapper}
        />
      ))}
    </div>
  );
}

function PeriodTasks({
  period,
  tasks,
  onAdd,
  onOpen,
  onComplete,
  lists,
  tags,
  parentRef,
  setTasksDate,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [count, setCount] = useState(0);

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
        'relative flex max-h-[400px] min-w-[400px] flex-1 flex-col overflow-auto rounded-lg border border-background-tertiary bg-background-primary p-4 pt-2  ' +
        (isFullScreen ? 'full_screen' : '')
      }
    >
      {/* <SmallTitle title={title} /> */}
      <TasksPeriod count={count} setCount={setCount} period={period} setTasksDate={setTasksDate} />
      {/* <i
        className={
          'fa-solid absolute right-3 top-5 cursor-pointer ' +
          (isFullScreen
            ? 'fa-down-left-and-up-right-to-center'
            : 'fa-up-right-and-down-left-from-center ')
        }
        onClick={() => setIsFullScreen((prev) => !prev)}
      ></i> */}
      <div className='flex items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <AddTask
          onAdd={(title) => {
            onAdd(title, 'today');
          }}
        />
      </div>

      {/* <ul className='mt-3 flex-1 space-y-2'>
        {tasks.get(period).length > 0 ? (
          tasks
            .get(period)
            .map((task, id) => (
              <Task
                key={task.id}
                task={task}
                onOpen={() => onOpen(task)}
                onComplete={(isCompleted) => onComplete(task.id, isCompleted, task.period)}
                lists={lists}
                tags={tags}
                isLast={id === tasks.get(period).length - 1}
              />
            ))
        ) : (
          <div className='  flex h-full flex-col items-center justify-center'>
            <h5 className='font-semibold text-text-secondary'>You don&apos;t have any tasks</h5>
            <p className=' text-xs font-medium text-text-tertiary'>Add a new task to get started</p>
          </div>
        )}
      </ul> */}
    </div>
  );
}
