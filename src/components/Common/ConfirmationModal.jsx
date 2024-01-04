import { createPortal } from 'react-dom';
import { CheckBox } from './CheckBox';

export function ConfirmationModal({
  isOpen,
  sentence,
  confirmText,
  onConfirm,
  onCancel,
  element,
  showCheckBox = true,
  checked,
  setChecked,
}) {
  if (!isOpen) return null;
  return createPortal(
    <div className='fixed left-0 top-0 z-[999999] grid h-full w-full place-items-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className='flex w-[90%] flex-col gap-5 rounded-lg bg-white px-5 py-3 sm:w-[500px] sm:px-8 sm:py-4'>
        <div className='flex items-center gap-3 border-b pb-3'>
          <div className='grid  h-6 w-6 place-content-center rounded-full bg-[#F57800] sm:h-8 sm:w-8'>
            <i className='fa-solid fa-triangle-exclamation text-sm text-white sm:text-base'></i>
          </div>
          <h1 className='text-xl font-bold text-text-primary   sm:text-2xl'>
            {element === 'Trash' ? 'Empty' : 'Delete'} {element}
          </h1>
        </div>
        <h4 className='text-sm font-semibold text-text-secondary sm:text-base'>{sentence}</h4>
        {showCheckBox && (
          <div className='flex items-center gap-3'>
            <CheckBox checked={checked} onChange={() => setChecked(!checked)} id='permanent' />
            <label htmlFor='permanent' className='mb-[3px] text-sm font-medium text-text-tertiary'>
              Delete permanently
            </label>
          </div>
        )}
        <div className='flex items-center  justify-end gap-3 border-t pt-3'>
          <button
            className='rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-background-secondary transition-colors duration-300 hover:bg-red-600'
            onClick={() => {
              onConfirm();
              setChecked && setChecked(false);
            }}
          >
            {confirmText}
          </button>
          <button
            className='rounded-lg  bg-background-secondary px-4 py-2  text-sm font-semibold text-text-secondary transition-colors duration-300 hover:bg-background-tertiary'
            onClick={() => {
              onCancel();
              setChecked && setChecked(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
