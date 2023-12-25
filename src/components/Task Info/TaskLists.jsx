import { useLists } from "../../hooks/useLists";

export function TaskLists({ taskListId, setTaskListId }) {
  const {lists} = useLists()
  return (
    <>
      <label className='text-sm text-text-tertiary'>List</label>
      <select
        className='w-fit min-w-[100px] rounded-lg border border-zinc-200  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none'
        value={taskListId}
        onChange={(e) => setTaskListId(e.target.value)}
      >
        <option value='none'>None</option>
        {lists?.map((list) => (
          <option key={list.$id} value={list.$id}>
            {list.title}
          </option>
        ))}
      </select>
    </>
  );
}
