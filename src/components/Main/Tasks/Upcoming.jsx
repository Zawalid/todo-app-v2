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

function Period({
  period,
  tasks,
  onAdd,
  onOpen,
  onComplete,
  lists,
  tags,
  parentRef,
  tasksDate,
  setTasksDate,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isFullScreen) {
      parentRef.current.scrollTo(0, 0);
      parentRef.current.classList.replace('overflow-auto', 'overflow-hidden');
    } else {
      parentRef.current.classList.replace('overflow-hidden', 'overflow-auto');
    }
  }, [isFullScreen, parentRef]);

  const todayTasks = tasks?.filter(
    (task) => new Date(task.date).toLocaleDateString() === new Date().toLocaleDateString(),
  );
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
      />
    );
  }
  return (
    <div
      className={
        'relative flex max-h-[420px] min-w-[400px] flex-1 flex-col overflow-auto rounded-lg border border-background-tertiary bg-background-primary p-4 pt-2  ' +
        (isFullScreen ? 'full_screen' : '')
      }
    >
      <TasksPeriod period={period} setTasksDate={setTasksDate} />
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

      {period === 'days' &&
        getPeriodTasks(
          (task) =>
            new Date(task.date).getDate() === tasksDate.getDate() &&
            new Date(task.date).getMonth() === tasksDate.getMonth() &&
            new Date(task.date).getFullYear() === tasksDate.getFullYear(),
        )}
      {period === 'weeks' &&
        getPeriodTasks(
          (task) =>
            new Date(task.date) >=
              new Date(
                new Date(tasksDate).setDate(tasksDate.getDate() - tasksDate.getDay()),
              ).setHours(0, 0, 0, 0) &&
            new Date(task.date) <=
              new Date(
                new Date(tasksDate).setDate(tasksDate.getDate() - tasksDate.getDay() + 6),
              ).setHours(0, 0, 0, 0),
        )}
      {period === 'months' &&
        getPeriodTasks(
          (task) =>
            new Date(task.date).getMonth() === tasksDate.getMonth() &&
            new Date(task.date).getFullYear() === tasksDate.getFullYear(),
        )}
      {period === 'years' &&
        getPeriodTasks((task) => new Date(task.date).getFullYear() === tasksDate.getFullYear())}

      {/* 
      <ul className='mt-3 flex-1 space-y-2 '>
        {tasks.map((task, id) => {
          const taskComponent = (
            <Task
              key={task.id}
              task={task}
              onOpen={() => onOpen(task)}
              onComplete={(isCompleted) => onComplete(task.id, isCompleted, task.period)}
              lists={lists}
              tags={tags}
              isLast={id === todayTasks.length - 1}
            />
          );

          const startOfWeek = new Date(tasksDate);
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6);

          switch (period) {
            case 'days':
              return (
                new Date(task.date).getDate() === tasksDate.getDate() &&
                new Date(task.date).getMonth() === tasksDate.getMonth() &&
                new Date(task.date).getFullYear() === tasksDate.getFullYear() &&
                taskComponent
              );
            case 'weeks':
              return (
                new Date(task.date) >= startOfWeek &&
                new Date(task.date) <= endOfWeek &&
                taskComponent
              );
            case 'months':
              return (
                new Date(task.date).getMonth() === tasksDate.getMonth() &&
                new Date(task.date).getFullYear() === tasksDate.getFullYear() &&
                taskComponent
              );
            case 'years':
              return new Date(task.date).getFullYear() === tasksDate.getFullYear() && taskComponent;
            default:
              return taskComponent;
          }
        })}

        <div className='  flex h-full flex-col items-center justify-center'>
            <h5 className='font-semibold text-text-secondary'>You don&apos;t have any tasks</h5>
            <p className=' text-xs font-medium text-text-tertiary'>Add a new task to get started</p>
          </div>
      </ul> */}
    </div>
  );
}

function PeriodTasks({ tasks, lists, tags, onOpen, onComplete, tasksDate, condition }) {
  return (
    <ul className='mt-3 flex-1 space-y-2 '>
      {tasks.map((task, id) => {
        if (condition(task))
          return (
            <Task
              key={task.id}
              task={task}
              onOpen={() => onOpen(task)}
              onComplete={(isCompleted) => onComplete(task.id, isCompleted, task.period)}
              lists={lists}
              tags={tags}
            />
          );
      })}
    </ul>
  );
}
