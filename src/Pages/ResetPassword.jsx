import { useState } from 'react';
import { PasswordInput } from '../components/Common/PasswordInput';
import { useUser } from '../hooks';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Common/Button';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isResetPasswordSuccessful, setIsResetPasswordSuccessful] = useState(false);
  const { handleRecoverPassword } = useUser();
  const [searchParams] = useSearchParams();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8'>
      {isResetPasswordSuccessful ? (
        <>
          <h1 className='text-3xl font-bold tracking-tighter text-text-primary '>
            Password Reset Successful
          </h1>
          <div className='w-[500px] space-y-6'>
            <p className='text-center text-text-tertiary'>
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Button>
              <Link to='/sign-in'>Login</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl font-bold tracking-tighter text-text-primary '>Reset Password</h1>
          <form
            className='w-[500px] space-y-6 '
            onSubmit={(e) => {
              e.preventDefault();
              handleRecoverPassword(
                searchParams.get('userId'),
                searchParams.get('secret'),
                newPassword,
                confirmNewPassword,
                setIsResetPasswordSuccessful,
              );
            }}
          >
            <PasswordInput
              password={newPassword}
              setPassword={setNewPassword}
              placeholder='New password'
            />

            <PasswordInput
              password={confirmNewPassword}
              setPassword={setConfirmNewPassword}
              placeholder='Confirm password'
            />

            <Button text='Reset Password' />
          </form>
        </>
      )}
    </div>
  );
}
