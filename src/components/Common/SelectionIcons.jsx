import CustomTippy from './CustomTippy';

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
          className={`icon-button 
          ${allSelected ? 'active' : 'not-active'}
          ${isSelecting ? 'scale-100' : 'scale-0'}
          `}
          onClick={() => {
            if (!isSelecting) return;
            allSelected ? onUnSelectAll() : onSelectAll();
          }}
        >
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth='0'
            viewBox='0 0 256 256'
            height='20px'
            width='20px'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M228,128a12,12,0,0,1-12,12H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128ZM128,76h88a12,12,0,0,0,0-24H128a12,12,0,0,0,0,24Zm88,104H128a12,12,0,0,0,0,24h88a12,12,0,0,0,0-24ZM79.51,39.51,56,63l-7.51-7.52a12,12,0,0,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,127l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,191l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Z'></path>
          </svg>
        </button>
      </CustomTippy>
      <CustomTippy content={isSelecting ? 'Cancel' : 'Select'}>
        <button className='icon-button not-active' onClick={onSelect}>
          {isSelecting ? (
            <i className='fa-solid fa-xmark'></i>
          ) : (
            <svg
              stroke='currentColor'
              fill='none'
              strokeWidth='2'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='m12 15 2 2 4-4'></path>
              <rect width='14' height='14' x='8' y='8' rx='2' ry='2'></rect>
              <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'></path>
            </svg>
          )}
        </button>
      </CustomTippy>

      {children}
    </div>
  );
}
