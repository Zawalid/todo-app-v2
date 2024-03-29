import { cloneElement, useEffect, useMemo, useState } from 'react';
import { useLongPress } from 'use-long-press';
import { PiCalendarBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';

import {
  useCompleteTask,
  useDeleteTask,
  useAddTask,
  useUpdateTask,
} from '../../../../lib/react-query/mutations';
import { useTasks,useLists } from '../../../../lib/react-query/queries';

import CustomTippy from '../../../Common/CustomTippy';
import { useModal } from '../../../../hooks/useModal';
import { isTaskOverdue } from '../../../../utils/Dates';
import { copyToClipBoard } from '../../../../utils/helpers';

import { TaskList } from './TaskList';
import { TaskPriority } from './TaskPriority';
import { TaskTags } from './TaskTags';
import { TaskSubtasks } from './TaskSubtasks';
import { TaskDueDate } from './TaskDueDate';
import { TaskCheckbox } from './TaskCheckbox';
import TaskActions from './TaskActions';

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
  onSelect,
  isSelecting,
  isSelected,
  isLoading,
}) {
  const [isTaskActionsOpen, setIsTaskActionsOpen] = useState(false);
  const [checked, setChecked] = useState(isCompleted);
  const { lists } = useLists();
  const { openModal: confirmDelete, isModalOpen } = useModal();
  const isPassed = isTaskOverdue(dueDate);
  const bind = useLongPress(() => !isModalOpen && !isSelecting && setIsTaskActionsOpen(true), {
    detect: 'touch',
  });
  const { taskDetailLevel } = useSelector((state) => state.settings.general.tasks);
  const navigate = useNavigate()

  const { tasks } = useTasks();
  const { mutate: duplicateTask } = useAddTask({ isDuplicate: true });
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteTask } = useDeleteTask();

  const listName = useMemo(() => lists?.find((l) => l?.$id === listId)?.title, [listId, lists]);
  const listColor = useMemo(() => lists?.find((l) => l?.$id === listId)?.color, [listId, lists]);

  const updatedLists = useMemo(() => {
    return lists?.map((list) => ({
      id: list.$id,
      title: list.title,
      color: list.color,
      tasksLength: tasks?.filter((task) => task.listId === list.$id).length,
    }));
  }, [lists, tasks]);

  useEffect(() => {
    isCompleted !== checked && completeTask({ id: $id, task: { isCompleted: checked } });
  }, [checked, completeTask, $id, isCompleted]);

  // A list of details components
  const details = {
    list: <TaskList listId={listId} listName={listName} listColor={listColor} />,
    dueDate: <TaskDueDate dueDate={dueDate} isPassed={isPassed} checked={checked} />,
    subtasks: <TaskSubtasks subtasks={subtasks} />,
    tags: <TaskTags tagsIds={tagsIds} />,
    priority: <TaskPriority priority={priority} />,
  };

  // A list of details that the task has
  const taskExistingDetails = [
    {
      detail: 'list',
      value: listName,
    },
    {
      detail: 'dueDate',
      value: dueDate,
    },
    {
      detail: 'subtasks',
      value: subtasks?.length > 0,
    },
    {
      detail: 'tags',
      value: tagsIds?.length > 0,
    },
    {
      detail: 'priority',
      value: priority !== 0,
    },
  ];

  return (
    <>
      <button
        onClick={() => isSelecting ? onSelect() : navigate($id)}
        className={`grid min-h-[49px] focus:outline-none  w-full select-none grid-cols-[20px_auto] items-center gap-3 rounded-lg border border-border px-3 py-2 text-start transition-transform  duration-300 focus:translate-y-1 hover:translate-y-1 sm:px-5 ${
          checked ? 'bg-background-tertiary ' : ''
        } ${isLoading ? 'opacity-50' : ''}`}
        {...bind()}
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
            {/* 
              So this complicated line of code does the following :
                - Check if the task has at least on detail that is not empty
                - Check if the task has at least one detail that is not empty and is included in the taskDetailLevel
                - If the above conditions are met, then it will display the details
              */}
            {taskExistingDetails.some(({ value }) => value) &&
              taskExistingDetails
                .filter(({ value }) => value)
                .filter(({ detail }) => taskDetailLevel.includes(detail)).length > 0 && (
                <div className='mt-2 flex max-h-[40px] flex-wrap items-center gap-x-5 gap-y-3 overflow-auto'>
                  {taskDetailLevel.map((detail) => cloneElement(details[detail], { key: detail }))}
                </div>
              )}

            {isPassed && !checked && (
              <CustomTippy content='Overdue'>
                <span>
                  <PiCalendarBold className='text-lg text-red-500' />
                </span>
              </CustomTippy>
            )}
          </div>
        </div>
      </button>

      <TaskActions
        isOpen={isTaskActionsOpen}
        onClose={() => setIsTaskActionsOpen(false)}
        onDelete={() => {
          setIsTaskActionsOpen(false);
          confirmDelete({
            title: 'Delete task',
            message: 'Are you sure you want to delete this task?',
            onConfirm: async (deletePermanently) => deleteTask({ id: $id, deletePermanently }),
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
          duplicateTask({ task });
        }}
        date={{
          created: $createdAt,
          updated: $updatedAt,
        }}
        lists={updatedLists}
        onMove={(listId) => updateTask({ id: $id, task: { listId } })}
        currentListId={listId}
      />
    </>
  );
}
