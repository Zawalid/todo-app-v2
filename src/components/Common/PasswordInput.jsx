import { forwardRef, useState } from 'react';
import { PiEyeLight, PiEyeClosedLight } from 'react-icons/pi';
import { InputField } from './InputField';

export const PasswordInput = forwardRef(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative'>
      <InputField type={showPassword ? 'text' : 'password'} {...props} ref={ref} />
      <button
        type='button'
        className='absolute right-2 top-[12px] text-text-tertiary'
        onClick={() => props.value && setShowPassword(!showPassword)}
      >
        {showPassword ? <PiEyeClosedLight size={20} /> : <PiEyeLight size={20} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
