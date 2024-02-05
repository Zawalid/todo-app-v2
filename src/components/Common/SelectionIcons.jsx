import CustomTippy from './CustomTippy';
import { BiSelectMultiple } from 'react-icons/bi';
import { PiX } from 'react-icons/pi';
import { TbListCheck } from 'react-icons/tb';

export default function SelectionIcons({
  children,
  isReverse,
  isSelecting,
  allSelected,
  onSelect,
  onSelectAll,
  onUnSelectAll,
}) {
  return (
    <div className={`flex gap-3 ${isReverse ? 'flex-row-reverse' : ''}`}>
      <CustomTippy content={allSelected ? 'Unselect All' : 'Select All'}>
        <button
          className={`icon-button transition-transform duration-300 
          ${allSelected ? 'active' : 'not-active'}
          ${isSelecting ? 'scale-100' : 'scale-0'}
          `}
          onClick={() => {
            if (!isSelecting) return;
            allSelected ? onUnSelectAll() : onSelectAll();
          }}
        >
          <TbListCheck />
        </button>
      </CustomTippy>
      <CustomTippy content={isSelecting ? 'Cancel' : 'Select'}>
        <button className='icon-button not-active' onClick={onSelect}>
          {isSelecting ? <PiX /> : <BiSelectMultiple />}
        </button>
      </CustomTippy>

      {children}
    </div>
  );
}
