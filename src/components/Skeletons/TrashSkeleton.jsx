export function TrashSkeleton() {
  return (
    <div className='relative flex h-full animate-pulse flex-col overflow-auto '>
      <div className='flex items-center  gap-8 border-b-2 pb-3'>
        <div className='h-3 w-24 rounded-md bg-text-secondary'></div>
        <div className='h-3 w-24 rounded-md bg-text-secondary'></div>
        <div className='h-3 w-24 rounded-md bg-text-secondary'></div>
        <div className='h-3 w-28 rounded-md bg-text-secondary'></div>
      </div>
      <ul className='mt-5 h-full animate-pulse space-y-2 overflow-y-auto '>
        <Item />
        <Item />
        <Item />
      </ul>
      <div className='mt-auto flex-wrap gap-x-5 gap-y-2 flex items-center justify-between border-t-2 pt-3'>
        <div className='h-6 flex-1 sm:flex-none min-w-[140px] w-28 rounded-lg bg-text-secondary'></div>
        <div className='h-6 flex-1 sm:flex-none min-w-[140px] w-28 rounded-lg bg-text-secondary'></div>
      </div>
      <div className='mt-2 h-2 w-1/2 self-center rounded-lg bg-background-tertiary'></div>
    </div>
  );
}

function Item() {
  return (
    <li className='flex items-center justify-between  rounded-lg bg-background-secondary  px-3 py-2'>
      <span className=' h-1 w-20 rounded-md bg-text-tertiary'></span>
      <div className='flex gap-3'>
        <span className='h-5 w-6 rounded-lg bg-text-tertiary'></span>
        <span className='h-5 w-6 rounded-lg bg-text-tertiary'></span>
      </div>
    </li>
  );
}
