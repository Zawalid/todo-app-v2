import { isTouchDevice } from "../../utils/helpers";

export function TasksSkeleton({ number }) {
  return (
    <ul className='mt-3 h-full animate-pulse space-y-2 overflow-y-auto '>
      <AddTask />
      {Array.from({ length: number }).map((_, i) => (
        <Task key={i} />
      ))}
    </ul>
  );
}

function Task() {
  return (
    <li className='flex items-center  justify-between gap-4 rounded-lg bg-background-secondary p-5'>
      <span className="h-5 w-5 rounded-sm bg-background-tertiary"></span>
      <div className='flex h-1 flex-1'>
        <span className=' w-20 rounded-md bg-text-tertiary'></span>
      </div>
      {!isTouchDevice() &&<span className="h-5 w-2 rounded-lg bg-text-tertiary"></span>}
    </li>
  );
}

function AddTask() {
  return (
    <div className='mb-3  flex flex-1 items-center gap-3 rounded-xl border border-zinc-200 px-5 py-2'>
      <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
      <span className='h-1 w-1/2 rounded-md bg-text-tertiary'></span>
    </div>
  );
}
