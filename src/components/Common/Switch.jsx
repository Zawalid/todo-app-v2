import { forwardRef } from 'react';

const Switch = forwardRef(({ disabled,...props }, ref) => {
  return (
    <label className='relative inline-flex  items-center'>
      <input
        type='checkbox'
        className='peer sr-only'
        {...props}
        disabled={disabled}
        ref={ref}
      />
      <div className={`peer h-5 w-9 rounded-full bg-background-tertiary after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full    after:transition-all  after:duration-300  after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full  peer-focus:outline-none after:bg-white rtl:peer-checked:after:-translate-x-full ${disabled ? 'after:opacity-50 ' : 'cursor-pointer'} `}></div>
    </label>
  );
});

Switch.displayName = 'Switch';
export default Switch;
