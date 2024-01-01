import { useEffect } from 'react';

export function StickyNote({
  stickyNote: { title, description, $updatedAt, bgColor, textColor },
  onClick,
  listView,
  isSelecting,
  isSelected,
}) {
  useEffect(() => {
    document.documentElement.style.setProperty('--line-clamp', listView ? '1' : '8');
  }, [listView]);

  return (
    <button
      className={
        'relative flex w-full flex-col gap-3 overflow-hidden rounded-lg px-5 py-3 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] transition-[transform,height] duration-500 hover:scale-105 ' +
        (listView ? 'h-[130px]' : 'h-[270px] ')
      }
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      onClick={onClick}
    >
      <>
        <div
          className={
            'grid w-full flex-1 space-y-3 ' +
            (!description && !listView ? ' place-content-center' : 'place-content-start text-start')
          }
        >
          <h2 className='text-xl font-bold sm:text-2xl'>{title}</h2>

          {description && (
            <p
              className={
                'note_text overflow-hidden text-xs font-medium sm:text-sm ' +
                (textColor === '#fff' ? 'text-background-tertiary' : 'text-text-tertiary')
              }
            >
              {description}
            </p>
          )}
        </div>

        <div className='flex h-7 w-full items-center justify-between '>
          <span
            className='text-[10px] font-medium sm:text-xs'
            style={{
              color: textColor,
            }}
          >
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date($updatedAt))}
          </span>

          <span
            className={'transition-transform duration-500 ' + (isSelecting ? 'scale-1' : 'scale-0')}
            style={{
              color: textColor,
            }}
          >
            {isSelected ? (
              <i className='fa-solid fa-circle-check text-lg'></i>
            ) : (
              <i className='fa-regular fa-circle text-lg'></i>
            )}
          </span>
        </div>
      </>
    </button>
  );
}
