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
import { useTasks } from '../../../hooks/useTasks';
import { useLists } from '../../../hooks/useLists';
import { useTags } from '../../../hooks/useTags';
import { CheckBox } from '../../Common/CheckBox';

const completedSound = new Audio(completedSoundFile);

export function Task({ task, isSelecting }) {
  const [checked, setChecked] = useState(task.isCompleted);
  const [isSelected, setIsSelected] = useState(false);
  const { lists } = useLists();
  const { handleOpenTask, handleCompleteTask, setSelectedTasks } = useTasks();
  const { tags } = useTags();
  const isPassed = isTaskOverdue(task.dueDate);

  const listName = useMemo(
    () => lists.find((l) => l?.$id === task.listId)?.title,
    [task.listId, lists],
  );
  const listColor = useMemo(
    () => lists.find((l) => l?.$id === task.listId)?.color,
    [task.listId, lists],
  );
  useEffect(() => {
    task.isCompleted !== checked && handleCompleteTask(task.$id, task, checked);
    // eslint-disable-next-line
  }, [checked]);

  useEffect(() => {
    if (!isSelecting) {
      setIsSelected(false);
      setSelectedTasks([]);
    }
    // eslint-disable-next-line
  }, [isSelecting]);

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
          {task.title}
        </span>
        {(listName ||
          task.dueDate ||
          task.subtasks?.length > 0 ||
          task.tagsIds?.length > 0 ||
          task.priority !== 0) && (
          <div className='mt-2 flex flex-wrap items-center gap-5'>
            {task.dueDate && (
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
                  {checkIfToday(task.dueDate)
                    ? 'Today'
                    : checkIfTomorrow(task.dueDate)
                    ? 'Tomorrow'
                    : checkIfYesterday(task.dueDate)
                    ? 'Yesterday'
                    : task.dueDate}
                </span>
              </div>
            )}
            {task.subtasks?.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className='rounded-sm bg-background-tertiary px-3 py-[1px] text-xs font-semibold text-text-secondary'>
                  {task.subtasks.length}
                </span>
                <span className='text-xs font-semibold text-text-secondary'>Subtasks</span>
              </div>
            )}
            {listName && task.listId !== 'none' && (
              <div className='flex items-center gap-2'>
                <span className='h-4 w-4 rounded-sm' style={{ backgroundColor: listColor }}></span>
                <span className='text-xs font-semibold text-text-secondary'>{listName}</span>
              </div>
            )}
            {task.tagsIds?.length > 0 && (
              <ul className='flex flex-wrap items-center gap-2'>
                {task.tagsIds.map((tagId) => {
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

            {task.priority !== 0 && (
              <div className='flex items-center gap-2'>
                <i
                  className={
                    'fas fa-flag ' +
                    (task.priority === 1
                      ? 'text-[#FFD700]'
                      : task.priority === 2
                      ? 'text-[#c0ac3a]'
                      : 'text-text-error')
                  }
                ></i>
                <span className='text-xs font-semibold text-text-secondary'>
                  {task.priority === 1
                    ? 'Low'
                    : task.priority === 2
                    ? 'Medium'
                    : task.priority === 3
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
          onClick={() => handleOpenTask(task.$id)}
        >
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </button>
        {isSelecting && (
          <button
            className='border-l-2 pl-4'
            onClick={() => {
              setIsSelected(!isSelected);
              setSelectedTasks((prev) => {
                if (isSelected) return prev.filter((id) => id !== task.$id);
                else return [...prev, { $id: task.$id, title: task.title }];
              });
            }}
          >
            {
              <i
                className={`fa-${isSelected ? 'solid' : 'regular'} ${
                  isSelected ? 'fa-circle-check' : 'fa-circle'
                } text-lg text-text-tertiary`}
              ></i>
            }
          </button>
        )}
      </div>
    </li>
  );
}
