import { useEffect, useMemo, useState } from 'react';
import { useLongPress } from 'use-long-press';
import { Tag } from '../../../Menu/Menu Tags/Tag';
import {
  checkIfToday,
  checkIfTomorrow,
  checkIfYesterday,
  isTaskOverdue,
} from '../../../../utils/Dates';
import { useTasks, useLists, useTags } from '../../../../hooks';
import { CheckBox } from '../../../Common/CheckBox';
import TaskActions from './TaskActions';
import CustomTippy from '../../../Common/CustomTippy';
import { useModal } from '../../../../hooks/useModal';
import { copyToClipBoard } from '../../../../utils/helpers';

import completedSoundFile from '../../../../assets/completed.mp3';

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
    note,
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
  const { tasks, handleAddTask, handleUpdateTask } = useTasks();
  const { handleOpenTask, handleCompleteTask, handleDeleteTask } = useTasks();
  const { openModal : confirmDelete , isModalOpen } = useModal();
  const isPassed = isTaskOverdue(dueDate);
  const bind = useLongPress(() => !isModalOpen && !isSelecting && setIsTaskActionsOpen(true), {
    detect: 'touch',
  });

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
          ' grid min-h-[49px] w-full transition-transform duration-300 select-none grid-cols-[20px_auto] items-center gap-3 rounded-lg border border-border px-3 py-2  text-start   hover:translate-y-1  sm:px-5   ' +
          (checked ? 'bg-background-tertiary ' : '')
        }
      >
        <TaskCheckbox
          checked={checked}
          setChecked={setChecked}
          isSelecting={isSelecting}
          isSelected={isSelected}
        />
        <div className=' overflow-hidden'>
          <span
            className={
              'block truncate text-sm font-medium text-text-secondary ' +
              (checked ? 'line-through' : '')
            }
          >
            {title}
          </span>
          <div className='flex items-center justify-between gap-5'>
            {[listName, dueDate, subtasks?.length > 0, tagsIds?.length > 0, priority !== 0].some(
              (c) => c,
            ) && (
              <div className='mt-2 flex max-h-[40px] flex-wrap items-center gap-x-5 gap-y-3 overflow-auto'>
                <TaskDueDate dueDate={dueDate} isPassed={isPassed} checked={checked} />
                <TaskSubtasks subtasks={subtasks} />
                <TaskPriority priority={priority} />
                <TaskTags tagsIds={tagsIds} />
                <TaskList listId={listId} listName={listName} listColor={listColor} />
              </div>
            )}

            {isPassed && !checked && (
              <CustomTippy content='Overdue'>
                <i className='fa-solid  fa-calendar-xmark text-lg text-red-500'></i>
              </CustomTippy>
            )}
          </div>
        </div>
        <TaskActions
          isOpen={isTaskActionsOpen}
          onClose={() => setIsTaskActionsOpen(false)}
          onDelete={() => {
            setIsTaskActionsOpen(false);
            confirmDelete({
              title: 'Delete task',
              message: 'Are you sure you want to delete this task?',
              onConfirm: async () => handleDeleteTask($id),
            });
          }}
          onCopy={() => {
            copyToClipBoard(`Task Title: ${title}\n\nTask Note:\n${note}`);
            setIsTaskActionsOpen(false);
          }}
          onDuplicate={() => {
            setIsTaskActionsOpen(false);
            const task = {
              title: `${title} (copy)`,
              note,
              dueDate,
              subtasks,
              tagsIds,
              priority,
              listId,
            };
            handleAddTask(task, true);
          }}
          date={{
            created: $createdAt,
            updated: $updatedAt,
          }}
          lists={updatedLists}
          onMove={(listId) => handleUpdateTask($id, { listId })}
          currentListId={listId}
        />
      </button>
    </li>
  );
}

function TaskCheckbox({ checked, setChecked, isSelecting, isSelected }) {
  return (
    <div className='relative flex h-full'>
      <span
        className={`absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border   ${
          isSelecting ? 'scale-1' : 'scale-0'
        } ${isSelected ? 'border-transparent bg-primary' : 'border-border  '}
        `}
      >
        <i
          className={`fa-solid fa-check  text-xs text-white ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        ></i>
      </span>

      <CheckBox
        checked={checked}
        onChange={(e) => {
          setChecked(!checked);
          e.target.checked && completedSound.play();
        }}
        className={'top-1/2 -translate-y-1/2   ' + (isSelecting ? 'scale-0' : 'scale-1')}
      />
    </div>
  );
}
function TaskDueDate({ dueDate, isPassed, checked }) {
  if (!dueDate) return null;
  return (
    <div className='flex items-center gap-2'>
      <i
        className={
          'fas fa-calendar-alt  ' + (isPassed && !checked ? 'text-red-500' : 'text-text-tertiary')
        }
      ></i>
      <span
        className={
          'text-xs font-semibold ' + (isPassed && !checked ? 'text-red-500' : 'text-text-secondary')
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
function TaskSubtasks({ subtasks }) {
  if (!subtasks?.length > 0) return null;
  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-2 rounded-sm bg-text-secondary px-2 py-[1px] text-xs font-semibold text-background-primary'>
        <span className='border-r border-background-primary pr-2'>{subtasks.length}</span>
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
  if (!priority) return null;
  return (
    <div className='flex items-center gap-2'>
      <i
        className='fas fa-triangle-exclamation text-lg'
        style={{
          color: priorities[+priority].color,
        }}
      ></i>
      <span className='text-xs font-semibold text-text-secondary'>
        {priorities[+priority].label}
      </span>
    </div>
  );
}
function TaskList({ listId, listName, listColor }) {
  if (!listId || listId === 'none') return null;
  return (
    <div className='grid grid-cols-[16px_auto] items-center gap-2 overflow-hidden'>
      <span className='h-4 w-4 rounded-sm' style={{ backgroundColor: `var(${listColor})` }}></span>
      <span className='truncate text-xs font-semibold text-text-secondary'>{listName}</span>
    </div>
  );
}
