import { FilterTasks } from './FilterTasks';
import { SortTasks } from './SortTasks';

export function TasksActions({ tasksLength, onClearAll }) {
  return (
    <div className='mt-3 overflow-auto'>
      <div className='mb-3 flex  gap-3'>
        <FilterTasks />
        <button
          className={
            'flex-1 rounded-lg px-6 py-1 font-bold text-white transition-colors duration-300 ' +
            (tasksLength > 0 ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300')
          }
          onClick={() => tasksLength > 0 && onClearAll()}
        >
          Clear All
        </button>
      </div>
      <div className='flex items-center gap-4'>
        <h5 className=' text-text-secondary' style={{ textWrap: 'nowrap' }}>
          Sort By
        </h5>
        <SortTasks />
      </div>
    </div>
  );
}
