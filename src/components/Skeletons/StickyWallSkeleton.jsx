export function StickyWallSkeleton() {
  return (
    <div className='grid h-full animate-pulse grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6 overflow-auto rounded-lg border border-background-tertiary p-5'>
      <StickyNote />
      <StickyNote />
      <StickyNote adder={true} />
    </div>
  );
}

function StickyNote({ adder }) {
  return (
    <div className='relative h-[270px] overflow-hidden rounded-lg bg-background-secondary p-5 pt-8 shadow-[rgba(3_3_3_0.08)_0px_6px_16px]'>
      {adder ? (
        <i className='fas fa-plus absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-text-primary'></i>
      ) : (
        <>
          <div className='mb-5 h-4 w-4/5 rounded-lg bg-text-secondary '></div>
          <div className='mb-3 h-2 rounded bg-text-tertiary'></div>
          <div className='mb-3 h-2 w-11/12 rounded bg-text-tertiary'></div>
          <div className='mb-3 h-2 w-10/12 rounded bg-text-tertiary'></div>
          <div className='mb-3 h-2 w-3/4 rounded bg-text-tertiary'></div>
          <div className='absolute bottom-3 left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-5 '>
            <div className='h-3 w-20 rounded bg-text-tertiary'></div>
            <div className='h-7 w-7 rounded-full bg-text-tertiary'></div>
          </div>
        </>
      )}
    </div>
  );
}
