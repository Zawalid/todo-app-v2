import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../Common/Button';
import { PasswordInput } from '../Common/PasswordInput';
import Modal from '../Common/Modal';
import { PiX } from 'react-icons/pi';

export function UserVerificationModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      className='flex w-[90%] flex-col gap-5  border px-5 py-4 sm:w-[500px] sm:px-8'
      overlayClassName='z-50'
    >
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-text-primary sm:text-2xl'>
            Let&apos;s verify it&apos;s you
          </h2>
          <button className='icon-button not-active small' onClick={onClose}>
            <PiX />
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
        <PasswordInput
          value={password}
          placeholder='Enter your password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className='w-full'>Confirm</Button>
      </form>
    </Modal>
  );
}
