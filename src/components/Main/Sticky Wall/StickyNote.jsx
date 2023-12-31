import { useEffect } from 'react';

export function StickyNote({ stickyNote, onClick, listView }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--line-clamp', listView ? '1' : '8');
  }, [listView]);

  return (
    <button
      className={
        'relative flex  flex-col  gap-3 overflow-hidden rounded-lg p-5 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] ' +
        (listView ? 'h-[120px]' : 'h-[270px] ')
      }
      style={{
        backgroundColor: stickyNote.bgColor,
        color: stickyNote.textColor,
      }}
      onClick={onClick}
    >
      <>
        <div
          className={
            'grid w-full flex-1 space-y-3 ' +
            (!stickyNote.description && !listView
              ? ' place-content-center'
              : 'place-content-start text-start')
          }
        >
          <h2 className='text-xl font-bold sm:text-2xl'>{stickyNote.title}</h2>

          {stickyNote.description && (
            <p
              className={
                'note_text overflow-hidden text-xs font-medium sm:text-sm ' +
                (stickyNote.textColor === '#fff'
                  ? 'text-background-tertiary'
                  : 'text-text-tertiary')
              }
            >
              {stickyNote.description}
            </p>
          )}
        </div>

        <div className='flex w-full items-center justify-between '>
          <span
            className='text-[10px] font-medium sm:text-xs'
            style={{
              color: stickyNote.textColor,
            }}
          >
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(stickyNote.$updatedAt))}
          </span>
          {/* <button>
              <i
                className='fa-regular fa-circle text-xl'
                style={{
                  color: stickyNote.textColor,
                }}
              ></i>
            </button> */}
        </div>
      </>
    </button>
  );
}
