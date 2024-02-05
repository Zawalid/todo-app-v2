import { PiCheckBold, PiSortAscending } from 'react-icons/pi';
import { IoChevronForward } from "react-icons/io5";
import { DropDown } from '../../../Common/DropDown';

export default function SortBy({ sortBy, setSortBy,options }) {
  return (
    <DropDown.NestedMenu
      toggler={
        <DropDown.Button className='justify-between'>
<PiSortAscending />        <span className='text-start'>Sort By</span>
        <IoChevronForward />     
         </DropDown.Button>
      }
      options={options}
    >
      <DropDown.Button onClick={() => setSortBy('createdAt')} className='justify-between'>
        <span>Creation date</span>
        {sortBy === 'createdAt' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setSortBy('updatedAt')} className='justify-between'>
        <span>Modification date</span>
        {sortBy === 'updatedAt' && <PiCheckBold />}
      </DropDown.Button>
      <DropDown.Button onClick={() => setSortBy('title')} className='justify-between'>
        <span>Title</span>
        {sortBy === 'title' && <PiCheckBold />}
      </DropDown.Button>
    </DropDown.NestedMenu>
  );
}
