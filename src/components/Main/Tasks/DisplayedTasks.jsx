import Tippy from '@tippyjs/react';
import { AddTask } from './AddTask';
import { Task } from './Task';
import { TasksActions } from './TasksActions/TasksActions';
import { useEffect, useState } from 'react';
import { isTaskOverdue } from '../../../utils/Moment';
import { ConfirmationModal } from '../../ConfirmationModal';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../../../hooks/useTasks';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate) && !task.isCompleted,
  highPriority: (task) => task.priority === '2',
  mediumPriority: (task) => task.priority === '1',
  lowPriority: (task) => task.priority === '0',
};

export function DisplayedTasks({ onAdd, condition, activeTab }) {
  const { tasks, handleClearAllTasks } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterParam = searchParams.get('filter');
  const sortParam = searchParams.get('sort');
  const dirParam = searchParams.get('dir');

  const [filter, setFilter] = useState(filterParam || !filtersConditions[filterParam] || 'all');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState(sortParam || 'cDate');
  const [sortDirection, setSortDirection] = useState(dirParam || 'asc');

  useEffect(() => {
    filterParam && setFilter(filterParam);
    if (!filtersConditions[filterParam]) {
      setFilter('all');
      setSearchParams('');
    }
  }, [filterParam, setSearchParams]);

  useEffect(() => {
    const sortKeys = ['cDate', 'dDate', 'title', 'priority'];
    if ((sortKey === 'cDate' && sortDirection === 'asc') || !sortKeys.includes(sortKey))
      return setSearchParams(filter === 'all' ? '' : { filter });

    sortKeys.includes(sortKey) &&
      setSearchParams(
        filter === 'all'
          ? { sort: sortKey, dir: sortDirection }
          : { filter, sort: sortKey, dir: sortDirection },
      );
  }, [sortKey, sortDirection, setSearchParams, filter]);

  useEffect(() => {
    setFilter('all');
    setSortKey('cDate');
    setSortDirection('asc');
    setSearchParams('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) => condition(task)).filter((task) => filtersConditions[filter]?.(task)),
    );
  }, [tasks, filter, condition]);

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
              onSelect={(e) => {
                setFilter(e.target.value);
                setSearchParams({ filter: e.target.value });
              }}
              onClearAll={() => setIsClearAllModalOpen(true)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              tasksLength={filteredTasks.length}
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
                    ? new Date(a.$createdAt) - new Date(b.$createdAt)
                    : new Date(b.$createdAt) - new Date(a.$createdAt);
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
                <Task key={task.$id} task={task} />
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
              : activeTab === 'all'
              ? "You don't have any tasks yet"
              : "You don't have any tasks in this list"}
          </h2>
          <p className=' font-medium text-text-tertiary'>Add a new task to get started</p>
        </div>
      )}

      {isClearAllModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to clear all tasks?'
          confirmText='Clear All'
          onConfirm={async () => {
            setIsClearAllModalOpen(false);
            await handleClearAllTasks(condition, filtersConditions[filter]);
          }}
          onCancel={() => setIsClearAllModalOpen(false)}
          element='Tasks'
        />
      )}
    </div>
  );
}
