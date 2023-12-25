import { TasksSkeleton } from "./TasksSkeleton";

export  function UpcomingSkeleton() {
  return (
    <div className='flex animate-pulse h-full flex-wrap gap-5 overflow-auto p-2'>
      <Period first={true} number={1} />
      <Period  number={2}/>
      <Period  number={3}/>
    </div>
  );
}

function Period({ first,number }) {
  return (
    <div
      className={
        'relative  flex max-h-[400px] min-w-full sm:min-w-[400px] flex-1 flex-col rounded-lg  border border-zinc-200 bg-background-primary px-4 ' +
        (first ? 'w-full basis-auto' : '')
      }
    >
      <div className='mb-3 flex border-b  py-5'>
        <span className='h-2 w-28 rounded-md bg-text-secondary'></span>
      </div>
      <TasksSkeleton number={number} />
    </div>
  );
}
