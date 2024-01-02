import { useEffect, useRef, useState } from 'react';
import { CheckBox } from '../../Common/CheckBox';

export function SubTask({ title, onEdit, onDelete, isCompleted, onComplete }) {
  const [checked, setChecked] = useState(isCompleted);
  const subTaskEl = useRef(null);

  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  function editSubTask() {
    function saveTitle() {
      subTaskEl.current.setAttribute('contenteditable', false);
      onEdit(subTaskEl.current.innerText);
    }
    subTaskEl.current.setAttribute('contenteditable', true);
    subTaskEl.current.focus();
    subTaskEl.current.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveTitle();
      }
    });
    subTaskEl.current.addEventListener('blur', () => saveTitle());
  }
  return (
    <li className='flex items-center gap-3'>
      <CheckBox checked={checked} onChange={() => setChecked(!checked)} />
      <p
        className={
          'border-1  flex-1 overflow-auto text-sm font-medium text-text-secondary  focus:border-zinc-200 focus:outline-none ' +
          (checked ? 'line-through' : '')
        }
        ref={subTaskEl}
      >
        {title}
      </p>
      <div className='ml-5 flex items-center'>
        <button
          className='grid h-8 w-8 place-content-center rounded-full bg-background-primary text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
          onClick={editSubTask}
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
