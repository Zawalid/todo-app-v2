import { DropDown } from '../../../Common/DropDown';

export default function SortBy({ sortBy, setSortBy,options }) {
  return (
    <DropDown.NestedMenu
      toggler={
        <DropDown.Button className='justify-between'>
        <i className='fa-solid fa-arrow-down-wide-short'></i>{' '}
        <span className='flex-1 text-start'>Sort By</span>
        <i className='fa-solid fa-chevron-right'></i>
      </DropDown.Button>
      }
      options={options}
    >
      <DropDown.Button onClick={() => setSortBy('createdAt')} className='justify-between'>
        <span>Creation date</span>
        {sortBy === 'createdAt' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setSortBy('updatedAt')} className='justify-between'>
        <span>Modification date</span>
        {sortBy === 'updatedAt' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setSortBy('title')} className='justify-between'>
        <span>Title</span>
        {sortBy === 'title' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
    </DropDown.NestedMenu>
  );
}
