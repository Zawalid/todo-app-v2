import { PiTrash } from 'react-icons/pi';
import { TbRestore } from "react-icons/tb";
import CustomTippy from '../../Common/CustomTippy';

export function Item({ title, onDelete, onRestore }) {
  return (
    <li className='flex gap-5 items-center justify-between rounded-lg bg-background-secondary px-3 py-1'>
      <span className='text-sm font-medium text-text-secondary truncate'>{title || 'Untitled'}</span>
      <div className='flex'>
        <CustomTippy content='Restore'>
          <button
            className='icon-button not-active'
            onClick={onRestore}
          >
<TbRestore />
          </button>
        </CustomTippy>
        <CustomTippy content='Delete Permanently'>
          <button
            className='icon-button not-active'
            onClick={onDelete}
          >
            <PiTrash />
          </button>
        </CustomTippy>
      </div>
    </li>
  );
}
