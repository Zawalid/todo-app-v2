import { LiaLayerGroupSolid } from 'react-icons/lia';
import { PiCheckBold } from 'react-icons/pi';
import { IoChevronForward } from 'react-icons/io5';

import { DropDown } from '../../../Common/DropDown';

export default function GroupBy({ groupBy, setGroupBy, options }) {
  return (
    <DropDown.NestedMenu
      toggler={
        <DropDown.Button className='justify-between'>
          <LiaLayerGroupSolid /> <span className='text-start'>Group By</span>
          <IoChevronForward />
        </DropDown.Button>
      }
      options={options}
    >
      <DropDown.Button onClick={() => setGroupBy('default')} className='justify-between'>
        <span>Default</span>
        {groupBy === 'default' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('year')} className='justify-between'>
        <span>Year</span>
        {groupBy === 'year' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('month')} className='justify-between'>
        <span>Month</span>
        {groupBy === 'month' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('day')} className='justify-between'>
        <span>Day</span>
        {groupBy === 'day' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('a-z')} className='justify-between'>
        <span>A-Z</span>
        {groupBy === 'a-z' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('color')} className='justify-between'>
        <span>Color</span>
        {groupBy === 'color' && <PiCheckBold />}
      </DropDown.Button>
    </DropDown.NestedMenu>
  );
}
