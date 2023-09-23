import CustomTippy from "../../CustomTippy";



export function StickyNoteHeader({
  title,
  setTitle,
  description,
  setDescription,
  onBack,
  onSave,
  onDelete,
  isChanged,
}) {
  return (
    <div className='flex items-center justify-between border-b-2 border-background-tertiary  p-3'>
      <div>
        <input
          type='text'
          className='w-full bg-transparent text-xl  font-bold text-text-secondary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='text'
          className='mt-2 w-full rounded-md border-b border-l bg-transparent p-1 text-sm font-medium text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className='flex items-center gap-2'>
        <CustomTippy content='Back'>
          <button
            className='h-10 w-10 cursor-pointer rounded-full bg-background-tertiary text-text-tertiary hover:bg-background-secondary'
            onClick={onBack}
          >
            <i className='fa-solid fa-chevron-left'></i>
          </button>
        </CustomTippy>
        <CustomTippy content='Save'>
          <button
            className={
              'h-10 w-10 cursor-pointer rounded-full transition-colors duration-500  ' +
              (isChanged
                ? 'cursor-pointer bg-indigo-500 text-background-secondary hover:bg-indigo-400 '
                : 'cursor-not-allowed bg-background-tertiary text-text-tertiary hover:bg-background-secondary')
            }
            onClick={onSave}
          >
            <i className='fa-solid fa-floppy-disk'></i>
          </button>
        </CustomTippy>
        <CustomTippy content='Delete'>
          <button
            className='relative h-10 w-10 cursor-pointer rounded-full bg-background-tertiary text-text-tertiary transition-colors duration-500 hover:bg-red-500 hover:text-white'
            onClick={onDelete}
          >
            <i className='fa-solid fa-trash-can'></i>
          </button>
        </CustomTippy>
      </div>
    </div>
  );
}
