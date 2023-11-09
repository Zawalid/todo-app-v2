import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`email: ${email}, Password: ${password}`);
  };

  return (
    <div className='grid h-full place-content-center bg-black text-center'>
      <h1 className='mb-8 text-3xl font-bold text-white'>Login</h1>
      <form className='grid grid-cols-2 items-center gap-5 text-start' onSubmit={handleSubmit}>
        <label className='text-white'>Email:</label>
        <input
          type='email'
          className='rounded-md border bg-transparent p-2 text-white'
          placeholder='Email'
          value={email}
          onChange={handleEmailChange}
        />
        <label className='text-white'>Password:</label>
        <input
          type='password'
          className='rounded-md border bg-transparent p-2 text-white'
          placeholder='Password'
          value={password}
          onChange={handlePasswordChange}
        />
        <button className='rounded-xl bg-white px-3 py-2 text-sm font-semibold'>Login</button>
      </form>
    </div>
  );
}
