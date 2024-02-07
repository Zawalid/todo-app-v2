import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../Common/Colors';
import { useTags } from '../../../hooks/useTags';
import { PiCheckBold } from 'react-icons/pi';

export function AddNewTag({ reference, isOpen }) {
  const { handleAddTag } = useTags();
  const [value, setValue] = useState('');
  const [bgColor, setBgColor] = useState('--custom-1');
  const [textColor, setTextColor] = useState('#ffffff');
  const inputEl = useRef(null);

  const color1 = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-primary')
    .trim();
  const color2 = getComputedStyle(document.documentElement)
    .getPropertyValue('--background-secondary')
    .trim();

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
    <div className='mt-5 w-full rounded-lg border-2 border-border p-3' ref={reference}>
      <div className='flex items-center gap-2 '>
        <div className='flex flex-col gap-1'>
          <span
            className='color h-4 w-4 cursor-pointer rounded-full bg-text-primary shadow-md'
            onClick={() => setTextColor(color1)}
          >
            {textColor === color1 && <PiCheckBold size={10} style={{ color: color2 }} />}
          </span>
          <span
            className='color h-4 w-4 cursor-pointer rounded-full bg-background-primary shadow-md'
            onClick={() => setTextColor(color2)}
          >
            {textColor === color2 && <PiCheckBold size={10} style={{ color: color1 }} />}
          </span>
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
            style={{ backgroundColor: `var(${bgColor})`, color: textColor }}
            name='tag'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={inputEl}
          />
        </form>
      </div>
      <div className='mt-3 flex flex-wrap items-center justify-start gap-2'>
        <Colors selectedColor={bgColor} onSelect={(color) => setBgColor(color)} />
      </div>
    </div>
  );
}