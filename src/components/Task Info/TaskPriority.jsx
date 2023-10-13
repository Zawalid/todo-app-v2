
export const TaskPriority = ({taskPriority,setTaskPriority}) => {
  return (
    <>
      <label className='text-sm text-text-tertiary'>Priority</label>
      <select
        className='w-fit min-w-[100px] rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none'
        value={taskPriority}
        onChange={(e) => setTaskPriority(e.target.value)}
      >
        <option value='none'>None</option>
        <option value='0'>Low</option>
        <option value='1'>Medium</option>
        <option value='2'>High</option>
      </select>
    </>
  )
}
