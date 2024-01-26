import { DropDown } from '../../../Common/DropDown';
import CustomTippy from '../../../Common/CustomTippy';
import GroupBy from './GroupBy';
import OrderBy from './OrderBy';
import SortBy from './SortBy';

const options = {
  className: 'w-60',
  placement: 'auto-start',
};

export default function StickyWallActions({
  view,
  setView,
  sortBy,
  setSortBy,
  direction,
  setDirection,
  groupBy,
  setGroupBy,
  isCollapsed,
  setIsCollapsed,
  setIsConfirmationModalOpen,
  isSelecting,
  setIsSelecting,
  selectAll,
  unSelectAll,
  allSelected,
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-3'>
        <DropDown
          toggler={<i className='fa-solid fa-ellipsis-v'></i>}
          togglerClassName='icon-button not-active'
          options={{ className: 'w-60 max-h-[100%]', shouldCloseOnClick: false }}
        >
          <SortBy sortBy={sortBy} setSortBy={setSortBy} options={options} />
          <OrderBy
            direction={direction}
            setDirection={setDirection}
            sortBy={sortBy}
            options={options}
          />
          <GroupBy groupBy={groupBy} setGroupBy={setGroupBy} options={options} />

          <DropDown.Divider />

          <DropDown.Button onClick={() => setIsConfirmationModalOpen(true)} isDeleteButton={true}>
            <i className='fa-solid fa-trash-can '></i>
            <span>Delete All</span>
          </DropDown.Button>
        </DropDown>
        <CustomTippy content={isSelecting ? 'Cancel' : 'Select'}>
          <button
            className='icon-button not-active'
            onClick={() => {
              setIsSelecting((prev) => !prev);
              setIsCollapsed(false);
            }}
          >
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
        <CustomTippy content={allSelected ? 'Unselect All' : 'Select All'}>
          <button
            className={`icon-button 
            ${allSelected ? 'active' : 'not-active'}
            ${isSelecting ? 'scale-100' : 'scale-0'}
            `}
            onClick={() => {
              if (!isSelecting) return;
              allSelected ? unSelectAll() : selectAll();
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
      </div>
      <div className='flex items-center gap-3'>
        <CustomTippy content={isCollapsed ? 'Expand' : 'Collapse'}>
          <button className='icon-button not-active' onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? (
              <i className='fa-solid fa-table-list'></i>
            ) : (
              <i className='fa-solid fa-rectangle-list'></i>
            )}
          </button>
        </CustomTippy>
        <CustomTippy content='List View'>
          <button
            className={view === 'list' ? 'icon-button active' : 'icon-button not-active'}
            onClick={() => setView('list')}
          >
            <i className='fa-solid fa-list'></i>
          </button>
        </CustomTippy>
        <CustomTippy content='Grid View'>
          <button
            className={view === 'grid' ? 'icon-button active' : 'icon-button not-active'}
            onClick={() => setView('grid')}
          >
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 512 512'
              height='16px'
              width='16px'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M204 240H68a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zm240 0H308a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM204 480H68a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zm240 0H308a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36z'></path>
            </svg>
          </button>
        </CustomTippy>
      </div>
    </div>
  );
}
