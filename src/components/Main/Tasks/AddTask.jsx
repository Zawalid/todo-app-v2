import { useState } from 'react';
import { useTasks } from '../../../hooks/useTasks';

export function AddTask({ dueDate, listId, disabled }) {
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
    handleAddTask(newTask);
    setValue('');
  };

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <input
        type='text'
        className='w-full rounded-lg bg-transparent p-2 text-sm text-text-tertiary  transition-opacity duration-300 placeholder:text-text-tertiary focus:outline-none disabled:opacity-50'
        placeholder='Add New Task'
        name='task'
        value={value}
        disabled={isAddingTask || disabled}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
