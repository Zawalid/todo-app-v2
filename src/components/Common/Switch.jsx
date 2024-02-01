import { forwardRef } from 'react';

const Switch = forwardRef(({ ...props }, ref) => {
  return (
    <label className='relative inline-flex cursor-pointer items-center'>
      <input
        type='checkbox'
        className='peer sr-only'
        {...props}
        ref={ref}
      />
      <div className="peer h-5 w-9 rounded-full bg-background-tertiary after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full   after:bg-white after:transition-all  after:duration-300  after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full  peer-focus:outline-none rtl:peer-checked:after:-translate-x-full "></div>
    </label>
  );
});

Switch.displayName = 'Switch';
export default Switch;
