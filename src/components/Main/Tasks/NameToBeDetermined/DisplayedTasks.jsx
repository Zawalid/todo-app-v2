import Tippy from '@tippyjs/react';
import { AddTask } from '../AddTask';
import { Task } from '../Task';
import { TasksActions } from './TasksActions/TasksActions';
import { useEffect, useReducer, useRef, useState } from 'react';
import { isTaskOverdue } from '../../../../utils/Moment';
import { ConfirmationModal } from '../../../Common/ConfirmationModal';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../../../../hooks/useTasks';
import { MultipleDeletionsModal } from './MultipleDeletionsModal';
import { Pagination } from './Pagination';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate) && !task.isCompleted,
  highPriority: (task) => task.priority === '2',
  mediumPriority: (task) => task.priority === '1',
  lowPriority: (task) => task.priority === '0',
};

const paginationState = {
  currentPage: 1,
  rowsPerPage: 10,
  disabledButton: 'previous',
};
function paginationReducer(state, action) {
  switch (action.type) {
    case 'NEXT_PAGE':
      return { ...state, currentPage: state.currentPage + 1 };
    case 'PREVIOUS_PAGE':
      return { ...state, currentPage: state.currentPage - 1 };
    case 'CHANGE_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, currentPage: 1 };
    case 'DISABLE_BUTTON':
      return { ...state, disabledButton: action.payload };
    default:
      throw new Error(
        `Unknown action type: ${action.type}. Make sure to add the action type to the reducer.`,
      );
  }
}

export function DisplayedTasks({ onAdd, condition, activeTab }) {
  const { tasks, handleClearAllTasks, selectedTasks, setSelectedTasks } = useTasks();
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [pagination, dispatch] = useReducer(paginationReducer, paginationState);
  const whichDelete = useRef(null);
  const [searchParams] = useSearchParams();

  const filter = searchParams.get('filter') || 'all';
  const sort = searchParams.get('sort');
  const direction = searchParams.get('direction');

  // Filter tasks based on the selected filter
  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) => condition(task)).filter((task) => filtersConditions[filter]?.(task)),
    );
  }, [tasks, filter, condition]);

  // Sort tasks based on the selected sort and direction
  useEffect(() => {
    setFilteredTasks((prev) => {
      const tasks = [...prev];
      tasks.sort((a, b) => {
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
      });
      return tasks;
    });
  }, [sort, direction]);

  // MultipleDeletionsModal and selectedTasks
  useEffect(() => {
    selectedTasks.length > 0 && isSelecting
      ? setIsDeleteMultipleModalOpen(true)
      : setIsDeleteMultipleModalOpen(false);
  }, [selectedTasks, isSelecting]);
  useEffect(() => {
    !isDeleteMultipleModalOpen && setSelectedTasks([]);
  }, [isDeleteMultipleModalOpen, setSelectedTasks]);

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
                tasksLength={filteredTasks.length}
                onClearAll={() => {
                  setIsClearAllModalOpen(true);
                  whichDelete.current = 'clear';
                  setIsDeleteMultipleModalOpen(false);
                }}
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
              .slice(
                (pagination.currentPage - 1) * pagination.rowsPerPage,
                pagination.currentPage * pagination.rowsPerPage,
              )
              .map((task) => (
                <Task key={task.$id} task={task} isSelecting={isSelecting} />
              ))}
          </ul>
          {filteredTasks.length === 0 && (
            <div className='absolute top-1/2 flex w-full flex-col items-center justify-center gap-2'>
              <h2 className='text-center text-2xl font-semibold text-text-secondary'>
                You don&apos;t have any{' '}
                {filter?.includes('Priority') ? filter?.replace('Priority', ' priority') : filter}{' '}
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
        onClose={() => {
          setIsDeleteMultipleModalOpen(false);
          setIsSelecting(false);
        }}
        selectedTasksNumber={selectedTasks.length}
      />
      {filteredTasks.filter((task) => condition(task)).length > 0 && (
        <Pagination
          pagination={pagination}
          tasksLength={filteredTasks.length}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
