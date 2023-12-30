export function StickyNote({ stickyNote, onClick }) {
  return (
    <button
      className={
        ' relative grid h-[270px] overflow-hidden rounded-lg p-5 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] ' +
        (!stickyNote.description ? ' place-content-center' : 'place-content-start text-start')
      }
      style={{
        backgroundColor: stickyNote.bgColor,
        color: stickyNote.textColor,
      }}
      onClick={onClick}
    >
      <>
        <h2 className='mb-3 text-2xl font-bold'>{stickyNote.title}</h2>
        <p
          className={
            'note_text overflow-hidden text-sm font-medium ' +
            (stickyNote.textColor === '#fff' ? 'text-background-tertiary' : 'text-text-tertiary')
          }
        >
          {stickyNote.description}
        </p>

        <div className='absolute bottom-3 left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-5 '>
          <span
            className='text-sm font-semibold'
            style={{
              color: stickyNote.textColor,
            }}
          >
            {new Date(stickyNote.$createdAt).toLocaleDateString()}
          </span>
          {/* <button>
              <i
                className='fa-regular fa-circle text-lg'
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
