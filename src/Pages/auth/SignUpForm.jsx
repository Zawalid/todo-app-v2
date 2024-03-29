import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../../hooks/useUser';
import { AuthLink } from './AuthLink';
import { Button } from '../../components/Common/Button';
import { PasswordInput } from '../../components/Common/PasswordInput';
import { InputField } from '../../components/Common/InputField';

function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignUp, isLoading } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password)
      return toast.error('Please fill all the fields');
    try {
      await handleSignUp({ name: `${firstName} ${lastName}`, email, password });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
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

        <PasswordInput value={password}
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)} />
        <Button isLoading={isLoading} className='w-full'>
          Sign Up
        </Button>
      </form>
      <AuthLink text='Sign In' link='/sign-in' />
    </>
  );
}
export default SignUpForm;
