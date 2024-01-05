import { DropDown } from '../../../Common/DropDown';

export default function GroupBy({ groupBy, setGroupBy }) {
  return (
    <DropDown.NestedMenu
      toggler={
        <DropDown.Button className='justify-between'>
          <i className='fa-solid fa-layer-group'></i>{' '}
          <span className='flex-1 text-start'>Group By</span>
          <i className='fa-solid fa-chevron-right'></i>
        </DropDown.Button>
      }
      options={{
        className: 'w-60',
        placement: 'right-start',
      }}
    >
      <DropDown.Button onClick={() => setGroupBy('default')} className='justify-between'>
        <span>Default</span>
        {groupBy === 'default' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('year')} className='justify-between'>
        <span>Year</span>
        {groupBy === 'year' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('month')} className='justify-between'>
        <span>Month</span>
        {groupBy === 'month' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('day')} className='justify-between'>
        <span>Day</span>
        {groupBy === 'day' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('a-z')} className='justify-between'>
        <span>A-Z</span>
        {groupBy === 'a-z' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setGroupBy('color')} className='justify-between'>
        <span>Color</span>
        {groupBy === 'color' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
    </DropDown.NestedMenu>
  );
}
