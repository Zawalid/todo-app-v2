import { useEffect, useRef, useState } from 'react';
import { AddTask } from './AddTask';
import { Task } from './Task';
import { TasksPeriod } from './TaskPeriod';

const periods = ['days', 'weeks', 'months', 'years'];

export function Upcoming({
  tasks,
  onAdd,
  onOpen,
  onComplete,
  lists,
  tags,
  tasksDate,
  setTasksDate,
}) {
  const wrapper = useRef(null);
  return (
    <div className='relative flex  h-full flex-wrap gap-5 overflow-auto pr-2 ' ref={wrapper}>
      {periods.map((period) => (
        <Period
          key={period}
          period={period}
          tasks={tasks}
          onAdd={onAdd}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
          parentRef={wrapper}
          tasksDate={tasksDate}
          setTasksDate={setTasksDate}
        />
      ))}
    </div>
  );
}

function Period({ period, tasks, onAdd, onOpen, onComplete, lists, tags, parentRef }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tasksDate, setTasksDate] = useState(new Date());

  useEffect(() => {
    if (isFullScreen) {
      parentRef.current.scrollTo(0, 0);
      parentRef.current.classList.replace('overflow-auto', 'overflow-hidden');
    } else {
      parentRef.current.classList.replace('overflow-hidden', 'overflow-auto');
    }
  }, [isFullScreen, parentRef]);

  function getPeriodTasks(condition) {
    return (
      <PeriodTasks
        tasks={tasks}
        lists={lists}
        tags={tags}
        onOpen={onOpen}
        onComplete={onComplete}
        tasksDate={tasksDate}
        condition={condition}
        isFullScreen={isFullScreen}
      />
    );
  }
  return (
    <div
      className={
        'relative flex  min-w-[400px] flex-1 flex-col  rounded-lg border border-background-tertiary bg-background-primary p-4 pt-2  ' +
        (isFullScreen ? 'full_screen' : '')
      }
    >
      <TasksPeriod period={period} setTasksDate={setTasksDate} />
      <i
        className={
          'fa-solid absolute bottom-1 right-1 cursor-pointer text-text-secondary ' +
          (isFullScreen
            ? 'fa-down-left-and-up-right-to-center'
            : 'fa-up-right-and-down-left-from-center ')
        }
        onClick={() => setIsFullScreen((prev) => !prev)}
      ></i>
      <div className='flex items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <AddTask
          onAdd={(title) => {
            onAdd(title, tasksDate);
          }}
        />
      </div>

      {period === 'days' &&
        getPeriodTasks(
          (task) =>
            new Date(task.date).getDate() === tasksDate.getDate() &&
            new Date(task.date).getMonth() === tasksDate.getMonth() &&
            new Date(task.date).getFullYear() === tasksDate.getFullYear(),
        )}
      {period === 'weeks' &&
        getPeriodTasks((task) => {
          const startOfWeek = new Date(tasksDate);
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6);

          return new Date(task.date) >= startOfWeek && new Date(task.date) <= endOfWeek;
        })}
      {period === 'months' &&
        getPeriodTasks(
          (task) =>
            new Date(task.date).getMonth() === tasksDate.getMonth() &&
            new Date(task.date).getFullYear() === tasksDate.getFullYear(),
        )}
      {period === 'years' &&
        getPeriodTasks((task) => new Date(task.date).getFullYear() === tasksDate.getFullYear())}
    </div>
  );
}

function PeriodTasks({ tasks, lists, tags, onOpen, onComplete, condition, isFullScreen }) {
  const displayTasks = tasks.filter((task) => condition(task));
  return (
    <>
      {displayTasks.length === 0 ? (
        <div className='mt-3  flex h-full flex-col items-center justify-center'>
          <h5 className='font-semibold text-text-secondary'>You don&apos;t have any tasks</h5>
          <p className=' text-xs font-medium text-text-tertiary'>Add a new task to get started</p>
        </div>
      ) : (
        <ul
          className={
            'mt-3 flex-1 space-y-2 overflow-auto  pr-2 ' + (isFullScreen ? '' : 'max-h-[280px]')
          }
        >
          {displayTasks.map((task, id) => (
            <Task
              key={task.id}
              task={task}
              onOpen={() => onOpen(task)}
              onComplete={(isCompleted) => onComplete(task.id, isCompleted, task.period)}
              lists={lists}
              tags={tags}
              isLast={id === displayTasks.length - 1}
            />
          ))}
        </ul>
      )}
    </>
  );
}
