export function MultipleDeletions({ isOpen, onConfirm, onClose, selectedTasksNumber }) {
  return (
    <div
      className={`fixed left-1/2 flex w-[500px] -translate-x-1/2 items-center justify-between rounded-lg border bg-background-primary px-8 py-4 shadow-lg transition-[bottom] duration-500 ${isOpen ? 'bottom-3' : '-bottom-[100px]'}`}
    >
      <h2 className='font-semibold text-text-secondary'>
        <span className='mr-2  rounded-md bg-text-secondary px-2 py-1 text-lg text-white '>
          {selectedTasksNumber}
        </span>
        {selectedTasksNumber === 1 ? ' Task' : ' Tasks'} selected
      </h2>
      <div className='flex items-center  gap-3 '>
        <button
          className='rounded-lg bg-background-secondary px-4 py-2 text-sm font-semibold text-text-secondary'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className='rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-background-secondary transition-colors duration-300 hover:bg-red-600'
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
