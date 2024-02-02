import { PiInfo } from 'react-icons/pi';
import CustomTippy from './CustomTippy';

export function Label({ htmlFor, label, error }) {
  return (
    <div className='mb-3 flex  items-center gap-3'>
      <label htmlFor={htmlFor} className='font-bold text-text-secondary'>
        {label}
      </label>
      {error && (
        <CustomTippy content={error}>
          <span>
            <PiInfo className='text-red-500' size={20} />
          </span>
        </CustomTippy>
      )}
    </div>
  );
}
