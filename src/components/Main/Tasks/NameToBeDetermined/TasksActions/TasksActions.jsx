import { FilterTasks } from './FilterTasks';
import { SortTasks } from './SortTasks';

export function TasksActions({ tasksLength, onClearAll }) {
  return (
    <div className='mt-3 overflow-auto'>
      <div className='mb-3 grid grid-cols-2  gap-3'>
        <FilterTasks />
        <button
          className={
            'rounded-lg px-6 py-1 font-semibold text-white transition-colors duration-300 ' +
            (tasksLength > 0 ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300')
          }
          onClick={() => tasksLength > 0 && onClearAll()}
        >
          Clear All
        </button>
      </div>

      <SortTasks />
    </div>
  );
}
