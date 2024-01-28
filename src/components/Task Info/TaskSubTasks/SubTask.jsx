import { useEffect, useState } from 'react';
import { CheckBox } from '../../Common/CheckBox';

export function SubTask({ title, onEdit, onDelete, isCompleted, onComplete }) {
  const [checked, setChecked] = useState(isCompleted);
  const [subtask, setSubtask] = useState(title || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li className='flex items-center gap-3'>
      <CheckBox checked={checked} onChange={() => setChecked(!checked)} />
      <input
        type='text'
        className={
          ' flex-1 truncate rounded-md  p-1 bg-transparent text-sm font-medium text-text-secondary outline-none ' +
          (checked ? 'line-through ' : '') +
          (isEditing ? 'border border-border' : '')
        }
        readOnly={!isEditing}
        value={subtask}
        onChange={(e) => (setSubtask(e.target.value), onEdit(e.target.value))}
        onBlur={() => (setIsEditing(false), onEdit(subtask))}
      />
      <div className='ml-5 flex items-center'>
        <button
          className='grid h-8 w-8 place-content-center rounded-full bg-background-primary text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
          onClick={(e) => {
            e.target.parentElement.parentElement.parentElement
              .querySelector('[type="text"]')
              ?.focus();
            setIsEditing(!isEditing);
          }}
        >
          <i className='fas fa-pen cursor-pointer'></i>
        </button>
        <button
          className='grid h-8 w-8 place-content-center rounded-full bg-background-primary text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
          onClick={onDelete}
        >
          <i className='fas fa-trash cursor-pointer'></i>
        </button>
      </div>
    </li>
  );
}
