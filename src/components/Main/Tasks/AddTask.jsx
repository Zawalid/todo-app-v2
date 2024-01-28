import { useState } from 'react';
import { useTasks } from '../../../hooks/useTasks';

export function AddTask({ dueDate, listId, className, disabled, onAdd }) {
  const [value, setValue] = useState('');
  const { isAddingTask, handleAddTask } = useTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    const newTask = {
      title: value,
      note: '',
      dueDate: dueDate || '',
      listId: listId || 'none',
      subtasks: [],
      isCompleted: false,
      tagsIds: [],
      priority: 0,
    };
    onAdd ? onAdd( value) : handleAddTask(newTask);
    setValue('');
  };

  return (
    <div
      className={`${className} flex items-center gap-3 rounded-md bg-background-secondary  px-5 `}
    >
      <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
      <form className='w-full' onSubmit={handleSubmit}>
        <input
          type='text'
          className='w-full bg-transparent p-2 text-sm text-text-primary  transition-opacity duration-300 placeholder:text-text-tertiary focus:outline-none disabled:opacity-50'
          placeholder='Add New Task'
          name='task'
          value={value}
          disabled={isAddingTask || disabled}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </div>
  );
}
