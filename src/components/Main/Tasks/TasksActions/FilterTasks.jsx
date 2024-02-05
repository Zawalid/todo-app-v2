import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DropDown } from '../../../Common/DropDown';
import { MdFilterListAlt } from "react-icons/md";

const filters = [
  'all',
  'completed',
  'uncompleted',
  'overdue',
  'high-priority',
  'medium-priority',
  'low-priority',
];

export function FilterTasks({ isOnlyCompletedTasks }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    if (
      ![
        'completed',
        'uncompleted',
        'overdue',
        'high-priority',
        'medium-priority',
        'low-priority',
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
        <MdFilterListAlt className='absolute left-3 top-2 text-text-tertiary ' />
          <span className='ml-2 capitalize text-text-tertiary'>
            {filters.find((f) => f === filter) || 'All'}
          </span>
        </>
      }
      togglerClassName='relative items-center cursor-pointer rounded-lg bg-background-secondary grid flex-1'
      options={{
        className: 'w-fit',
        placement: 'bottom',
      }}
    >
      {(isOnlyCompletedTasks
        ? filters.filter((f) => !f.includes('comp')).filter((f) => !f.includes('over'))
        : filters
      ).map((value) => (
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
