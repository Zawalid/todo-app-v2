import { useRef } from 'react';
import Drawer from '../../Common/Drawer';

export default function TaskActions({ onClose, onEdit, onDelete, onCopy, date }) {
  const overlayRef = useRef(null);
  return (
    <Drawer onClose={onClose} overlayRef={overlayRef}>
      <div>
        <button className='menu_element w-full justify-items-start' onClick={onCopy}>
          <i className='fa-solid fa-clone  text-lg text-text-secondary'></i>
          <span className='font-semibold text-text-primary'>Copy to clipboard</span>
        </button>
        <button className='menu_element w-full justify-items-start' onClick={onEdit}>
          <i className='fa-solid fa-pen text-lg text-text-secondary'></i>
          <span className='font-semibold text-text-primary'>Edit Task</span>
        </button>
        <button
          className='menu_element w-full justify-items-start text-text-error
           hover:bg-red-500 hover:text-white'
          onClick={onDelete}
        >
          <i className='fa-solid fa-trash-can  text-lg '></i>
          <span className='font-semibold '>Delete Task</span>
        </button>
      </div>
      <div className='mt-2 border-t-2 border-zinc-200 pt-3'>
        <p className='mb-1 text-xs font-medium text-text-tertiary '>
          Created :{' '}
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(date.created))}
        </p>
        <p className='text-xs font-medium text-text-tertiary '>
          Last modified :{' '}
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(date.updated))}
        </p>
      </div>
    </Drawer>
  );
}
