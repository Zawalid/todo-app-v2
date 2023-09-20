export function TaskTitleAndDesc({ taskTitle, setTaskTitle, taskDescription, setTaskDescription }) {
  return (
    <div className='my-5'>
      <input
        type='text'
        className='w-full rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Task Title'
        value={taskTitle || ''}
        onChange={(e) => setTaskTitle(e.target.value)} />
      <textarea
        className='mt-2 h-32 w-full resize-none  rounded-lg  border  border-background-tertiary bg-transparent p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Description'
        value={taskDescription || ''}
        onChange={(e) => setTaskDescription(e.target.value)}
      ></textarea>
    </div>
  );
}
