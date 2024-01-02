import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DropDown } from '../../../Common/DropDown';

export function FilterTasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const filters = [
    {
      label: 'All',
      value: 'all',
      onClick: () => handleFilterChange('all'),
    },
    {
      label: 'Completed',
      value: 'completed',
      onClick: () => handleFilterChange('completed'),
    },
    {
      label: 'Uncompleted',
      value: 'uncompleted',
      onClick: () => handleFilterChange('uncompleted'),
    },
    {
      label: 'Overdue',
      value: 'overdue',
      onClick: () => handleFilterChange('overdue'),
    },
    {
      label: 'High Priority',
      value: 'high-priority',
      onClick: () => handleFilterChange('high-priority'),
    },
    {
      label: 'Medium Priority',
      value: 'medium-priority',
      onClick: () => handleFilterChange('medium-priority'),
    },
    {
      label: 'Low Priority',
      value: 'low-priority',
      onClick: () => handleFilterChange('low-priority'),
    },
  ];

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
          <span className='text-text-tertiary ml-2'>
            {filters.find(({ value }) => value === filter)?.label || 'All'}
          </span>
        </>
      }
      togglerClassName='relative items-center cursor-pointer rounded-lg bg-background-secondary grid flex-1'
      options={{
        className: 'w-fit',
        placement : 'bottom'
      }}
    >
      {filters.map(({ label, value, onClick }) => (
        <DropDown.Button key={value} onClick={onClick} isCurrent={filter === value}>
          <span>{label}</span>
        </DropDown.Button>
      ))}
    </DropDown>
  );
}
