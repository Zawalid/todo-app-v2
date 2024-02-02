import { useState } from 'react';
import { Button } from '../../components/Common/Button';
import { InputField } from '../../components/Common/InputField';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { handleResetPassword } = useUser();

  return (
    <section className='flex h-full flex-col items-center justify-center gap-10  md:px-10'>
      <button
        className='flex cursor-pointer items-center gap-2 self-start rounded-lg border border-border px-2 py-1  bg-background-primary'
        onClick={() => navigate(-1)}
      >
        <i className='fa-solid fa-arrow-left text-text-tertiary'></i>
        <span className='text-sm font-medium text-text-tertiary'>Back</span>
      </button>

      <h1 className=' self-start text-3xl sm:text-4xl font-bold text-text-primary'>Forgot Password?</h1>
      <p className='self-start text-sm font-medium text-text-tertiary'>
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

        <Button className='w-full' >
          Send Reset Link
        </Button>
      </form>
    </section>
  );
}
