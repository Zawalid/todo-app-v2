export function ConfirmationModal({
  sentence,
  confirmText,
  onConfirm,
  onCancel,
  element,
  isTrash,
  checked,
  setChecked,
}) {
  return (
    <div className='fixed -top-1 left-0 z-[999999] grid h-full w-full place-content-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' flex w-[500px] flex-col gap-5 rounded-lg bg-white px-8 py-4'>
        <div className='flex items-center gap-3 border-b pb-3'>
          <div className='grid  h-8 w-8 place-content-center rounded-full bg-[#F57800]'>
            <i className='fa-solid fa-triangle-exclamation text-white'></i>
          </div>
          <h1 className='text-2xl font-bold   text-text-primary'>
            {element === 'Trash' ? 'Empty' : 'Delete'} {element}
          </h1>
        </div>
        <h4 className=' text-s font-semibold text-text-secondary'>{sentence}</h4>
        {!isTrash && (
          <div className=' flex items-center gap-3'>
            <div className='relative'>
              <input
                type='checkbox'
                id='permanent'
                className='task peer'
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <i className='fas fa-check pointer-events-none  absolute left-1  top-1 hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
            </div>
            <label htmlFor='permanent' className='mb-[3px] text-sm text-text-tertiary'>
              Delete permanently
            </label>
          </div>
        )}
        <div className='flex items-center  justify-end gap-3 border-t pt-3'>
          <button
            className='rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-background-secondary transition-colors duration-300 hover:bg-red-600'
            onClick={() => {
              onConfirm();
              setChecked(false);
            }}
          >
            {confirmText}
          </button>
          <button
            className='rounded-lg bg-background-secondary px-4 py-2 text-sm font-semibold text-text-secondary'
            onClick={() => {
              onCancel();
              setChecked(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
