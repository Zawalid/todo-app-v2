import { createContext, useCallback, useState } from 'react';
import Modal from './Modal';
import { CheckBox } from './CheckBox';

const DEFAULT_OPTIONS = {
  message: '',
  title: '',
  confirmText: 'Delete',
  showCheckbox: true,
  icon: <PiWarningFill />,
};
import { Button } from './Button';
import { PiWarningFill } from 'react-icons/pi';
import { createPortal } from 'react-dom';

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
    setIsChecked(false);
  };
  const onConfirm = useCallback(() => {
    options.onConfirm(isChecked);
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
        isModalOpen,
      }}
    >
      {children}
      {createPortal(
        <Modal
          isOpen={isModalOpen}
          className='w-[90%] flex-col gap-5 border  py-3 shadow-sm child-padding sm:w-[500px] sm:py-4'
          overlayClassName='z-50'
          onClose={onCancel}
        >
          <div className='flex items-center gap-3  pb-3'>
            <div className='grid h-6 w-6 place-content-center rounded-full bg-[#F57800] text-white sm:h-8 sm:w-8 sm:text-lg'>
              {options.icon}
            </div>
            <h1 className='text-xl font-bold text-text-primary   sm:text-2xl'>{options.title}</h1>
          </div>
          <h4 className='text-sm font-semibold text-text-secondary sm:text-base'>
            {options.message}
          </h4>

          {options.showCheckbox && (
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
            <Button type='delete' onClick={onConfirm}>
              {options.confirmText}
            </Button>
            <Button type='cancel' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Modal>,
        document.body,
      )}
    </ModalContext.Provider>
  );
}
