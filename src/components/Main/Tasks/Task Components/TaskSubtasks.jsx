import { PiCheckBold } from 'react-icons/pi';

export function TaskSubtasks({ subtasks }) {
  if (!subtasks?.length > 0) return null;
  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-2 rounded-sm bg-text-secondary px-2 py-[1px] text-xs font-semibold text-background-primary'>
        <span className='border-r border-background-primary pr-2'>{subtasks.length}</span>
        <span className='flex items-center gap-1'>
          {subtasks.filter((subtask) => JSON.parse(subtask).isCompleted).length}
          <PiCheckBold />
        </span>
      </div>
      <span className='text-xs font-semibold text-text-secondary'>Subtasks</span>
    </div>
  );
}
