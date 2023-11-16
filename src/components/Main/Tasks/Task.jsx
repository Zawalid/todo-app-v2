import { useEffect, useMemo, useState } from 'react';
import { Tag } from '../../Menu/Menu Tags/Tag';
import {
  checkIfToday,
  checkIfTomorrow,
  checkIfYesterday,
  isTaskOverdue,
} from '../../../utils/Moment';
import Tippy from '@tippyjs/react';
import completedSoundFile from '../../../assets/completed.mp3';
import { useTasks, useLists, useTags } from '../../../hooks';
import { CheckBox } from '../../Common/CheckBox';

const completedSound = new Audio(completedSoundFile);

export function Task({
  task: { $id, title, isCompleted, dueDate, subtasks, tagsIds, priority, listId },
  isSelecting,
}) {
  const [checked, setChecked] = useState(isCompleted);
  const { lists } = useLists();
  const { handleOpenTask, handleCompleteTask, setSelectedTasks, selectedTasks } = useTasks();
  const { tags } = useTags();
  const isPassed = isTaskOverdue(dueDate);

  const listName = useMemo(() => lists.find((l) => l?.$id === listId)?.title, [listId, lists]);
  const listColor = useMemo(() => lists.find((l) => l?.$id === listId)?.color, [listId, lists]);
  const isSelected = useMemo(() => selectedTasks.some((t) => t.$id === $id), [selectedTasks, $id]);

  useEffect(() => {
    isCompleted !== checked && handleCompleteTask($id, checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li
      className={
        'flex items-center justify-between gap-3 rounded-lg  border-b border-background-tertiary   px-5 py-2 transition-all duration-500   ' +
        (checked ? 'bg-background-tertiary ' : 'bg-slate-50 ') +
        (isSelected ? ' translate-y-1 border-x border-x-text-tertiary' : '')
      }
    >
      <CheckBox
        checked={checked}
        onChange={(e) => {
          setChecked(!checked);
          e.target.checked && completedSound.play();
        }}
      />

      <div className='flex-1'>
        <span
          className={'text-sm font-medium text-text-secondary ' + (checked ? 'line-through' : '')}
        >
          {title}
        </span>
        {(listName || dueDate || subtasks?.length > 0 || tagsIds?.length > 0 || priority !== 0) && (
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
                <span className='rounded-sm bg-background-tertiary px-3 py-[1px] text-xs font-semibold text-text-secondary'>
                  {subtasks.length}
                </span>
                <span className='text-xs font-semibold text-text-secondary'>Subtasks</span>
              </div>
            )}
            {listName && listId !== 'none' && (
              <div className='flex items-center gap-2'>
                <span className='h-4 w-4 rounded-sm' style={{ backgroundColor: listColor }}></span>
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
          <Tippy
            content={
              <span className='  font-semibold text-text-error'>This task is overdue !</span>
            }
            placement='top'
            className='bg-background-primary text-center shadow-md'
            arrow={false}
            animation='fade'
          >
            <button>
              <i className='fa-solid  fa-triangle-exclamation text-lg text-text-error'></i>
            </button>
          </Tippy>
        )}
        <button
          className='rounded-sm px-2 py-1 transition-colors duration-300 hover:bg-background-primary'
          onClick={() => handleOpenTask($id)}
        >
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </button>
        {isSelecting && (
          <button
            className='border-l-2 pl-4'
            onClick={() => {
              setSelectedTasks((prev) => {
                if (isSelected) return prev.filter((t) => t.$id !== $id);
                else return [...prev, { $id, title, listId }];
              });
            }}
          >
            {isSelected ? (
              <i className='fa-solid fa-circle-check text-lg text-text-tertiary'></i>
            ) : (
              <i className='fa-regular fa-circle text-lg text-text-tertiary'></i>
            )}
          </button>
        )}
      </div>
    </li>
  );
}
