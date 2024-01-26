import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DropDown } from '../../../Common/DropDown';

const filters = [
  'all',
  'completed',
  'uncompleted',
  'overdue',
  'high-priority',
  'medium-priority',
  'low-priority',
];

export function FilterTasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

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
      setSearchParams(
        (prev) => {
          prev.delete('filter');
          return prev;
        },
        { replace: true },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterChange(filter) {
    const sortParams = {
      sort: searchParams.get('sort'),
      direction: searchParams.get('direction'),
    };
    setSearchParams(
      filter === 'all'
        ? searchParams.has('sort')
          ? sortParams
          : ''
        : searchParams.has('sort')
        ? { filter, ...sortParams }
        : { filter },
      { replace: true },
    );
  }

  return (
    <DropDown
      toggler={
        <>
          <i className='fas fa-filter absolute left-3 top-2 text-text-tertiary '></i>
          <span className='ml-2 capitalize text-text-tertiary'>
            {filters.find(({ value }) => value === filter)?.value || 'All'}
          </span>
        </>
      }
      togglerClassName='relative items-center cursor-pointer rounded-lg bg-background-secondary grid flex-1'
      options={{
        className: 'w-fit',
        placement: 'bottom',
      }}
    >
      {filters.map((value) => (
        <DropDown.Button
          key={value}
          onClick={() => handleFilterChange(value)}
          isCurrent={filter === value}
        >
          <span className='capitalize'>{value}</span>
        </DropDown.Button>
      ))}
    </DropDown>
  );
}
