import { useEffect, useRef, useState } from 'react';

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
      <div className='relative'>
        <input
          type='checkbox'
          className='subtask peer'
          checked={checked}
          onChange={() => setChecked(!checked)} />
        <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
      </div>
      <p
        className={'border-1 flex-1 text-sm font-medium text-text-secondary  focus:border-zinc-200 focus:outline-none ' +
          (checked ? 'line-through' : '')}
        ref={subTaskEl}
      >
        {title}
      </p>
      <div className='flex items-center gap-2'>
        <button onClick={editSubTask}>
          <i className='fas fa-pen cursor-pointer text-xs text-text-tertiary'></i>
        </button>
        <button onClick={onDelete}>
          <i className='fas fa-trash cursor-pointer text-xs text-text-tertiary'></i>
        </button>
      </div>
    </li>
  );
}
