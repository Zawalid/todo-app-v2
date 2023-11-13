import { useState } from 'react';
import { toast } from 'sonner';
import { useUserAuth } from '../../../hooks/useUserAuth';
import { useTrash } from '../../../hooks/useTrash';
import { Button, PasswordInput, InputField, AuthLink } from './components';

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
    <div className='flex h-full flex-col items-center justify-center gap-10 px-16  text-center'>
      <h1 className='self-start text-4xl font-bold text-text-primary'>Sign Up</h1>
      <form className='flex w-full flex-col gap-6' onSubmit={handleSubmit}>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          <InputField
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <InputField
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput password={password} setPassword={setPassword} />
        <Button isLoading={isLoading} text='Sign Up' />
      </form>
      <AuthLink text='Sign In' link='/sign-in' />
    </div>
  );
}
export default SignUpForm;
