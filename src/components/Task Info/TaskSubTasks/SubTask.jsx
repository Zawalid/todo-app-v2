import { useEffect, useState } from 'react';
import { CheckBox } from '../../Common/CheckBox';
import { PiPen, PiTrash } from 'react-icons/pi';

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
      <div className='flex gap-1 items-center'>
        <button
          className='icon-button not-active small'
          onClick={(e) => {
            e.target.parentElement.parentElement.parentElement
              .querySelector('[type="text"]')
              ?.focus();
            setIsEditing(!isEditing);
          }}
        >
          <PiPen />
        </button>
        <button
          className='icon-button not-active small '
          onClick={onDelete}
        >
          <PiTrash />
        </button>
      </div>
    </li>
  );
}
