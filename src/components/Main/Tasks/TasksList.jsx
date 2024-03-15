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
import Error from '../../Common/Error';

const filtersConditions = {
  all: () => true,
  completed: (task) => task.isCompleted,
  uncompleted: (task) => !task.isCompleted,
  overdue: (task) => isTaskOverdue(task.dueDate) && !task.isCompleted,
  'high-priority': (task) => task.priority === 3,
  'medium-priority': (task) => task.priority === 2,
  'low-priority': (task) => task.priority === 1,
};

export default function TasksList({
  dueDate,
  listId,
  tasks,
  message,
  isOnlyCompletedTasks,
  error,
}) {
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

  useEffect(() => {
    setFilteredTasks(tasks.filter((task) => filtersConditions[filter]?.(task)));
  }, [tasks, filter]);

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

  if (error) return <Error title={error.title} message={error.message} />;

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
        <button className='icon-button not-active' disabled={filteredTasks.length === 0}>
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
      <SVG />
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
      <SVG />
      <h2 className='text-center text-xl font-semibold text-text-secondary sm:text-2xl'>
        {message.noTasks}
      </h2>
      <p className=' font-medium text-text-tertiary'>
        {message.description || 'Add a new task to get started'}
      </p>
    </div>
  );
}

function SVG() {
  const primaryColor = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--primary');

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      data-name='Layer 1'
      className='w-24'
      viewBox='0 0 647.63626 632.17383'
    >
      <path
        d='M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z'
        transform='translate(-276.18187 -133.91309)'
        fill='#f2f2f2'
      />
      <path
        d='M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z'
        transform='translate(-276.18187 -133.91309)'
        fill={primaryColor}
      />
      <path
        d='M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z'
        transform='translate(-276.18187 -133.91309)'
        fill={primaryColor}
      />
      <circle cx='190.15351' cy='24.95465' r='20' fill={primaryColor} />
      <circle cx='190.15351' cy='24.95465' r='12.66462' fill='#fff' />
      <path
        d='M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z'
        transform='translate(-276.18187 -133.91309)'
        fill='#e6e6e6'
      />
      <path
        d='M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z'
        transform='translate(-276.18187 -133.91309)'
        fill={primaryColor}
      />
      <path
        d='M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z'
        transform='translate(-276.18187 -133.91309)'
        fill={primaryColor}
      />
      <circle cx='433.63626' cy='105.17383' r='20' fill={primaryColor} />
      <circle cx='433.63626' cy='105.17383' r='12.18187' fill='#fff' />
    </svg>
  );
}
