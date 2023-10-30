export function ConfirmationModal({ sentence, confirmText, onConfirm, onCancel }) {
  return (
    <div className='fixed left-0 -top-1 z-[999999] grid h-full w-full place-content-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' rounded-lg bg-white p-4'>
        <h4 className='text-center  font-semibold text-text-secondary'>{sentence}</h4>
        <div className='mt-5 flex items-center justify-evenly'>
          <button
            className='rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-background-secondary'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className='rounded-lg bg-background-secondary px-3 py-1 text-sm font-semibold text-text-secondary'
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
