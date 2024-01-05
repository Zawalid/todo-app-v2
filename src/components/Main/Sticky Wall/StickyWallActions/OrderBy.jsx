import { DropDown } from '../../../Common/DropDown';

export default function OrderBy({  direction, setDirection, sortBy }) {
  return (
    <DropDown.NestedMenu
      toggler={ <DropDown.Button className='justify-between'>
      <i className='fa-solid fa-arrow-down-z-a'></i>{' '}
      <span className='flex-1 text-start'>Order By</span>
      <i className='fa-solid fa-chevron-right'></i>
    </DropDown.Button>}
      options={{
        className: 'w-60',
        placement: 'right-start',
      }}
    >
      <DropDown.Button onClick={() => setDirection('asc')} className='justify-between'>
        <span>{sortBy === 'title' ? 'A-Z' : 'Oldest-Newest'}</span>
        {direction === 'asc' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setDirection('desc')} className='justify-between'>
        <span>{sortBy === 'title' ? 'Z-A' : 'Newest-Oldest'}</span>
        {direction === 'desc' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
    </DropDown.NestedMenu>
  );
}
