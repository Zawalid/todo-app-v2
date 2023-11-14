export function StickyNote({ stickyNote, adder, onClick }) {
  return (
    <div
      className={
        ' relative h-[270px] overflow-hidden rounded-lg p-5 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] ' +
        (adder || !stickyNote.description ? 'grid place-content-center' : '')
      }
      style={{
        backgroundColor: stickyNote.bgColor,
        color: stickyNote.textColor,
      }}
    >
      {adder && (
        <button onClick={onClick}>
          <i className='fas fa-plus cursor-pointer text-5xl text-text-primary'></i>
        </button>
      )}
      {!adder && (
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
            <span className='text-sm font-semibold text-text-primary'>
              {new Date(stickyNote.$createdAt).toLocaleDateString()}
            </span>
            <button
              className=' grid h-7 w-7 place-content-center rounded-full bg-text-primary'
              onClick={onClick}
            >
              <i className='fa-solid fa-eye cursor-pointer text-xs  text-white'></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
