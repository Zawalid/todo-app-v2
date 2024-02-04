export  function TagsSkeleton() {
  return (
    <div className='flex  animate-pulse gap-3'>
      <Tag />
      <Tag />
      <Tag />
    </div>
  );
}

function Tag() {
  return (
    <div className='grid place-content-center rounded-md bg-background-tertiary p-3'>
      <span className='h-1 w-12 rounded-md bg-text-tertiary'></span>
    </div>
  );
}
