import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../../hooks/';
import { AuthLink } from './AuthLink';
import { Button } from '../../components/Common/Button';
import { PasswordInput } from '../../components/Common/PasswordInput';
import { InputField } from '../../components/Common/InputField';
import { Link } from 'react-router-dom';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignIn, isLoading } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    if (!password) return toast.error('Please enter your password');
    await handleSignIn(email, password);
  }

  return (
    <>
      <h1 className=' self-start text-4xl font-bold text-text-primary'>Sign In</h1>
      <form className='flex w-full flex-col gap-6' onSubmit={handleSubmit}>
        <InputField
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput password={password} setPassword={setPassword} />
        <Button isLoading={isLoading}  className='w-full' >
          Sign In
        </Button>
        <Link className='self-start text-sm font-semibold text-text-tertiary' to='/forgot-password'>
          Forgot Password?
        </Link>
      </form>
      <AuthLink text='Sign Up' link='/sign-up' />
    </>
  );
}
export default SignInForm;
