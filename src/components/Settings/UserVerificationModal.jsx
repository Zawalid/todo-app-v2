import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../Common/Button';
import { PasswordInput } from '../Common/PasswordInput';

export function UserVerificationModal({ onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  return (
    <div className='fixed left-0 top-0 z-[999999] grid h-full w-full place-items-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' flex w-[90%] flex-col gap-5 rounded-lg bg-white px-5 py-4 sm:w-[500px] sm:px-8'>
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
          <Button text='Confirm' />
        </form>
      </div>
    </div>
  );
}
