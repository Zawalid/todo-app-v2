import { useState } from 'react';

export function AddTask({ onAdd }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    onAdd(value);
    setValue('');
  };
  return (
    <div className='flex flex-1 items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
      <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
      <form className='w-full' onSubmit={handleSubmit}>
        <input
          type='text'
          className='w-full rounded-lg bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Add New Task'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </div>
  );
}
