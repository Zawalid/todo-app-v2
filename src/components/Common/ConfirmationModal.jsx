import { createContext, useCallback, useState } from 'react';
import Modal from './Modal';
import { CheckBox } from './CheckBox';

const DEFAULT_OPTIONS = {
  message: '',
  title: '',
  confirmText: 'Delete',
  showCheckBox: true,
  icon : <PiWarningFill />
};
import deletedSoundFile from '../../assets/deleted.mp3';
import { Button } from './Button';
import { PiWarningFill } from 'react-icons/pi';
const deletedSound = new Audio(deletedSoundFile);

export const ModalContext = createContext();

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
         openModal,
        isModalOpen
      }}
    >
      {children}
      <Modal
        isOpen={isModalOpen}
        className='flex w-[90%] flex-col gap-5  py-3 shadow-sm child-padding sm:w-[500px] sm:py-4'
        overlayClassName='z-50'
        onClose={onCancel}
      >
        <div className='flex items-center gap-3  pb-3'>
          <div className='grid sm:text-lg text-white h-6 w-6 place-content-center rounded-full bg-[#F57800] sm:h-8 sm:w-8'>
            {options.icon}
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
            <label htmlFor='permanent' className='text-sm font-medium text-text-tertiary'>
              Delete permanently
            </label>
          </div>
        )}

        <div className='mt-3 flex  items-center justify-end gap-3 border-t border-border pt-3'>
          <Button
            type='delete'
            onClick={onConfirm}
          >
            {options.confirmText}
          </Button>
          <Button
            type='cancel'
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
}


