import { MdOutlineSortByAlpha } from 'react-icons/md';
import { PiCheckBold } from 'react-icons/pi';
import { IoChevronForward } from 'react-icons/io5';

import { DropDown } from '../../../Common/DropDown';

export default function OrderBy({ direction, setDirection, sortBy, options }) {
  return (
    <DropDown.NestedMenu
      toggler={
        <DropDown.Button className='justify-between'>
          <MdOutlineSortByAlpha />
          <span className='text-start'>Order By</span>
          <IoChevronForward />
        </DropDown.Button>
      }
      options={options}
    >
      <DropDown.Button onClick={() => setDirection('asc')} className='justify-between'>
        <span>{sortBy === 'title' ? 'A-Z' : 'Oldest-Newest'}</span>
        {direction === 'asc' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setDirection('desc')} className='justify-between'>
        <span>{sortBy === 'title' ? 'Z-A' : 'Newest-Oldest'}</span>
        {direction === 'desc' && <PiCheckBold />}
      </DropDown.Button>
    </DropDown.NestedMenu>
  );
}
