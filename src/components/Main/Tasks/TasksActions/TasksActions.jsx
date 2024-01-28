import { FilterTasks } from './FilterTasks';
import { SortTasks } from './SortTasks';

export function TasksActions({ tasksLength, onDeleteAll }) {
  return (
    <div className='mt-3  p-2'>
      <div className='mb-3 grid grid-cols-2  gap-3'>
        <FilterTasks />
        <button
          className={
            'rounded-lg px-6 py-1 font-semibold text-white  ' +
            (tasksLength > 0 ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300')
          }
          onClick={() => tasksLength > 0 && onDeleteAll()}
        >
          Delete All
        </button>
      </div>

      <SortTasks />
    </div>
  );
}
