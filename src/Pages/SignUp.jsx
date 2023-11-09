import { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  };

  return (
    <div className='grid h-full place-content-center bg-black text-center'>
      <h1 className='mb-8 text-3xl font-bold text-white'>Sign Up</h1>
      <form className='grid grid-cols-2 items-center gap-5 text-start' onSubmit={handleSubmit}>
        <label className='text-white'>Email:</label>
        <input
          type='email'
          className='rounded-md border bg-transparent p-2 text-white'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className='text-white'>Password:</label>
        <input
          type='password'
          className='rounded-md border bg-transparent p-2 text-white'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className='text-white'>Confirm Password:</label>
        <input
          type='password'
          className='rounded-md border bg-transparent p-2 text-white'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className='rounded-xl bg-white px-3 py-2 text-sm font-semibold'>Sign Up</button>
      </form>
      {error && <p className='mt-5 text-red-500'>{error}</p>}
    </div>
  );
}
