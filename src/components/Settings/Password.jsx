import { useEffect, useState } from 'react';
import { PasswordInput } from '../Common/PasswordInput';
import { Button } from './Button';
import { toast } from 'sonner';
import { useUser } from '../../hooks';

export function Password() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isFilled, setIsFilled] = useState(false);
  const { handleUpdatePassword } = useUser();

useEffect(() => {
  if(oldPassword && newPassword && confirmNewPassword) setIsFilled(true);
  else setIsFilled(false);
}
, [oldPassword, newPassword, confirmNewPassword]);

  function changePassword() {
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters long');
    if (newPassword !== confirmNewPassword) return toast.error('Passwords do not match');
    const updated = handleUpdatePassword(oldPassword, newPassword);
    if (updated) {
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }
  return (
    <>
      <h2 className='text-2xl font-bold text-text-primary'>Password</h2>
      <div className='mt-8 space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Old password</h3>
          <PasswordInput
            password={oldPassword}
            setPassword={setOldPassword}
            placeholder='Old password'
          />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>New password</h3>
          <PasswordInput
            password={newPassword}
            setPassword={setNewPassword}
            placeholder='New password'
          />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Confirm password</h3>
          <PasswordInput
            password={confirmNewPassword}
            setPassword={setConfirmNewPassword}
            placeholder='Confirm password'
          />
        </div>
      </div>
      <Button text='Change Password' onClick={changePassword} disabled={!isFilled} />
    </>
  );
}
