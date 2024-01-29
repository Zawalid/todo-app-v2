import { DropDown } from '../../../Common/DropDown';
import CustomTippy from '../../../Common/CustomTippy';
import GroupBy from './GroupBy';
import OrderBy from './OrderBy';
import SortBy from './SortBy';
import SelectionIcons from '../../../Common/SelectionIcons';

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
  isSelecting,
  setIsSelecting,
  selectAll,
  unSelectAll,
  allSelected,
  deleteAll,
}) {
  return (
    <div className='flex items-center justify-between'>
      <SelectionIcons
        isReverse={true}
        isSelecting={isSelecting}
        allSelected={allSelected}
        onSelect={() => {
          setIsSelecting((prev) => !prev);
          setIsCollapsed(false);
        }}
        onSelectAll={selectAll}
        onUnSelectAll={unSelectAll}
      >
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

          <DropDown.Button onClick={deleteAll} isDeleteButton={true}>
            <i className='fa-solid fa-trash-can '></i>
            <span>Delete All</span>
          </DropDown.Button>
        </DropDown>
      </SelectionIcons>

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
