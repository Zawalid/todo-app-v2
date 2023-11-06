import { useEffect, useState } from 'react';
import { useTasks } from '../../../hooks/useTasks';

export function AddTask({ onAdd }) {
  const [value, setValue] = useState('');
  const { isAddingTask, addNewTaskReference } = useTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    onAdd(value);
    setValue('');
  };

  useEffect(() => {
    !isAddingTask && addNewTaskReference.current?.focus();
  }, [isAddingTask, addNewTaskReference]);

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <input
        type='text'
        className='w-full rounded-lg bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Add New Task'
        ref={addNewTaskReference}
        value={value}
        disabled={isAddingTask}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
