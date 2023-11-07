import Tippy from '@tippyjs/react';
import { AddTask } from '../AddTask';
import { Task } from '../Task';
import { TasksActions } from './TasksActions/TasksActions';
import { useEffect, useRef, useState } from 'react';
import { isTaskOverdue } from '../../../../utils/Moment';
import { ConfirmationModal } from '../../../Common/ConfirmationModal';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../../../../hooks/useTasks';
import { MultipleDeletionsModal } from './MultipleDeletionsModal';

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
  const { tasks, handleClearAllTasks, selectedTasks, setSelectedTasks } = useTasks();
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const whichDelete = useRef(null);

  const filterParam = searchParams.get('filter');
  const sortParam = searchParams.get('sort');
  const dirParam = searchParams.get('dir');

  const [filter, setFilter] = useState(filterParam || (!filtersConditions[filterParam] && 'all'));
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

  useEffect(() => {
    selectedTasks.length > 0
      ? setIsDeleteMultipleModalOpen(true)
      : setIsDeleteMultipleModalOpen(false);
  }, [selectedTasks]);

  useEffect(() => {
    if (!isDeleteMultipleModalOpen) {
      setIsSelecting(false);
      setSelectedTasks([]);
    }
  }, [isDeleteMultipleModalOpen,setSelectedTasks]);

  return (
    <div className='relative flex h-full flex-col overflow-auto'>
      <div className='flex items-center gap-2'>
        <div className='flex  flex-1 items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
          <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
          <AddTask onAdd={onAdd} />
        </div>
        <div className='flex gap-3'>
          <button
            className='h-8 w-8 rounded-full bg-background-primary text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
            onClick={() => {
              setIsSelecting(!isSelecting);
              setIsDeleteMultipleModalOpen(false);
            }}
          >
            <i className='fa-solid fa-check-double text-lg'></i>{' '}
          </button>
          <Tippy
            content={
              <TasksActions
                filter={filter}
                onSelect={(e) => {
                  setFilter(e.target.value);
                  setSearchParams({ filter: e.target.value });
                }}
                onClearAll={() => {
                  setIsClearAllModalOpen(true);
                  whichDelete.current = 'clear';
                  setIsDeleteMultipleModalOpen(false);
                }}
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
            <button className='h-8 w-8 rounded-full bg-background-primary text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'>
              <i className='fa-solid fa-ellipsis-v text-xl'></i>
            </button>
          </Tippy>
        </div>
      </div>
      {tasks.filter((task) => condition(task)).length > 0 && (
        <>
          <ul className='mt-3 h-full space-y-2 overflow-y-auto pr-3'>
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
                <Task key={task.$id} task={task} isSelecting={isSelecting} />
              ))}
          </ul>
          {filteredTasks.filter((task) => condition(task)).length === 0 && (
            <div className='absolute top-1/2 flex w-full flex-col items-center justify-center gap-2'>
              <h2 className='text-2xl font-semibold text-text-secondary'>
                You don&apos;t have any
                {filter?.includes('Priority') ? filter?.replace('Priority', ' priority') : filter}
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
          sentence={`Are you sure you want to ${
            whichDelete.current === 'selected'
              ? `delete ${
                  selectedTasks.length > 1 ? `${selectedTasks.length} tasks` : 'this task'
                } `
              : 'clear all tasks?'
          } `}
          confirmText={whichDelete.current === 'selected' ? 'Delete' : 'Clear All'}
          onConfirm={() => {
            setIsClearAllModalOpen(false);
            handleClearAllTasks(
              condition,
              filtersConditions[filter],
              deletePermanently,
              whichDelete.current === 'selected',
            );
            if (whichDelete.current === 'selected') {
              setIsSelecting(false);
              setIsDeleteMultipleModalOpen(false);
            }
          }}
          onCancel={() => setIsClearAllModalOpen(false)}
          element='Tasks'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
      <MultipleDeletionsModal
        isOpen={isDeleteMultipleModalOpen}
        onConfirm={() => {
          setIsClearAllModalOpen(true);
          whichDelete.current = 'selected';
        }}
        onClose={() => setIsDeleteMultipleModalOpen(false)}
        selectedTasksNumber={selectedTasks.length}
      />
    </div>
  );
}


