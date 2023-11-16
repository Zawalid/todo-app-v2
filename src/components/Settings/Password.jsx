import { PasswordInput } from '../Common/PasswordInput';
import { Button } from './Button';

export function Password() {
  return (
    <>
      <h2 className='text-2xl font-bold text-text-primary'>Password</h2>
      <div className='mt-8 space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Old password</h3>
          <PasswordInput password={null} setPassword={null} placeholder='Old password' />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>New password</h3>
          <PasswordInput password={null} setPassword={null} placeholder='New password' />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Confirm password</h3>
          <PasswordInput password={null} setPassword={null} placeholder='Confirm password' />
        </div>
      </div>
      <Button text='Change Password' />
    </>
  );
}
