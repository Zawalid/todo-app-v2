import { useEffect, useMemo, useState } from 'react';
import { Tag } from '../../Menu/Menu Tags/Tag';
import {
  checkIfToday,
  checkIfTomorrow,
  checkIfYesterday,
  isTaskOverdue,
} from '../../../utils/Moment';
import completedSoundFile from '../../../assets/completed.mp3';
import { useTasks, useLists, useTags } from '../../../hooks';
import { CheckBox } from '../../Common/CheckBox';
import { useLongPress } from 'use-long-press';
import TaskActions from './TaskActions';
import { toast } from 'sonner';
import { useDeleteTask } from './useDeleteTask';

const completedSound = new Audio(completedSoundFile);

const priorities = {
  1: {
    label: 'Low',
    color: '#FFD700',
  },
  2: {
    label: 'Medium',
    color: '#c0ac3a',
  },
  3: {
    label: 'High',
    color: '#ff0000',
  },
};

export function Task({
  task: {
    $id,
    title,
    isCompleted,
    dueDate,
    subtasks,
    tagsIds,
    priority,
    listId,
    $createdAt,
    $updatedAt,
  },
  onClick,
  isSelecting,
  isSelected,
}) {
  const [isTaskActionsOpen, setIsTaskActionsOpen] = useState(false);
  const [checked, setChecked] = useState(isCompleted);
  const { lists } = useLists();
  const { tasks, handleUpdateTask } = useTasks();
  const { handleOpenTask, handleCompleteTask } = useTasks();
  const isPassed = isTaskOverdue(dueDate);
  const bind = useLongPress(() => !isModalOpen && !isSelecting && setIsTaskActionsOpen(true), {
    detect: 'touch',
  });
  const { Modal, openModal, isModalOpen } = useDeleteTask($id);

  const listName = useMemo(() => lists?.find((l) => l?.$id === listId)?.title, [listId, lists]);
  const listColor = useMemo(() => lists?.find((l) => l?.$id === listId)?.color, [listId, lists]);

  const updatedLists = useMemo(
    () =>
      lists?.map((list) => ({
        id: list.$id,
        title: list.title,
        color: list.color,
        tasksLength: tasks?.filter((task) => task.listId === list.$id).length,
      })),
    [lists, tasks],
  );

  useEffect(() => {
    isCompleted !== checked && handleCompleteTask($id, checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li
      id='task'
      onClick={(e) => (isSelecting ? onClick() : e.target.closest('#task') && handleOpenTask($id))}
      {...bind()}
    >
      <button
        className={
          ' grid min-h-[49px] w-full select-none grid-cols-[20px_auto_20px] items-center gap-3 rounded-lg border-b border-zinc-200 px-3 py-2  text-start transition-all duration-500 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgb(228_228_231)] sm:px-5   ' +
          (checked ? 'bg-background-tertiary ' : 'bg-slate-50 ')
        }
      >
        <TaskCheckbox isSelecting={isSelecting} checked={checked} setChecked={setChecked} />
        <div className=' overflow-hidden'>
          <span
            className={
              'block truncate text-sm font-medium text-text-secondary ' +
              (checked ? 'line-through' : '')
            }
          >
            {title}
          </span>

          {[listName, dueDate, subtasks?.length > 0, tagsIds?.length > 0, priority !== 0].some(
            (c) => c,
          ) && (
            <div className='mt-2 max-h-[40px] flex overflow-auto flex-wrap items-center gap-y-3 gap-x-5'>
              <TaskDueDate dueDate={dueDate} isPassed={isPassed} checked={checked} />
              <TaskSubtasks subtasks={subtasks} />
              <TaskPriority priority={priority} />
              <TaskTags tagsIds={tagsIds} />
              <TaskList listId={listId} listName={listName} listColor={listColor} />
            </div>
          )}
        </div>
        <Icons
          isSelecting={isSelecting}
          isSelected={isSelected}
          isPassed={isPassed}
          checked={checked}
        />
        <TaskActions
          isOpen={isTaskActionsOpen}
          onClose={() => setIsTaskActionsOpen(false)}
          onDelete={() => (setIsTaskActionsOpen(false), openModal())}
          onCopy={() => (
            navigator.clipboard.writeText(title),
            toast.success('Copied to clipboard'),
            setIsTaskActionsOpen(false)
          )}
          date={{
            created: $createdAt,
            updated: $updatedAt,
          }}
          lists={updatedLists}
          onMove={(listId) => handleUpdateTask($id, { listId })}
        />
        {Modal}
      </button>
    </li>
  );
}

function TaskDueDate({ dueDate, isPassed, checked }) {
  if (!dueDate) return null;
  return (
    <div className='flex items-center gap-2'>
      <i
        className={
          'fas fa-calendar-alt  ' +
          (isPassed && !checked ? 'text-text-error' : 'text-text-tertiary')
        }
      ></i>
      <span
        className={
          'text-xs font-semibold ' +
          (isPassed && !checked ? 'text-text-error' : 'text-text-secondary')
        }
      >
        {checkIfToday(dueDate)
          ? 'Today'
          : checkIfTomorrow(dueDate)
          ? 'Tomorrow'
          : checkIfYesterday(dueDate)
          ? 'Yesterday'
          : dueDate}
      </span>
    </div>
  );
}

function TaskCheckbox({ isSelecting, checked, setChecked }) {
  return (
    <div className='flex'>
      <span
        className={
          'absolute cursor-grab text-text-tertiary transition-transform duration-500 ' +
          (isSelecting ? 'scale-1' : 'scale-0')
        }
      >
        <svg
          stroke='currentColor'
          width='20px'
          height='20px'
          fill='none'
          strokeWidth='0'
          viewBox='0 0 15 15'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z'
            fill='currentColor'
          ></path>
        </svg>
      </span>
      <CheckBox
        checked={checked}
        onChange={(e) => {
          setChecked(!checked);
          e.target.checked && completedSound.play();
        }}
        className={'transition-transform duration-500 ' + (isSelecting ? 'scale-0' : 'scale-1')}
      />
    </div>
  );
}

function TaskSubtasks({ subtasks }) {
  if (!subtasks?.length > 0) return null;
  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-2 rounded-sm bg-text-secondary px-2 py-[1px] text-xs font-semibold text-background-primary'>
        <span className='border-r pr-2'>{subtasks.length}</span>
        <span className='flex items-center gap-1'>
          {subtasks.filter((subtask) => JSON.parse(subtask).isCompleted).length}
          <i className='fas fa-check '></i>
        </span>
      </div>
      <span className='text-xs font-semibold text-text-secondary'>Subtasks</span>
    </div>
  );
}

function TaskTags({ tagsIds }) {
  const { tags } = useTags();
  if (!tagsIds?.length > 0) return null;
  return tagsIds.map((tagId) => {
    const tag = tags.find((t) => t.$id === tagId);
    if (tag)
      return (
        <Tag
          key={tag.$id}
          tag={tag}
          isMainTag={false}
          showDeleteButton={false}
          customClassName={'px-2 py-1 cursor-auto'}
        />
      );
  });
}

function TaskPriority({ priority }) {
  if (priority === 0) return null;
  return (
    <div className='flex items-center gap-2'>
      <i
        className='fas fa-triangle-exclamation text-lg'
        style={{
          color: priorities[priority].color,
        }}
      ></i>
      <span className='text-xs font-semibold text-text-secondary'>
        {priorities[priority].label}
      </span>
    </div>
  );
}

function TaskList({ listId, listName, listColor }) {
  if (!listId || listId === 'none') return null;
  return (
    <div className='grid grid-cols-[16px_auto] items-center gap-2 overflow-hidden'>
      <span className='h-4 w-4 rounded-sm' style={{ backgroundColor: listColor }}></span>
      <span className='truncate text-xs font-semibold text-text-secondary'>{listName}</span>
    </div>
  );
}

function Icons({ isSelecting, isSelected, isPassed, checked }) {
  return (
    <div className='flex gap-3'>
      {isPassed && !checked && (
        <i className='fa-solid  fa-triangle-exclamation text-lg text-text-error'></i>
      )}
      <span
        className={'transition-transform duration-500 ' + (isSelecting ? 'scale-1' : 'scale-0')}
      >
        {isSelected ? (
          <i className='fa-solid fa-circle-check text-lg text-primary'></i>
        ) : (
          <i className='fa-regular fa-circle text-lg text-text-tertiary'></i>
        )}
      </span>
    </div>
  );
}
