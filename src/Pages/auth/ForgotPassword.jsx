import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Common/Button';
import { InputField } from '../../components/Common/InputField';
import { useUser } from '../../hooks/useUser';
import { IoChevronBack } from 'react-icons/io5';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { handleResetPassword } = useUser();

  return (
    <>
      <button
        className='flex cursor-pointer items-center gap-2 self-start rounded-lg border border-border px-2 py-1 transition-colors text-text-tertiary duration-200 hover:bg-background-secondary'
        onClick={() => navigate(-1)}
      >
        <IoChevronBack />
        <span className='text-sm font-medium '>Back</span>
      </button>

      <h1 className=' self-start text-3xl font-bold text-text-primary sm:text-4xl'>
        Forgot Password?
      </h1>
      <p className='text-start text-sm font-medium text-text-tertiary'>
        Enter your email address below and we&apos;ll send you a link to reset your password.
      </p>
      <form
        className='flex w-full flex-col gap-6'
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword(email);
        }}
      >
        <InputField
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button className='w-full'>Send Reset Link</Button>
      </form>
    </>
  );
}
