import { CheckBox } from '../../../Common/CheckBox';
import { PiCheckBold } from 'react-icons/pi';

export function TaskCheckbox({ checked, setChecked, isSelecting, isSelected }) {
  return (
    <div className='relative flex h-full'>
      <span
        className={`absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-transform duration-500   ${isSelecting ? 'scale-1' : 'scale-0'} ${isSelected ? 'border-transparent bg-primary' : 'border-border  '}
        `}
      >
        <PiCheckBold className={`text-xs text-white ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
      </span>

      <CheckBox
        checked={checked}
        onChange={() => setChecked(!checked)}
        className={'top-1/2 -translate-y-1/2 transition-transform duration-500   ' +
          (isSelecting ? 'scale-0' : 'scale-1')} />
    </div>
  );
}
