import { useEffect, useRef } from 'react';
import { FilterTasks } from './FilterTasks';
import { SortTasks } from './SortTasks';

export function TasksActions({
  filter,
  onSelect,
  onClearAll,
  sortDirection,
  setSortDirection,
  setSortKey,
}) {
  const sortButtons = useRef(null);

  useEffect(() => {
    const buttonsDiv = sortButtons.current;
    function callback(e) {
      if (e.target.tagName === 'BUTTON') {
        buttonsDiv.querySelectorAll('i').forEach((icon) => {
          icon.classList.add('hidden');
        });
        e.target.children[0].classList.remove('hidden');

        sortDirection === 'asc'
          ? e.target.children[0].classList.replace('fa-sort-up', 'fa-sort-down')
          : e.target.children[0].classList.replace('fa-sort-down', 'fa-sort-up');

        setSortKey(e.target.dataset.key);
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      }
    }
    buttonsDiv?.addEventListener('click', callback);
    return () => buttonsDiv?.removeEventListener('click', callback);
  }, [sortButtons, sortDirection, setSortDirection, setSortKey]);

  return (
    <div className='mt-3 overflow-auto'>
      <div className='mb-3 flex  gap-3'>
        <FilterTasks filter={filter} onSelect={onSelect} />
        <button
          className='flex-1 rounded-lg bg-red-500 px-6 py-1 font-bold text-white'
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>
      <div className='flex items-center gap-4'>
        <h5 className=' text-text-secondary'>Sort By</h5>
        <SortTasks reference={sortButtons} />
      </div>
     
    </div>
  );
}
