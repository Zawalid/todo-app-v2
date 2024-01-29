import { createPortal } from 'react-dom';
import { CheckBox } from './CheckBox';
import Modal from './Modal';

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
  return createPortal(
    <Modal
      isOpen={isOpen}
      className='flex w-[90%] flex-col gap-5  py-3 shadow-sm child-padding sm:w-[500px] sm:py-4'
    >
      <div className='flex items-center gap-3  pb-3'>
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
          <label htmlFor='permanent' className='mt-[3px] text-sm font-medium text-text-tertiary'>
            Delete permanently
          </label>
        </div>
      )}
      <div className='mt-3 flex  items-center justify-end gap-3 border-t border-border pt-3'>
        <button
          className='rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white  hover:bg-red-600'
          onClick={() => {
            onConfirm();
            setChecked && setChecked(false);
          }}
        >
          {confirmText}
        </button>
        <button
          className='rounded-lg  bg-background-secondary px-4 py-2  text-sm font-semibold text-text-secondary  hover:bg-background-tertiary'
          onClick={() => {
            onCancel();
            setChecked && setChecked(false);
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>,
    document.body,
  );
}
