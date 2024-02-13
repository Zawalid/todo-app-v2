import { PiTrash } from 'react-icons/pi';
import { TbRestore } from 'react-icons/tb';
import CustomTippy from '../../Common/CustomTippy';

export function Item({ item, onDelete, onRestore }) {
  return (
    <li className='flex items-center justify-between gap-5 rounded-lg bg-background-secondary px-3 py-1'>
      <span className='truncate text-sm font-medium text-text-secondary'>
        {item.title || 'Untitled'}
      </span>
      <div className='flex'>
        <CustomTippy content='Restore'>
          <button className='icon-button not-active' onClick={() => onRestore({ id: item.$id })}>
            <TbRestore />
          </button>
        </CustomTippy>
        <CustomTippy content='Delete Permanently'>
          <button className='icon-button not-active' onClick={() => onDelete(item.$id)}>
            <PiTrash />
          </button>
        </CustomTippy>
      </div>
    </li>
  );
}
