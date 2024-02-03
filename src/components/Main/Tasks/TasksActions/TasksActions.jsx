import { Button } from '../../../Common/Button';
import { FilterTasks } from './FilterTasks';
import { SortTasks } from './SortTasks';

export function TasksActions({ tasksLength, onDeleteAll }) {
  return (
    <div className='mt-3 p-2'>
      <div className='mb-3 grid grid-cols-2  gap-3'>
        <FilterTasks />
        <Button type='delete' size='small' onClick={() => tasksLength > 0 && onDeleteAll()}>
          Delete All
        </Button>
      </div>

      <SortTasks />
    </div>
  );
}
