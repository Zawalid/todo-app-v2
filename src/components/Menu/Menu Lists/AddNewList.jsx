import { useEffect, useMemo, useRef, useState } from 'react';
import { Colors } from '../../Common/Colors';
import { useIsTitleTaken } from '../../../hooks/useIsTitleTaken';
import { useLists } from '../../../hooks/useLists';

export function AddNewList({ reference, isOpen }) {
  const { lists, handleAddList } = useLists();
  const untitledListsNumber = useMemo(
    () => lists.filter((l) => l.title.startsWith('Untitled')).map((l) => l.title),
    [lists],
  );

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
    const untitledNumber = getTheUntitledNumber(untitledListsNumber);
    const title = value ? value : `Untitled ${untitledNumber > 0 ? `(${untitledNumber})` : ''}`;
    handleAddList(title.trim(), color);
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
            name='list'
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

function getTheUntitledNumber(untitledLists) {
  // Extract the numbers from the untitled lists (e.g. Untitled (1) => 1)
  const untitledNumber = untitledLists.map((l) => {
    const number = l.match(/\d+/g);
    return number ? +number[0] : 0;
  });
  // Sort the numbers in ascending order
  untitledNumber.sort((a, b) => a - b);
  // Get the last number
  const lastNumber = untitledNumber.at(-1);
  // Create an array of numbers from 0 to the last number
  const allNumbers = Array.from({ length: lastNumber }, (_, i) => i);
  // Find the missing numbers
  const missingNumbers = allNumbers.filter((n) => !untitledNumber.includes(n));
  // Return the first missing number or the last number + 1 if there are no missing numbers
  return missingNumbers.shift() ?? lastNumber + 1;
}
