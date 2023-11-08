import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function FilterTasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  // Remove the filter query param if the selected filter is 'all' or if the filter doesn't exist
  useEffect(() => {
    if (
      ![
        'completed',
        'uncompleted',
        'overdue',
        'highPriority',
        'mediumPriority',
        'lowPriority',
      ].includes(filter)
    )
      setSearchParams((prev) => {
        prev.delete('filter');
        return prev;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='relative flex-1'>
      <i className='fas fa-filter absolute left-3 top-2 text-text-tertiary '></i>
      <select
        className='w-full cursor-pointer rounded-lg bg-background-secondary py-1 pl-10 text-text-tertiary  focus:outline-none
        '
        value={filter}
        onChange={(e) => {
          const filter = e.target.value;
          const sortParams = {
            sort: searchParams.get('sort'),
            direction: searchParams.get('direction'),
          };
          if (filter === 'all') setSearchParams(searchParams.has('sort') ? sortParams : '');
          else setSearchParams(searchParams.has('sort') ? { filter, ...sortParams } : { filter });
        }}
      >
        <option value='all'>All</option>
        <option value='completed'>Completed</option>
        <option value='uncompleted'>Uncompleted</option>
        <option value='overdue'>Overdue</option>
        <option value='highPriority'>High Priority</option>
        <option value='mediumPriority'>Medium Priority</option>
        <option value='lowPriority'>Low Priority</option>
      </select>
    </div>
  );
}
