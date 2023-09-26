export function StickyNote({
  title,
  description,
  bgColor,
  textColor,
  creationDate,
  adder,
  onClick,
}) {
  return (
    <div
      className={
        'group relative h-[270px] overflow-hidden rounded-lg p-5 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] ' +
        (adder || !description ? 'grid place-content-center' : '')
      }
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {adder && (
        <button onClick={onClick}>
          <i className='fas fa-plus cursor-pointer text-5xl text-text-primary'></i>
        </button>
      )}
      {!adder && (
        <>
          <h2 className='mb-3 text-2xl font-bold'>{title}</h2>
          <p
            className={
              'note_text overflow-hidden text-sm font-medium ' +
              (textColor === '#fff' ? 'text-background-tertiary' : 'text-text-tertiary')
            }
          >
            {description}
          </p>

          <div className='absolute bottom-3 left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-5 '>
            <span className='text-sm font-semibold text-text-primary'>{creationDate}</span>
            <div className='flex gap-1'>
              {/* {// Todo : Add the "Add to favorites" Feature for the notes} */}
              {/* 
              <button className=' grid h-6 w-6 place-content-center rounded-full bg-text-primary'>
                <i className='fa-solid fa-star cursor-pointer text-xs text-white transition-colors duration-300 hover:text-yellow-400'></i>
              </button> */}
              <button
                className=' grid h-6 w-6 place-content-center rounded-full bg-text-primary'
                onClick={onClick}
              >
                <i className='fa-solid fa-pen cursor-pointer text-xs  text-white'></i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
