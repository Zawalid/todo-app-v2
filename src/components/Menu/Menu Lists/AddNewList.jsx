import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../Colors';
import { useIsTitleTaken } from '../../../hooks/useIsTitleTaken';

export function AddNewList({ reference, onAdd, isOpen, untitledTasksNumber, lists }) {
  const [value, setValue] = useState('');
  const [color, setColor] = useState('#ff6b6b');
  const inputEl = useRef(null);
  const colorsDiv = useRef(null);
  const [isTitleTaken, , setTitle] = useIsTitleTaken(lists);
  useEffect(() => {
    inputEl.current.focus();
    function handleClick(e) {
      if (isOpen && e.target.tagName === 'SPAN') {
        const color = e.target.dataset.color;
        setColor(color);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen]);
  useEffect(() => {
    function handleKeyDown(e) {
      e.key === 'Enter' && isOpen && e.target.tagName !== 'INPUT' && handleAdd();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [value, color, isOpen]);

  function handleAdd() {
    const untitledNumber = value || untitledTasksNumber.current++;
    const title = value ? value : `Untitled ${untitledNumber > 0 ? `(${untitledNumber})` : ''}`;
    onAdd(title.trim(), color);
    setValue('');
  }

  return (
    <div className='rounded-lg  border-2 border-background-tertiary p-3' ref={reference}>
      <div className='flex items-center gap-2 rounded-lg border border-background-tertiary px-2'>
        <span className='h-4 w-4 rounded-[3px]' style={{ backgroundColor: color }}></span>
        <form
          className='flex-1'
          onSubmit={(e) => {
            e.preventDefault();
            !isTitleTaken && handleAdd();
          }}
        >
          <input
            type='text'
            className='w-full rounded-lg bg-transparent p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
            placeholder='List Name'
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTitle(e.target.value);
            }}
            ref={inputEl}
          />
        </form>
        {value.trim() !== '' &&
          (isTitleTaken ? (
            <i className='fa-regular fa-circle-xmark text-text-error'></i>
          ) : (
            <i className='fa-regular fa-circle-check text-green-500'></i>
          ))}
      </div>
      <div className='mt-3 flex flex-wrap items-center justify-start gap-2' ref={colorsDiv}>
        <Colors />
      </div>
    </div>
  );
}
