import { useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks';
import { Button } from './Button';
import { PasswordInput } from '../Common/PasswordInput';
import { toast } from 'sonner';

export function EditProfile() {
  const { user, handleUpdateProfile } = useUserAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);
  useEffect(() => {
    if (!name || !email) setIsUpdated(false);
  }, [name, email]);

  function handleSaveChanges() {
    if (name.length < 3) return toast.error('Name must be at least 3 characters long');
    if (!checkIsEmailValid(email)) return toast.error('Please enter a valid email');
    setIsPasswordModalOpen(true);
  }

  return (
    <>
      <h2 className='text-2xl font-bold text-text-primary'>Edit Profile </h2>
      <div className='mt-8 space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Avatar</h3>
          <div className='flex items-center gap-5'>
            <div
              className='h-20 w-20 rounded-full bg-cover'
              style={{
                backgroundImage: `url('${user?.image}')`,
              }}
            ></div>
            <div>
              <button className='rounded-lg border px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors duration-300 hover:bg-background-tertiary'>
                Upload new image
              </button>
              <p className='mb-1 mt-3 text-xs text-text-tertiary'>
                At least 5OOx500 px recommended.
              </p>
              <p className='text-xs text-text-tertiary'>JPG or PNG and GIF is allowed</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Name</h3>
          <input
            type='text'
            className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsUpdated(user?.name.trim() !== e.target.value.trim());
            }}
          />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Email</h3>
          <input
            type='email'
            className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsUpdated(user?.email.trim() !== e.target.value.trim());
            }}
          />
        </div>
      </div>
      <Button text='Save Changes' disabled={!isUpdated} onClick={handleSaveChanges} />
      {isPasswordModalOpen && (
        <UserVerificationModal
          onClose={() => setIsPasswordModalOpen(false)}
          onConfirm={async (password) => {
            await handleUpdateProfile(name, email, password);
            setIsPasswordModalOpen(false);
          }}
        />
      )}
    </>
  );
}

function UserVerificationModal({ onClose, onConfirm }) {
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

        <PasswordInput password={password} setPassword={setPassword} />
        <Button
          text='Confirm'
          onClick={() => {
            if (!password) return toast.error('Please enter your password');
            onConfirm(password);
          }}
        />
      </div>
    </div>
  );
}

function checkIsEmailValid(email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}
