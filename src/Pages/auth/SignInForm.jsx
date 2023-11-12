import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { toast } from 'sonner';
import { PasswordInput } from './PasswordInput';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignIn, isLoading } = useUserAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    if (!password) return toast.error('Please enter your password');
    await handleSignIn(email, password);
  }

  return (
    <div className='flex h-full flex-col items-center justify-center gap-10  text-center'>
      <h1 className=' text-3xl font-bold text-text-primary'>Sign In</h1>
      <form className='flex w-3/4 flex-col gap-6' onSubmit={handleSubmit}>
        <input
          type='email'
          className='focus-border-none  rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput password={password} setPassword={setPassword} />

        <button
          className='mx-auto flex w-1/2  justify-center rounded-lg bg-text-secondary py-2 text-white
        '
        >
          {isLoading ? (
            <div className='flex items-center gap-3 text-white'>
              <i className='fa-solid fa-spinner animate-spin'></i>
              <span>Signing In...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      <div className='flex items-center justify-center gap-2'>
        <p className='text-sm font-medium text-text-tertiary'>Don&apos;t have an account?</p>
        <Link to='/sign-up' className='text-sm font-semibold text-text-primary'>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
export default SignInForm;
