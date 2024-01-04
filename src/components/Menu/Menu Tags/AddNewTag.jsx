import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../Common/Colors';
import { useTags } from '../../../hooks/useTags';
import { useColorPicker } from '../../../hooks/useColorPicker';

export function AddNewTag({ reference, isOpen }) {
  const { handleAddTag } = useTags();
  const [value, setValue] = useState('');
  const [bgColor, setBgColor] = useState('#ff6b6b');
  const [textColor, setTextColor] = useState('#ffffff');
  const inputEl = useRef(null);
  const bgColorsDiv = useColorPicker((color) => setBgColor(color), bgColor);
  const textColorsDiv = useColorPicker((color) => setTextColor(color), textColor);

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
    <div className='mt-5 w-fit rounded-lg border-2 border-zinc-200 p-3' ref={reference}>
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
            name='tag'
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
