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
import { isTouchDevice } from '../../../utils/helpers';

const completedSound = new Audio(completedSoundFile);

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
  const { handleOpenTask, handleCompleteTask } = useTasks();
  const { tags } = useTags();
  const isPassed = isTaskOverdue(dueDate);
  const bind = useLongPress(() => !isModalOpen && !isSelecting && setIsTaskActionsOpen(true), {
    detect: 'touch',
  });
  const { Modal, openModal, isModalOpen } = useDeleteTask($id);

  const listName = useMemo(() => lists?.find((l) => l?.$id === listId)?.title, [listId, lists]);
  const listColor = useMemo(() => lists?.find((l) => l?.$id === listId)?.color, [listId, lists]);

  useEffect(() => {
    isCompleted !== checked && handleCompleteTask($id, checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li>
      <button
        className={
          ' grid min-h-[49px] w-full hover:translate-y-1 hover:shadow-[2px_2px_0px_rgb(228_228_231)] cursor-pointer grid-cols-[20px_auto_20px] items-center gap-3 rounded-lg border-b  border-zinc-200 px-5 py-2 text-start transition-all duration-500   ' +
          (checked ? 'bg-background-tertiary ' : 'bg-slate-50 ') 
        }
        {...bind()}
        onClick={() => (isSelecting ? onClick() : isTouchDevice() || handleOpenTask($id))}
      >
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
        <div>
          <span
            className={'text-sm font-medium text-text-secondary ' + (checked ? 'line-through' : '')}
          >
            {title}
          </span>
          {(listName ||
            dueDate ||
            subtasks?.length > 0 ||
            tagsIds?.length > 0 ||
            priority !== 0) && (
            <div className='mt-2 flex flex-wrap items-center gap-5'>
              {dueDate && (
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
              )}
              {subtasks?.length > 0 && (
                <div className='flex items-center gap-2'>
                  <span className='rounded-sm bg-text-secondary px-2 py-[1px] text-xs font-semibold text-background-primary'>
                    {subtasks.length}
                  </span>
                  <span className='text-xs font-semibold text-text-secondary'>Subtasks</span>
                </div>
              )}
              {listName && listId !== 'none' && (
                <div className='flex items-center gap-2'>
                  <span
                    className='h-4 w-4 rounded-sm'
                    style={{ backgroundColor: listColor }}
                  ></span>
                  <span className='text-xs font-semibold text-text-secondary'>{listName}</span>
                </div>
              )}
              {tagsIds?.length > 0 && (
                <ul className='flex flex-wrap items-center gap-2'>
                  {tagsIds.map((tagId) => {
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
                  })}
                </ul>
              )}

              {priority !== 0 && (
                <div className='flex items-center gap-2'>
                  <i
                    className={
                      'fas fa-flag ' +
                      (priority === 1
                        ? 'text-[#FFD700]'
                        : priority === 2
                        ? 'text-[#c0ac3a]'
                        : 'text-text-error')
                    }
                  ></i>
                  <span className='text-xs font-semibold text-text-secondary'>
                    {priority === 1
                      ? 'Low'
                      : priority === 2
                      ? 'Medium'
                      : priority === 3
                      ? 'High'
                      : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
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
          {isTaskActionsOpen && (
            <TaskActions
              onClose={() => setIsTaskActionsOpen(false)}
              onEdit={() => {
                handleOpenTask($id);
                setIsTaskActionsOpen(false);
              }}
              onDelete={() => {
                setIsTaskActionsOpen(false);
                openModal();
              }}
              onCopy={() => {
                navigator.clipboard.writeText(title);
                toast.success('Copied to clipboard');
                setIsTaskActionsOpen(false);
              }}
              date={{
                created: $createdAt,
                updated: $updatedAt,
              }}
            />
          )}
        </div>
        {Modal}
      </button>
    </li>
  );
}
