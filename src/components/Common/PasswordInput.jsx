import { useState } from 'react';
import { PiEyeLight, PiEyeClosedLight } from 'react-icons/pi';

export function PasswordInput({ password, setPassword, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative'>
      <input
        type={showPassword ? 'text' : 'password'}
        className='focus-border-none  w-full rounded-md border border-border bg-background-primary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none'
        placeholder={placeholder || 'Password'}
        autoComplete='off'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type='button'
        className='absolute text-text-tertiary right-2 top-[12px]'
        onClick={() => password && setShowPassword(!showPassword)}
      >
        {showPassword ? <PiEyeClosedLight size={20} /> : <PiEyeLight size={20} />}
      </button>
    </div>
  );
}
