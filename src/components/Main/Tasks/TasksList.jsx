import Tippy from '@tippyjs/react';
import { AddTask } from './AddTask';
import { Task } from './Task';
import { TasksActions } from './TasksActions/TasksActions';
import { useEffect, useState } from 'react';
import { isTaskOverdue } from '../../../utils/Moment';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../../../hooks/useTasks';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useDeleteMultiple from '../useDeleteMultiple';
import { usePagination } from '../usePagination';
import SelectionIcons from '../../Common/SelectionIcons';
import { useModal } from '../../Common/ConfirmationModal';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate) && !task.isCompleted,
  'high-priority': (task) => task.priority === '2',
  'medium-priority': (task) => task.priority === '1',
  'low-priority': (task) => task.priority === '0',
};

export default function TasksList({ dueDate, listId, condition, activeTab }) {
  const {
    tasks,
    handleDeleteAllTasks,
    handleDeleteMultipleTasks,
    selectedTasks,
    setSelectedTasks,
  } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchParams] = useSearchParams();
  const { Pagination, currentPage, rowsPerPage } = usePagination(filteredTasks.length);
  const { confirmDelete } = useModal();

  const { isSelecting, setIsSelecting, setIsDeleteMultipleModalOpen, Modal } = useDeleteMultiple({
    selectedItems: selectedTasks,
    setSelectedItems: setSelectedTasks,
    itemType: 'Task',
    onConfirm: () => {
      confirmDelete({
        message: `Are you sure you want to delete ${
          selectedTasks.length > 1 ? `${selectedTasks.length} tasks` : 'this task'
        }
?`,
        title: `Delete Task${selectedTasks.length > 1 ? 's' : ''} `,
        
        onConfirm: (deletePermanently) => {
          handleDeleteMultipleTasks(deletePermanently);
          setIsSelecting(false);
        },
      });
    },
  });
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) => condition(task)).filter((task) => filtersConditions[filter]?.(task)),
    );
  }, [tasks, filter, condition]);

  return (
    <div
      className='relative flex h-full flex-col gap-3 overflow-hidden  overflow-x-hidden'
      ref={parent}
    >
      <div className='flex items-center gap-2'>
        <AddTask dueDate={dueDate} listId={listId} disabled={isSelecting} className='flex-1 ' />
        <Actions
          {...{
            filteredTasks,
            isSelecting,
            setIsSelecting,
            allSelected: selectedTasks.length === filteredTasks.length,
            selectAll: () =>
              setSelectedTasks(
                filteredTasks.map((task) => {
                  return { $id: task.$id, title: task.title, listId: task.listId };
                }),
              ),
            unSelectAll: () => setSelectedTasks([]),
            deleteAll() {
              confirmDelete({
                message: `Are you sure you want to delete all tasks?`,
                title: `Delete All Tasks`,
                
                onConfirm: (deletePermanently) => {
                  handleDeleteAllTasks(condition, filtersConditions[filter], deletePermanently);                  setIsSelecting(false);
                },
              });
            },
            setIsDeleteMultipleModalOpen,
          }}
        />
      </div>
      {tasks.filter((task) => condition(task)).length > 0 ? (
        <>
          <List
            filteredTasks={filteredTasks}
            isSelecting={isSelecting}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />

          <NoFilteredTasksMessage
            filter={filter}
            activeTab={activeTab}
            filteredTasks={filteredTasks}
          />
        </>
      ) : (
        <NoTasksMessage activeTab={activeTab} />
      )}

      {filteredTasks.filter((task) => condition(task)).length > 0 && Pagination}
      {Modal}
    </div>
  );
}

function List({ filteredTasks, isSelecting, currentPage, rowsPerPage }) {
  const { selectedTasks, setSelectedTasks } = useTasks();
  const [searchParams] = useSearchParams();
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  const sortBy = searchParams.get('sortBy') || 'cDate';
  const direction = searchParams.get('direction') || 'asc';

  return (
    <ul className='mt-3 h-full space-y-2 overflow-y-auto overflow-x-hidden pr-3' ref={parent}>
      {filteredTasks
        .toSorted((a, b) => {
          if (sortBy === 'cDate') {
            return direction === 'asc'
              ? new Date(a.$createdAt) - new Date(b.$createdAt)
              : new Date(b.$createdAt) - new Date(a.$createdAt);
          }
          if (sortBy === 'dDate') {
            return direction === 'asc'
              ? new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
              : new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
          }
          if (sortBy === 'priority') {
            return direction === 'asc' ? a.priority - b.priority : b.priority - a.priority;
          }
          if (sortBy === 'title') {
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
  );
}

function Actions({
  filteredTasks,
  isSelecting,
  setIsSelecting,
  allSelected,
  selectAll,
  unSelectAll,
  deleteAll,
  setIsDeleteMultipleModalOpen,
}) {
  return (
    <SelectionIcons
      isSelecting={isSelecting}
      allSelected={allSelected}
      onSelect={() => {
        setIsSelecting(!isSelecting);
        setIsDeleteMultipleModalOpen(false);
      }}
      onSelectAll={selectAll}
      onUnSelectAll={unSelectAll}
    >
      <Tippy
        content={
          <TasksActions
            tasksLength={filteredTasks.length}
            onDeleteAll={() => {
              deleteAll();
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
        <button className='icon-button not-active'>
          <i className='fa-solid fa-ellipsis-v text-xl'></i>
        </button>
      </Tippy>
    </SelectionIcons>
  );
}

function NoFilteredTasksMessage({ filter, activeTab, filteredTasks }) {
  if (filteredTasks.length > 0) return null;

  return (
    <div className='absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2'>
      <h2 className='text-center text-xl font-semibold text-text-secondary sm:text-2xl'>
        You don&apos;t have any {filter?.includes('priority') ? filter?.replace('-', ' ') : filter}{' '}
        tasks {activeTab === 'today' ? 'scheduled for today' : !activeTab ? 'yet' : 'in this list'}
      </h2>
    </div>
  );
}

function NoTasksMessage({ activeTab }) {
  return (
    <div className='absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2'>
      <h2 className='text-center text-xl font-semibold text-text-secondary sm:text-2xl'>
        {activeTab === 'today'
          ? 'You have no tasks scheduled for today.'
          : activeTab === 'all'
          ? "You don't have any tasks yet"
          : "You don't have any tasks in this list"}
      </h2>
      <p className=' font-medium text-text-tertiary'>Add a new task to get started</p>
    </div>
  );
}
