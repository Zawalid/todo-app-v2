import { useEffect, useState } from 'react';
import { PasswordInput } from '../../Common/PasswordInput';
import { toast } from 'sonner';
import { useUser } from '../../../hooks';
import { Tab } from './Tab';

export default function Password() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isFilled, setIsFilled] = useState(false);
  const { handleUpdatePassword } = useUser();

  useEffect(() => {
    if (currentPassword && newPassword && confirmNewPassword) setIsFilled(true);
    else setIsFilled(false);
  }, [currentPassword, newPassword, confirmNewPassword]);

  function changePassword() {
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters long');
    if (newPassword !== confirmNewPassword) return toast.error('Passwords do not match');
    const updated = handleUpdatePassword(currentPassword, newPassword);
    if (updated) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }
  return (
    <Tab
      saveButton={{
        text: 'Change Password',
        onClick: changePassword,
        disabled: !isFilled,
      }}
    >
      <div className='space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Current password</h3>
          <PasswordInput
            password={currentPassword}
            setPassword={setCurrentPassword}
            placeholder='Current password'
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
          <h3 className='mb-3 font-bold text-text-secondary'>Confirm new password</h3>
          <PasswordInput
            password={confirmNewPassword}
            setPassword={setConfirmNewPassword}
            placeholder='Confirm password'
          />
        </div>
      </div>
    </Tab>
  );
}
