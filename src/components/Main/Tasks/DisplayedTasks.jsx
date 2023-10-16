import Tippy from '@tippyjs/react';
import { AddTask } from './AddTask';
import { Task } from './Task';
import { TasksActions } from './TasksActions/TasksActions';
import { useEffect, useState } from 'react';
import { isTaskOverdue } from '../../../Utils';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate),
  highPriority: (task) => task.priority === '2',
  mediumPriority: (task) => task.priority === '1',
  lowPriority: (task) => task.priority === '0',
};

export function DisplayedTasks({
  onAdd,
  onOpen,
  onComplete,
  tasks,
  onClearAllTasks,
  lists,
  tags,
  condition,
  activeTab,
}) {
  const [filter, setFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState(tasks.filter((task) => condition(task)));
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState('cDate');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) => condition(task)).filter((task) => filtersConditions[filter](task)),
    );
  }, [tasks, filter, condition]);

  useEffect(() => {
    setFilter('all');
  }, [activeTab]);

  function handleClearAll() {
    onClearAllTasks(condition, filtersConditions[filter]);
    handleCloseModal();
  }
  function handleCloseModal() {
    setIsClearAllModalOpen(false);
  }

  return (
    <div className='relative flex h-full flex-col overflow-auto'>
      <div className='flex items-center gap-2'>
        <div className='flex  flex-1 items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
          <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
          <AddTask onAdd={onAdd} />
        </div>
        <Tippy
          content={
            <TasksActions
              filter={filter}
              onSelect={(e) => setFilter(e.target.value)}
              onClearAll={() => filteredTasks.length > 0 && setIsClearAllModalOpen(true)}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
            />
          }
          className=' rounded-lg  bg-background-primary shadow-md'
          trigger='click'
          interactive={true}
          arrow={false}
          placement='bottom'
          maxWidth='auto'
        >
          <button className='h-8 w-8  rounded-full bg-background-secondary text-text-tertiary'>
            <i className='fa-solid fa-ellipsis-v text-xl'></i>
          </button>
        </Tippy>
      </div>
      {tasks.filter((task) => condition(task)).length > 0 && (
        <>
          <ul className='mt-3 space-y-2 overflow-y-auto'>
            {[...filteredTasks]
              .filter((task) => condition(task))
              .sort((a, b) => {
                if (sortKey === 'cDate') {
                  return sortDirection === 'asc'
                    ? a.createdAt - b.createdAt
                    : b.createdAt - a.createdAt;
                }
                if (sortKey === 'dDate') {
                  return sortDirection === 'asc'
                    ? new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
                    : new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
                }
                if (sortKey === 'priority') {
                  return sortDirection === 'asc'
                    ? a.priority - b.priority
                    : b.priority - a.priority;
                }
                if (sortKey === 'title') {
                  return sortDirection === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
                }
              })
              .map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onOpen={() => onOpen(task)}
                  onComplete={(isCompleted) => onComplete(task.id, isCompleted)}
                  lists={lists}
                  tags={tags}
                />
              ))}
          </ul>
          {filteredTasks.filter((task) => condition(task)).length === 0 && (
            <div className='absolute top-1/2 flex w-full flex-col items-center justify-center gap-2'>
              <h2 className='text-2xl font-semibold text-text-secondary'>
                You don&apos;t have any{' '}
                {filter.includes('Priority') ? filter.replace('Priority', ' priority') : filter}{' '}
                tasks in this list
              </h2>
            </div>
          )}
        </>
      )}
      {tasks.filter((task) => condition(task)).length === 0 && (
        <div className='absolute top-1/2 flex w-full flex-col items-center justify-center gap-2'>
          <h2 className='text-2xl font-semibold text-text-secondary'>
            {activeTab === 'today'
              ? 'You have no tasks scheduled for today.'
              : activeTab === 'upcoming'
              ? "You don't have any upcoming tasks"
              : "You don't have any tasks in this list"}
          </h2>
          <p className=' font-medium text-text-tertiary'>Add a new task to get started</p>
        </div>
      )}

      {isClearAllModalOpen && (
        <div className='fixed left-0 top-0  z-[999999] grid h-full w-full place-content-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
          <div className=' rounded-lg bg-white p-4'>
            <h4 className='text-center  font-semibold text-text-secondary'>
              Are you sure you want to clear all tasks?
            </h4>
            <div className='mt-5 flex items-center justify-evenly'>
              <button
                className='rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-background-secondary'
                onClick={handleClearAll}
              >
                Clear All
              </button>
              <button
                className='rounded-lg bg-background-secondary px-3 py-1 text-sm font-semibold text-text-secondary'
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
