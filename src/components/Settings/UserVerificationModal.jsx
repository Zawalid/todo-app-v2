import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../Common/Button';
import { PasswordInput } from '../Common/PasswordInput';

export function UserVerificationModal({ onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  return (
    <div className='fixed left-0 top-0 z-[999999] grid h-full w-full place-content-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' flex w-[500px] flex-col gap-5 rounded-lg bg-white px-8 py-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-text-primary'>Let&apos;s verify it&apos;s you</h2>
          <button onClick={onClose}>
            <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-tertiary'></i>
          </button>
        </div>
        <p className='text-text-tertiary'>Please enter your password to</p>
        <form className='space-y-5'
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
