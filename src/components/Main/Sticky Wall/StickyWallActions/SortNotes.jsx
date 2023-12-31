import { DropDown } from '../../../Common/DropDown';

export default function SortNotes({ options: { sortBy, setSortBy, direction, setDirection } }) {
  return (
    <>
      <DropDown.Title>Sort by</DropDown.Title>
      <DropDown.Button onClick={() => setSortBy('$createdAt')} className='justify-between'>
        <span>Creation date</span>
        {sortBy === '$createdAt' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setSortBy('$updatedAt')} className='justify-between'>
        <span>Modification date</span>
        {sortBy === '$updatedAt' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setSortBy('title')} className='justify-between'>
        <span>Title</span>
        {sortBy === 'title' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Divider />
      <DropDown.Title>Sort direction</DropDown.Title>
      <DropDown.Button onClick={() => setDirection('asc')} className='justify-between'>
        <span>Ascending</span>
        {direction === 'asc' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
      <DropDown.Button onClick={() => setDirection('desc')} className='justify-between'>
        <span>Descending</span>
        {direction === 'desc' && <i className='fa-solid fa-check'></i>}
      </DropDown.Button>
    </>
  );
}
