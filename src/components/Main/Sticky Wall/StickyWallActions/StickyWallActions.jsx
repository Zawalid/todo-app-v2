import { DropDown } from '../../../Common/DropDown';
import GroupBy from './GroupBy';
import OrderBy from './OrderBy';
import SortBy from './SortBy';

const options = {
  className: 'w-60',
  placement: 'auto-start',
};

export default function StickyWallActions({
  options: {
    view,
    setView,
    sortBy,
    setSortBy,
    direction,
    setDirection,
    groupBy,
    setGroupBy,
    isCompact,
    setIsCompact,
    setIsConfirmationModalOpen,
    setIsSelecting,
  },
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-3'>
        <DropDown
          toggler={<i className='fa-solid fa-arrow-up-wide-short text-xl'></i>}
          togglerClassName='not-active'
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
        <button className='not-active' onClick={() => setIsSelecting((prev) => !prev)}>
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
      </div>
      <div className='flex items-center gap-3'>
        <button className='not-active' onClick={() => setIsCompact(!isCompact)}>
          {isCompact ? (
            <i className='fa-solid fa-table-list'></i>
          ) : (
            <i className='fa-solid fa-rectangle-list'></i>
          )}
        </button>
        <button
          className={view === 'list' ? 'is-active' : 'not-active'}
          onClick={() => setView('list')}
        >
          <i className='fa-solid fa-list'></i>
        </button>
        <button
          className={view === 'grid' ? 'is-active' : 'not-active'}
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
      </div>{' '}
    </div>
  );
}
