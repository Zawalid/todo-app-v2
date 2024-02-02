import { forwardRef } from 'react';

export const InputField = forwardRef(({ ...props }, ref) => {
  return (
    <input
      {...props}
      className={
        'focus-border-none w-full rounded-md border border-border bg-background-primary p-2 text-text-secondary disabled:bg-background-disabled disabled:text-text-disabled placeholder-text-tertiary focus:outline-none ' +
        props.className
      }
      ref={ref}
    />
  );
});

InputField.displayName = 'InputField';
