import { DropDown } from '../../../Common/DropDown';
import CustomTippy from '../../../Common/CustomTippy';
import GroupBy from './GroupBy';
import OrderBy from './OrderBy';
import SortBy from './SortBy';
import SelectionIcons from '../../../Common/SelectionIcons';
import { PiDotsThreeOutlineVerticalFill, PiGridFourFill, PiListBold, PiTrash } from 'react-icons/pi';
import { TbLayoutNavbarExpandFilled,TbLayoutNavbarCollapseFilled } from "react-icons/tb";

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
          toggler={<PiDotsThreeOutlineVerticalFill />}
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
            <PiTrash />
            <span>Delete All</span>
          </DropDown.Button>
        </DropDown>
      </SelectionIcons>

      <div className='flex items-center gap-3'>
        <CustomTippy content={isCollapsed ? 'Expand' : 'Collapse'}>
          <button className='icon-button not-active' onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? 
              <TbLayoutNavbarExpandFilled />             : 
                <TbLayoutNavbarCollapseFilled />            
            }
          </button>
        </CustomTippy>
        <CustomTippy content='List View'>
          <button
            className={view === 'list' ? 'icon-button active' : 'icon-button not-active'}
            onClick={() => setView('list')}
          >
<PiListBold />
          </button>
        </CustomTippy>
        <CustomTippy content='Grid View'>
          <button
            className={view === 'grid' ? 'icon-button active' : 'icon-button not-active'}
            onClick={() => setView('grid')}
          >
            <PiGridFourFill />
          </button>
        </CustomTippy>
      </div>
    </div>
  );
}
