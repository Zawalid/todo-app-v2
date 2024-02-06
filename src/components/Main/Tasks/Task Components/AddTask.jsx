import { useState } from 'react';
import { useTasks } from '../../../../hooks/useTasks';
import { PiPlusBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';

export function AddTask({ dueDate, listId, className, disabled, onAdd }) {
  const [value, setValue] = useState('');
  const { isAddingTask, handleAddTask } = useTasks();
  const { defaultDueDate, defaultPriority } = useSelector((state) => state.settings.general.tasks);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    const newTask = {
      title: value,
      note: '',
      dueDate: dueDate || defaultDueDate,
      listId: listId || 'none',
      subtasks: [],
      isCompleted: false,
      tagsIds: [],
      priority: defaultPriority,
    };
    onAdd ? onAdd(value) : handleAddTask(newTask);
    setValue('');
  };

  return (
    <div
      className={`${className} flex items-center gap-3 rounded-md px-5 transition-colors duration-200 ${
        disabled ? 'bg-background-disabled ' : 'bg-background-secondary '
      }`}
    >
      <PiPlusBold className={`text-xl ${disabled ? 'text-text-disabled' : 'text-text-tertiary'}`} />
      <form className='w-full' onSubmit={handleSubmit}>
        <input
          type='text'
          className='w-full  bg-transparent p-2.5 text-sm text-text-primary  outline-none placeholder:text-text-tertiary disabled:text-text-disabled disabled:placeholder:text-text-disabled '
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
