import { useEffect, useMemo, useState } from 'react';
import { Tag } from '../../Menu/Menu Tags/Tag';

export function Task({
  title,
  dueDate,
  subtasksNumber,
  listId,
  onOpen,
  isCompleted,
  onComplete,
  lists,
  tags,
  tagsIds,
}) {
  const [checked, setChecked] = useState(isCompleted);
  const listName = useMemo(() => lists.find((l) => l?.id === +listId)?.title, [listId, lists]);
  const listColor = useMemo(() => lists.find((l) => l?.id === +listId)?.color, [listId, lists]);

  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li
      className={
        'flex items-center justify-between  gap-3 rounded-lg border-b  border-background-tertiary px-5 py-2 transition-colors duration-500 ' +
        (checked ? 'bg-background-secondary' : '')
      }
    >
      <div className='relative'>
        <input
          type='checkbox'
          className='task peer'
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <i className='fas fa-check pointer-events-none  absolute left-1  top-1 hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
      </div>
      <div className='flex-1'>
        <span
          className={'text-sm font-medium text-text-secondary ' + (checked ? 'line-through' : '')}
        >
          {title}
        </span>
        {(listName || dueDate || subtasksNumber > 0 || tagsIds?.length > 0) && (
          <div className='mt-2 flex flex-wrap items-center gap-5'>
            {dueDate && (
              <div className='flex items-center gap-2'>
                <i className='fas fa-calendar-alt text-text-tertiary'></i>
                <span className='text-xs font-semibold text-text-secondary'>{dueDate}</span>
              </div>
            )}
            {subtasksNumber > 0 && (
              <div className='flex items-center gap-2'>
                <span className='rounded-sm bg-background-tertiary px-3 py-[1px] text-xs font-semibold text-text-secondary'>
                  {subtasksNumber}
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
                  const tag = tags.find((t) => t.id === +tagId);
                  if (tag)
                    return (
                      <Tag
                        key={tag.id}
                        title={tag.title}
                        bgColor={tag.bgColor}
                        textColor={tag.textColor}
                        isMainTag={false}
                        showDeleteButton={false}
                        id={tag.id}
                        customClassName={'px-2 py-1 cursor-auto'}
                      />
                    );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      <button onClick={onOpen}>
        <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
      </button>
    </li>
  );
}
