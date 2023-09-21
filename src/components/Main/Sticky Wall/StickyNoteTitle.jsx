export function StickyNoteTitle({
  title, setTitle, characters, creationDate, onBack, onSave, onDelete, isChanged,
}) {
  return (
    <div className='flex items-center justify-between border-b border-background-tertiary  p-5'>
      <div>
        <input
          type='text'
          className='w-full bg-transparent text-xl font-bold text-text-secondary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <div className='mt-3 flex items-center gap-2 text-xs font-medium text-text-tertiary'>
          <span className='border-r border-text-tertiary pr-2'>
            <i className='fas fa-calendar mr-2 text-text-tertiary '></i>
            Created at {creationDate}
          </span>
          <span>{characters} Characters</span>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <button
          className='h-10 w-10 cursor-pointer rounded-full bg-background-tertiary text-text-tertiary hover:bg-background-secondary'
          onClick={onBack}
        >
          <i className='fa-solid fa-chevron-left'></i>
        </button>
        <button
          className={'h-10 w-10 cursor-pointer rounded-full transition-colors duration-500  ' +
            (isChanged
              ? 'cursor-pointer bg-indigo-500 text-background-secondary hover:bg-indigo-400 '
              : 'cursor-not-allowed bg-background-tertiary text-text-tertiary hover:bg-background-secondary')}
          onClick={onSave}
        >
          <i className='fa-solid fa-floppy-disk'></i>
        </button>
        <button
          className='relative h-10 w-10 cursor-pointer rounded-full bg-background-tertiary text-text-tertiary transition-colors duration-500 hover:bg-red-500 hover:text-white'
          onClick={onDelete}
        >
          <i className='fa-solid fa-trash-can'></i>
        </button>
      </div>
    </div>
  );
}
