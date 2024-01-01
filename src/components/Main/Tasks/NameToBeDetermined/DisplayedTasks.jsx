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
import { usePagination } from './usePagination';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate) && !task.isCompleted,
  highPriority: (task) => task.priority === '2',
  mediumPriority: (task) => task.priority === '1',
  lowPriority: (task) => task.priority === '0',
};

export default function DisplayedTasks({ onAdd, condition, activeTab }) {
  const {
    tasks,
    handleDeleteAllTasks,
    handleDeleteMultipleTasks,
    selectedTasks,
    setSelectedTasks,
  } = useTasks();
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] = useState(false);
  const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);
  const whichDelete = useRef(null);
  const [searchParams] = useSearchParams();
  const [parent] = useAutoAnimate({
    duration: 500,
  });
  const { Pagination, currentPage, rowsPerPage } = usePagination(filteredTasks.length);

  const filter = searchParams.get('filter') || 'all';
  const sort = searchParams.get('sort');
  const direction = searchParams.get('direction');

  // Filter tasks based on the selected filter
  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) => condition(task)).filter((task) => filtersConditions[filter]?.(task)),
    );
  }, [tasks, filter, condition]);

  // MultipleDeletionsModal and selectedTasks

  useEffect(() => {
    setIsSelecting(false);
  }, [activeTab]);

  useEffect(() => {
    selectedTasks.length > 0 && isSelecting
      ? setIsDeleteMultipleModalOpen(true)
      : setIsDeleteMultipleModalOpen(false);
  }, [selectedTasks, isSelecting]);

  useEffect(() => {
    !isDeleteMultipleModalOpen &&
      selectedTasks.length !== 0 &&
      !isSelecting &&
      setSelectedTasks([]);
  }, [isDeleteMultipleModalOpen, selectedTasks, isSelecting, setSelectedTasks]);

  return (
    <div className='relative flex h-full flex-col overflow-auto' ref={parent}>
      <div className='flex items-center gap-2'>
        <div className='flex  flex-1 items-center gap-3 rounded-xl border border-zinc-200 px-5 py-1'>
          <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
          <AddTask onAdd={onAdd} />
        </div>
        <div className='flex gap-3'>
          <button
            className='grid h-8 w-8 place-content-center rounded-full bg-background-primary text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
            onClick={() => {
              setIsSelecting(!isSelecting);
              setIsDeleteMultipleModalOpen(false);
            }}
          >
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 256 256'
              height='20px'
              width='20px'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M228,128a12,12,0,0,1-12,12H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128ZM128,76h88a12,12,0,0,0,0-24H128a12,12,0,0,0,0,24Zm88,104H128a12,12,0,0,0,0,24h88a12,12,0,0,0,0-24ZM79.51,39.51,56,63l-7.51-7.52a12,12,0,0,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,127l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,191l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Z'></path>
            </svg>{' '}
          </button>
          <Tippy
            content={
              <TasksActions
                tasksLength={filteredTasks.length}
                onDeleteAll={() => {
                  setIsDeletingModalOpen(true);
                  whichDelete.current = 'clear';
                  setIsDeleteMultipleModalOpen(false);
                }}
              />
            }
            theme='light'
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
          <ul className='mt-3 h-full overflow-x-hidden space-y-2 overflow-y-auto pr-3' ref={parent}>
            {filteredTasks
              .toSorted((a, b) => {
                if (sort === 'cDate') {
                  return direction === 'asc'
                    ? new Date(a.$createdAt) - new Date(b.$createdAt)
                    : new Date(b.$createdAt) - new Date(a.$createdAt);
                }
                if (sort === 'dDate') {
                  return direction === 'asc'
                    ? new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
                    : new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
                }
                if (sort === 'priority') {
                  return direction === 'asc' ? a.priority - b.priority : b.priority - a.priority;
                }
                if (sort === 'title') {
                  return direction === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
                }
              })
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((task) => {
                const { $id, title, listId } = task;
                const isSelected = selectedTasks.filter((t) => t.$id === $id).length > 0;
                return (
                  <Task
                    key={task.$id}
                    task={task}
                    onClick={() => {
                      setSelectedTasks((prev) => {
                        if (isSelected) return prev.filter((t) => t.$id !== $id);
                        else return [...prev, { $id, title, listId }];
                      });
                    }}
                    isSelecting={isSelecting}
                    isSelected={isSelected}
                  />
                );
              })}
          </ul>
          {filteredTasks.length === 0 && (
            <div className='absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2'>
              <h2 className='text-center text-2xl font-semibold text-text-secondary'>
                You don&apos;t have any{' '}
                {filter?.includes('Priority') ? filter?.replace('Priority', ' priority') : filter}{' '}
                tasks{' '}
                {activeTab === 'today'
                  ? 'scheduled for today'
                  : !activeTab
                  ? 'yet'
                  : 'in this list'}
              </h2>
            </div>
          )}
        </>
      )}
      {tasks.filter((task) => condition(task)).length === 0 && (
        <div className='absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2'>
          <h2 className='text-center text-2xl font-semibold text-text-secondary'>
            {activeTab === 'today'
              ? 'You have no tasks scheduled for today.'
              : activeTab === 'all'
              ? "You don't have any tasks yet"
              : "You don't have any tasks in this list"}
          </h2>
          <p className=' font-medium text-text-tertiary'>Add a new task to get started</p>
        </div>
      )}
      {isDeletingModalOpen && (
        <ConfirmationModal
          sentence={`Are you sure you want to ${
            whichDelete.current === 'selected'
              ? `delete ${
                  selectedTasks.length > 1 ? `${selectedTasks.length} tasks` : 'this task'
                } `
              : 'delete all tasks?'
          } `}
          confirmText={whichDelete.current === 'selected' ? 'Delete' : 'Delete All'}
          onConfirm={() => {
            setIsDeletingModalOpen(false);
            whichDelete.current === 'selected'
              ? handleDeleteMultipleTasks(deletePermanently)
              : handleDeleteAllTasks(condition, filtersConditions[filter], deletePermanently);
            if (whichDelete.current === 'selected') {
              setIsSelecting(false);
              setIsDeleteMultipleModalOpen(false);
            }
          }}
          onCancel={() => setIsDeletingModalOpen(false)}
          element='Tasks'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
      <MultipleDeletionsModal
        isOpen={isDeleteMultipleModalOpen}
        onConfirm={() => {
          setIsDeletingModalOpen(true);
          whichDelete.current = 'selected';
        }}
        onClose={() => {
          setIsDeleteMultipleModalOpen(false);
          setIsSelecting(false);
        }}
        selectedTasksNumber={selectedTasks.length}
      />
      {filteredTasks.filter((task) => condition(task)).length > 0 && Pagination}
    </div>
  );
}
