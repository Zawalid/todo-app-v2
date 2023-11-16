import { useState } from 'react';
import { toast } from 'sonner';
import { useUserAuth } from '../../../hooks/useUserAuth';
import { Button, AuthLink } from './components';
import { PasswordInput } from '../../../components/Common/PasswordInput';
import { InputField } from '../../../components/Common/InputField';

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
    <section className='flex flex-col items-center justify-center gap-10 px-16  text-center'>
      <h1 className=' self-start text-4xl font-bold text-text-primary'>Sign In</h1>
      <form className='flex w-full flex-col gap-6' onSubmit={handleSubmit}>
        <InputField
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput password={password} setPassword={setPassword} />
        <Button isLoading={isLoading} text='Sign In' />
      </form>
      <AuthLink text='Sign Up' link='/sign-up' />
    </section>
  );
}
export default SignInForm;
