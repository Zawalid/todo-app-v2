import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function SortTasks() {
  return (
    <div className='flex flex-wrap gap-3'>
      <Button sortKey='title' title='Title' />
      <Button sortKey='dDate' title='Due Date' />
      <Button sortKey='cDate' title='Creation Date' />
      <Button sortKey='priority' title='Priority' />
    </div>
  );
}
function Button({ sortKey, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'cDate';
  const direction = searchParams.get('direction') || 'asc';
  const isActive = sort === sortKey;

  // Remove the sort and direction query params if the selected sort is 'cDate' and direction is 'asc' or if the sort doesn't exist
  useEffect(() => {
    if (
      !['cDate', 'dDate', 'priority', 'title'].includes(sort) ||
      (sort === 'cDate' && direction === 'asc')
    )
      setSearchParams((prev) => {
        prev.delete('sort');
        prev.delete('direction');
        return prev;
      });
  }, [sort, direction, setSearchParams]);

  return (
    <button
      className='relative min-w-[150px] flex-1  rounded-lg bg-background-secondary px-4 py-1  text-center text-text-tertiary'
      onClick={() => {
        const filter = searchParams.get('filter');
        const sortParams = {
          sort: sortKey,
          direction: direction === 'asc' ? 'desc' : 'asc',
        };
        setSearchParams(searchParams.has('filter') ? { filter, ...sortParams } : sortParams);
      }}
    >
      <i
        className={`fa-solid ${
          direction === 'asc' ? 'fa-sort-up' : 'fa-sort-desc '
        } absolute left-2 mr-3 ${isActive ? '' : 'hidden'}`}
      ></i>
      {title}
    </button>
  );
}
