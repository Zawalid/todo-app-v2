import { useEffect } from 'react';

export function StickyNote({ stickyNote, onClick, listView, isSelecting, isSelected }) {
  const { title, content, $createdAt = new Date(), bgColor, textColor } = stickyNote;
  const firstParagraph = content.match(/<p>([^<]*)<\/p>/)?.[1];

  useEffect(() => {
    document.documentElement.style.setProperty('--line-clamp', listView ? '1' : '8');
  }, [listView]);

  return (
    <button
      className={
        'group relative flex w-full flex-col gap-3 overflow-hidden rounded-lg px-5 py-3 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] ' +
        (listView ? 'h-[130px]' : 'h-[270px] ')
      }
      style={{
        backgroundColor: `var(${bgColor})`,
        color: textColor,
      }}
      onClick={onClick}
    >
      <>
        <div
          className={
            'grid w-full flex-1 space-y-3   group-hover:scale-[.95] ' +
            (!firstParagraph && !listView
              ? ' place-content-center'
              : 'place-content-start text-start')
          }
        >
          <h2 className='truncate text-xl font-bold sm:text-2xl'>{title || 'Untitled'}</h2>

          {firstParagraph && (
            <p className='note_text overflow-hidden text-xs font-medium text-text-secondary sm:text-sm '>
              {firstParagraph}
            </p>
          )}
        </div>

        <div className='flex h-7 w-full items-center justify-between   group-hover:scale-[.95] '>
          <span
            className='text-[10px] font-medium sm:text-xs'
            style={{
              color: textColor,
            }}
          >
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date($createdAt))}
          </span>

          <span
            className={'  ' + (isSelecting ? 'scale-1' : 'scale-0')}
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
