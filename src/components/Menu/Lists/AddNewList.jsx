import { useState } from 'react';
import { Colors } from '../../Common/Colors';
import { PiCheckCircle } from 'react-icons/pi';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { useAddList } from '../../../lib/react-query/mutations';
import CustomTippy from '../../Common/CustomTippy';
import { useListTitle } from '../../../hooks/useListTitle';

export function AddNewList({ reference, onClose }) {
  const { newTitle, setNewTitle, defaultTitle, error } = useListTitle();
  const [color, setColor] = useState('--custom-1');
  const { mutate: handleAddList } = useAddList();

  function handleAdd(e) {
    e.preventDefault();
    if (error) return;
    const title = newTitle.trim() === '' ? defaultTitle : newTitle;
    handleAddList({ list: { title, color } });
    setNewTitle('');
    onClose();
  }

  return (
    <div className='w-full rounded-lg border border-border p-3' ref={reference}>
      <div className='flex items-center gap-2 rounded-lg border border-border px-2'>
        <span className='h-5 w-5 rounded-[3px]' style={{ backgroundColor: `var(${color})` }}></span>
        <form className='flex-1' onSubmit={handleAdd}>
          <input
            type='text'
            className='w-full rounded-lg bg-transparent p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
            placeholder='List Name'
            name='list'
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
        </form>
        {error ? (
          <CustomTippy content={error}>
            <span>
              <FaRegCircleXmark className='text-lg text-red-500' />
            </span>
          </CustomTippy>
        ) : (
          <PiCheckCircle className='text-xl text-green-500' />
        )}
      </div>
      <div className='mt-3 flex flex-wrap items-center justify-start gap-2'>
        <Colors selectedColor={color} onSelect={(color) => setColor(color)} />
      </div>
    </div>
  );
}
