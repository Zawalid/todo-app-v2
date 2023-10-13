import { DueDate } from './DueDate';

export function TaskDueDate({ taskDueDate, setTaskDueDate }) {
  return (
    <>
      <label className='text-sm text-text-tertiary'>Due date</label>
      <DueDate taskDueDate={taskDueDate} setTaskDueDate={setTaskDueDate} />
    </>
  );
}
