export function ListsSkeleton() {
  return (
    <ul className='mt-3 h-full animate-pulse space-y-4 overflow-y-auto px-3 '>
      <List />
      <List />
      <AddList />
    </ul>
  );
}

function List() {
  return (
    <li className='flex items-center  justify-between gap-4 rounded-lg pr-1 bg-background-secondary'>
      <span className='h-4 w-4 rounded-sm bg-background-tertiary'></span>
      <div className='flex h-1 flex-1'>
        <span className=' w-16 rounded-md bg-text-tertiary'></span>
      </div>
      <span className='h-4 w-6 rounded-sm mr-4 bg-background-tertiary'></span>
      <span className='h-4 w-1 rounded-md bg-text-tertiary'></span>
    </li>
  );
}

function AddList() {
  return (
    <div className='flex items-center gap-4'>
      <i className='fa-solid fa-plus text-sm text-text-tertiary'></i>
      <span className='h-1 w-20 rounded-md bg-text-tertiary'></span>
    </div>
  );
}
