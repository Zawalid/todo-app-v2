export function TaskDueDate({ taskDueDate, setTaskDueDate }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <label className='text-sm text-text-tertiary'>Due date</label>
      <input
        type='date'
        className='w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none'
        min={today}
        value={taskDueDate || ''}
        onChange={(e) => setTaskDueDate(e.target.value)} />
    </>
  );
}
