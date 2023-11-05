import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../Colors';
import { useTags } from '../../../hooks/useTags';

export function AddNewTag({ reference, isOpen }) {
  const { handleAddTag } = useTags();
  const [value, setValue] = useState('');
  const [bgColor, setBgColor] = useState('#ff6b6b');
  const [textColor, setTextColor] = useState('#ffffff');
  const inputEl = useRef(null);
  const bgColorsDiv = useRef(null);
  const textColorsDiv = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
    function handleClick(e) {
      if (isOpen && bgColorsDiv.current && bgColorsDiv.current.contains(e.target)) {
        const color = e.target.dataset.color;
        color && setBgColor(color);
      }
      if (isOpen && textColorsDiv.current && textColorsDiv.current.contains(e.target)) {
        const color = e.target.dataset.color;
        setTextColor(color);
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
  }, [value, bgColor, isOpen]);

  function handleAdd() {
    if (!value) return;
    handleAddTag(value, bgColor, textColor);
    setValue('');
  }
  return (
    <div className='mt-5 rounded-lg border-2 border-background-tertiary p-3' ref={reference}>
      <div className='flex items-center gap-2 '>
        <div className='flex flex-col gap-1' ref={textColorsDiv}>
          <span
            className='h-4 w-4 cursor-pointer rounded-full bg-text-secondary shadow-md'
            data-color='#444'
          ></span>
          <span
            className='h-4 w-4 cursor-pointer rounded-full bg-background-primary shadow-md'
            data-color='#fff'
          ></span>
        </div>
        <form
          className='flex-1'
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <input
            type='text'
            className='w-full rounded-lg p-2 text-sm  placeholder:text-white focus:outline-none'
            placeholder='Tag Name'
            style={{ backgroundColor: bgColor, color: textColor }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={inputEl}
          />
        </form>
      </div>
      <div className='mt-3 flex flex-wrap items-center justify-start gap-2' ref={bgColorsDiv}>
        <Colors />
      </div>
    </div>
  );
}
