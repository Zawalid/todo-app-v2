export function ConfirmationModal({ onDelete, onClose }) {
  return (
    <div className='absolute left-0 top-0  z-30 grid h-full w-full place-content-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' rounded-lg bg-white p-4'>
        <h4 className='text-center text-sm font-semibold text-text-secondary'>
          Are you sure you want to delete this task?
        </h4>
        <div className='mt-5 flex items-center justify-evenly'>
          <button
            className='rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-background-secondary'
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className='rounded-lg bg-background-secondary px-3 py-1 text-sm font-semibold text-text-secondary'
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
