import Tippy from '@tippyjs/react';
import { AddTask } from './Task Components/AddTask';
import { Task } from './Task Components/Task';
import { TasksActions } from './TasksActions/TasksActions';
import { useEffect, useState } from 'react';
import { isTaskOverdue } from '../../../utils/Dates';
import { useSearchParams } from 'react-router-dom';
import useDeleteMultiple from '../useDeleteMultiple';
import { usePagination } from '../usePagination';
import SelectionIcons from '../../Common/SelectionIcons';
import { useModal } from '../../../hooks/useModal';
import { createPortal } from 'react-dom';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useDeleteTasks } from '../../../lib/react-query/mutations';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate) && !task.isCompleted,
  'high-priority': (task) => task.priority === 3,
  'medium-priority': (task) => task.priority === 2,
  'low-priority': (task) => task.priority === 1,
};

export default function TasksList({ dueDate, listId, tasks, message, isOnlyCompletedTasks }) {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchParams] = useSearchParams();
  const { Pagination, currentPage, rowsPerPage } = usePagination(filteredTasks.length);
  const { openModal: confirmDelete } = useModal();
  const { mutate: deleteAllTasks } = useDeleteTasks();

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
          const deletedTasks = selectedTasks.map((task) => task.$id);
          deleteAllTasks({ deleted: deletedTasks, deletePermanently });
          setIsSelecting(false);
        },
      });
    },
  });
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  const filter = searchParams.get('filter') || 'all';

  useEffect(
    () => setFilteredTasks(tasks.filter((task) => filtersConditions[filter]?.(task))),
    [tasks, filter],
  );

  const actionsProps = {
    filteredTasks: filteredTasks,
    isSelecting: isSelecting,
    setIsSelecting: setIsSelecting,
    allSelected: selectedTasks.length === filteredTasks.length,
    selectAll() {
      setSelectedTasks(
        filteredTasks.map((task) => {
          return { $id: task.$id, title: task.title, listId: task.listId };
        }),
      );
    },
    unSelectAll: () => setSelectedTasks([]),
    deleteAll() {
      confirmDelete({
        message: `Are you sure you want to delete all tasks?`,
        title: `Delete All Tasks`,
        onConfirm: (deletePermanently) => {
          const deletedTasks = tasks
            .filter((task) => filtersConditions[filter]?.(task))
            .map((task) => task.$id);
          deleteAllTasks({ deleted: deletedTasks, deletePermanently });
          setIsSelecting(false);
        },
      });
    },
    setIsDeleteMultipleModalOpen: setIsDeleteMultipleModalOpen,
    isOnlyCompletedTasks: isOnlyCompletedTasks,
  };

  return (
    <>
      <div
        className='relative flex h-full flex-col gap-3 overflow-hidden  overflow-x-hidden'
        ref={parent}
      >
        {isOnlyCompletedTasks || (
          <AddTask dueDate={dueDate} listId={listId} disabled={isSelecting} className='flex-1 ' />
        )}
        {createPortal(
          <Actions {...actionsProps} />,
          document.querySelector('#title') || document.body,
        )}

        <List
          filteredTasks={filteredTasks}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          isSelecting={isSelecting}
          selectedTasks={selectedTasks}
          setSelectedTasks={setSelectedTasks}
        />

        <NoFilteredTasksMessage
          filter={filter}
          message={message.noFilterPart}
          display={filteredTasks.length === 0 && tasks.length > 0}
        />

        <NoTasksMessage message={message} display={tasks.length === 0} />
      </div>
      {filteredTasks.length > 0 && Pagination}
      {Modal}
    </>
  );
}

function List({
  filteredTasks,
  isSelecting,
  currentPage,
  rowsPerPage,
  setSelectedTasks,
  selectedTasks,
}) {
  const [searchParams] = useSearchParams();
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  const sortBy = searchParams.get('sortBy') || 'cDate';
  const direction = searchParams.get('direction') || 'asc';

  return (
    <div className='h-full space-y-2  overflow-y-auto overflow-x-hidden' ref={parent}>
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
              onSelect={() => {
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
    </div>
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
  isOnlyCompletedTasks,
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
      disabled={filteredTasks.length === 0}
    >
      <Tippy
        content={
          <TasksActions
            tasksLength={filteredTasks.length}
            onDeleteAll={() => {
              deleteAll();
              setIsDeleteMultipleModalOpen(false);
            }}
            isOnlyCompletedTasks={isOnlyCompletedTasks}
          />
        }
        theme='light'
        trigger='click'
        interactive={true}
        arrow={false}
        placement='bottom'
        maxWidth='auto'
      >
        <button className='icon-button not-active'       disabled={filteredTasks.length === 0}
>
          <PiDotsThreeOutlineVerticalFill />
        </button>
      </Tippy>
    </SelectionIcons>
  );
}

function NoFilteredTasksMessage({ filter, message, display }) {
  if (!display) return null;

  return (
    <div className='absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2'>
      <h2 className='text-center text-xl font-semibold text-text-secondary sm:text-2xl'>
        You don&apos;t have any {filter?.includes('priority') ? filter?.replace('-', ' ') : filter}{' '}
        tasks {message}
      </h2>
    </div>
  );
}

function NoTasksMessage({ message, display }) {
  if (!display) return null;

  return (
    <div className='absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2'>
      <h2 className='text-center text-xl font-semibold text-text-secondary sm:text-2xl'>
        {message.noTasks}
      </h2>
      <p className=' font-medium text-text-tertiary'>
        {message.description || 'Add a new task to get started'}
      </p>
    </div>
  );
}
