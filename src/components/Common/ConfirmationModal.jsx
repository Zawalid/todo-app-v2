import { createContext, useCallback, useContext, useState } from 'react';
import Modal from './Modal';
import { CheckBox } from './CheckBox';

const DEFAULT_OPTIONS = {
  message: '',
  title: '',
  confirmText: 'Delete',
  showCheckBox: true,
};
import deletedSoundFile from '../../assets/deleted.mp3';
const deletedSound = new Audio(deletedSoundFile);

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

  const openModal = (newOptions) => {
    setIsModalOpen(true);
    setOptions({ ...options, ...newOptions });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setOptions(DEFAULT_OPTIONS);
  };
  const onConfirm = useCallback(() => {
    options.onConfirm(isChecked);
    setTimeout(() => deletedSound.play(), 300);
    closeModal();
  }, [options, isChecked]);
  const onCancel = () => {
    options.onCancel?.();
    closeModal();
  };

  return (
    <ModalContext.Provider
      value={{
        options,
        confirmDelete: openModal,
        isModalOpen
      }}
    >
      {children}
      <Modal
        isOpen={isModalOpen}
        className='flex w-[90%] flex-col gap-5  py-3 shadow-sm child-padding sm:w-[500px] sm:py-4'
      >
        <div className='flex items-center gap-3  pb-3'>
          <div className='grid  h-6 w-6 place-content-center rounded-full bg-[#F57800] sm:h-8 sm:w-8'>
            <i className='fa-solid fa-triangle-exclamation text-sm text-white sm:text-base'></i>
          </div>
          <h1 className='text-xl font-bold text-text-primary   sm:text-2xl'>{options.title}</h1>
        </div>
        <h4 className='text-sm font-semibold text-text-secondary sm:text-base'>
          {options.message}
        </h4>

        {options.showCheckBox && (
          <div className='flex items-center gap-3'>
            <CheckBox
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              id='permanent'
            />
            <label htmlFor='permanent' className='mt-[3px] text-sm font-medium text-text-tertiary'>
              Delete permanently
            </label>
          </div>
        )}

        <div className='mt-3 flex  items-center justify-end gap-3 border-t border-border pt-3'>
          <button
            className='rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white  hover:bg-red-600'
            onClick={onConfirm}
          >
            {options.confirmText}
          </button>
          <button
            className='rounded-lg  bg-background-secondary px-4 py-2  text-sm font-semibold text-text-secondary  hover:bg-background-tertiary'
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
