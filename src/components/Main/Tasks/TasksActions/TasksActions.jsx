import { Button } from '../../../Common/Button';
import { FilterTasks } from './FilterTasks';
import { SortTasks } from './SortTasks';

export function TasksActions({ tasksLength, onDeleteAll,isOnlyCompletedTasks }) {
  return (
    <div className='mt-3 p-2'>
      <div className='mb-3 grid grid-cols-2  gap-3'>
        <FilterTasks isOnlyCompletedTasks={isOnlyCompletedTasks} />
        <Button type={tasksLength > 0 ? 'delete' : 'disabled' } size='small' disabled={tasksLength === 0} onClick={ onDeleteAll}>
          Delete All
        </Button>
      </div>

      <SortTasks />
    </div>
  );
}
