export const TaskPriority = ({ taskPriority, setTaskPriority }) => {
  return (
    <>
      <label className='text-sm text-text-tertiary'>Priority</label>
      <select
        className='w-fit min-w-[100px] rounded-lg border border-zinc-200  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none'
        value={taskPriority}
        onChange={(e) => setTaskPriority(+e.target.value)}
      >
        <option value='0'>None</option>
        <option value='1'>Low</option>
        <option value='2'>Medium</option>
        <option value='3'>High</option>
      </select>
    </>
  );
};
