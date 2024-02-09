import { isTouchDevice } from '../../utils/helpers';
import { TasksSkeleton } from './TasksSkeleton';

export function TaskInfoSkeleton() {
  return (
    <>
      <div className='animate-pulse pb-3'>
        <div className='h-3 w-1/3 rounded-full bg-text-tertiary'></div>
      </div>
      <div className={`animate-pulse space-y-8 overflow-auto ${isTouchDevice() ? '' : 'pr-3'}`}>
        <div>
          <div className='mt-4 h-8  rounded-md bg-background-tertiary'></div>
          <div className='mt-2 h-32  rounded-md bg-background-tertiary'></div>
        </div>
        <div className='grid grid-cols-[80px_150px] items-center justify-between gap-y-2'>
          <div className='h-3 rounded-md bg-background-secondary'></div>
          <div className='h-9 rounded-md bg-background-tertiary'></div>
          <div className='h-3 rounded-md bg-background-secondary'></div>
          <div className='h-9 rounded-md bg-background-tertiary'></div>
          <div className='h-3 rounded-md bg-background-secondary'></div>
          <div className='h-9 rounded-md bg-background-tertiary'></div>
          <div className='h-3 rounded-md bg-background-secondary'></div>
          <div className='h-9 rounded-md bg-background-tertiary'></div>
        </div>
        <div className='space-y-5'>
          <div className='mr-2 h-3 w-32 rounded-full bg-text-tertiary'></div>
          <TasksSkeleton number={2} type='subtask' />
        </div>
      </div>
     {!isTouchDevice() &&  <div className='animate-pulse grid grid-cols-2 gap-4 pt-3'>
        <span className='rounded-md bg-background-secondary py-4'></span>
        <span className='rounded-md bg-background-secondary py-4'></span>
      </div>}
    </>
  );
}
