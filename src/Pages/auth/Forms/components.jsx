import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Button({ isLoading, text }) {
  return (
    <button className='mx-auto flex w-full justify-center rounded-lg bg-text-secondary py-2 font-medium text-white'>
      {isLoading ? (
        <div className='flex items-center gap-3 text-white'>
          <i className='fa-solid fa-spinner animate-spin'></i>
          <span>{`${text.split(' ')[0]}ing ${text.split(' ')[1]}...`}</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
}

export function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative'>
      <input
        type={showPassword ? 'text' : 'password'}
        className='focus-border-none  w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none'
        placeholder='Password'
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

export function AuthLink({ text, link }) {
  return (
    <div className='flex items-center justify-center gap-2'>
      <p className='text-sm font-medium text-text-tertiary'>
        {text === 'Sign In' ? 'Already' : "Don't"} have an account?
      </p>
      <Link to={link} className='text-sm font-semibold text-text-primary'>
        {text}
      </Link>
    </div>
  );
}
