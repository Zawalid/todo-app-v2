import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { toast } from 'sonner';
import { PasswordInput } from './PasswordInput';
import { useTrash } from '../../hooks/useTrash';

function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { handleSignUp, isLoading } = useUserAuth();
  const { createTrash } = useTrash();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password)
      return toast.error('Please fill all the fields');
    try {
      await handleSignUp({ name: `${firstName} ${lastName}`, email, password });
      createTrash();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex h-full flex-col items-center justify-center gap-10  text-center'>
      <h1 className=' text-3xl font-bold text-text-primary'>Sign Up</h1>
      <form className='flex w-3/4 flex-col gap-6' onSubmit={handleSubmit}>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          <input
            type='text'
            className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type='text'
            className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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
              <span>Signing Up...</span>
            </div>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      <div className='flex items-center justify-center gap-2'>
        <p className='text-sm font-medium text-text-tertiary'>Already have an account?</p>
        <Link to='/sign-in' className='text-sm font-semibold text-text-primary'>
          Sign In
        </Link>
      </div>
    </div>
  );
}
export default SignUpForm;
