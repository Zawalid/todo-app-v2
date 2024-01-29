import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../Common/Button';
import { PasswordInput } from '../Common/PasswordInput';
import Modal from '../Common/Modal';

export function UserVerificationModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState('');

  return (
    <Modal isOpen={isOpen} className='flex w-[90%] flex-col  gap-5 px-5 py-4 sm:w-[500px] sm:px-8'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-text-primary sm:text-2xl'>
            Let&apos;s verify it&apos;s you
          </h2>
          <button onClick={onClose}>
            <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-tertiary'></i>
          </button>
        </div>
        <p className='text-text-tertiary'>Please enter your password to</p>
      </div>
      <form
        className='space-y-5'
        onSubmit={(e) => {
          e.preventDefault();
          if (!password) return toast.error('Please enter your password');
          onConfirm(password);
        }}
      >
        <PasswordInput password={password} setPassword={setPassword} />
        <Button text='Confirm' className='w-full' />
      </form>
    </Modal>
  );
}
