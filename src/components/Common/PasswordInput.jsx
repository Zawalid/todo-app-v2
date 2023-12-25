import { useState } from 'react';

export function PasswordInput({ password, setPassword, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative'>
      <input
        type={showPassword ? 'text' : 'password'}
        className='focus-border-none  w-full rounded-md border bg-background-primary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none'
        placeholder={placeholder || 'Password'}
        autoComplete='off'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type='button'
        className='absolute right-2 top-2'
        onClick={() => password && setShowPassword(!showPassword)}
      >
        <i className={`fa-solid fa-${showPassword ? 'eye-slash' : 'eye'} text-text-tertiary`}></i>
      </button>
    </div>
  );
}
