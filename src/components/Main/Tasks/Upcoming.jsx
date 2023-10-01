import { SmallTitle } from '../Title';
import { AddTask } from './AddTask';
import { Task } from './Task';

export function Upcoming({ tasks, onAdd, onOpen, onComplete, lists, tags }) {
  return (
    <div className='flex flex-wrap gap-5'>
      <div className='w-full rounded-lg  border border-background-tertiary p-4'>
        <SmallTitle title='Today' />
        <AddTask
          onAdd={(title) => {
            onAdd(title, 'today');
          }}
        />
        <ul className='mt-3 space-y-2'>
          {tasks.get('today').map((task) => (
            <Task
              key={task.id}
              task={task}
              onOpen={() => onOpen(task)}
              onComplete={onComplete}
              lists={lists}
              tags={tags}
            />
          ))}
        </ul>
      </div>
      <div className='min-w-[340px] flex-1 rounded-lg border border-background-tertiary p-4'>
        <SmallTitle title='Tomorrow' />
        <Tomorrow />
      </div>
      <div className='min-w-[340px] flex-1 rounded-lg border border-background-tertiary p-4'>
        <SmallTitle title='This Week' />
        <ThisWeek />
      </div>
      <div className='min-w-[340px] flex-1 rounded-lg border border-background-tertiary p-4'>
        <SmallTitle title='This Month' />
        <ThisWeek />
      </div>
      <div className='min-w-[340px] flex-1 rounded-lg border border-background-tertiary p-4'>
        <SmallTitle title='This Year' />
        <ThisWeek />
      </div>
    </div>
  );
}
function Tomorrow() {
  return (
    <div>
      <div className='flex items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <input
          type='text'
          className='w-full rounded-lg bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Add New Task'
        />
      </div>
      {/* <ul className='mt-3 space-y-2'>
        <li className='flex items-center justify-between gap-3 border-b border-background-tertiary px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className='flex-1 text-sm font-medium text-text-secondary'>
            Create job posting for SEO specialist
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
        <li className='flex items-center justify-between  gap-3 px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className=' flex-1 text-sm font-medium text-text-secondary'>
            Request design assets for landing page
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
      </ul> */}
    </div>
  );
}
function ThisWeek() {
  return (
    <div>
      <div className='flex items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <input
          type='text'
          className='w-full rounded-lg bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Add New Task'
        />
      </div>
      {/* <ul className='mt-3 space-y-2'>
        <li className='flex items-center justify-between gap-3 border-b border-background-tertiary px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className='flex-1 text-sm font-medium text-text-secondary'>
            Research content ideas
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
        <li className='flex items-center justify-between  gap-3 border-b border-background-tertiary px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className=' flex-1 text-sm font-medium text-text-secondary'>
            Create a database of guest authors
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
        <li className='flex items-center justify-between  gap-3 border-b border-background-tertiary px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className=' flex-1 text-sm font-medium text-text-secondary'>
            Renew driver&#39;s license
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
        <li className='flex items-center justify-between  gap-3 border-b border-background-tertiary px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className=' flex-1 text-sm font-medium text-text-secondary'>
            Consult accountant
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
        <li className='flex items-center justify-between  gap-3 px-5 pb-2'>
          <div className='relative'>
            <input type='checkbox' id='some_id' className=' peer ' />
            <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
          </div>
          <span className=' flex-1 text-sm font-medium text-text-secondary'>
            Print business cards
          </span>
          <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
        </li>
      </ul> */}
    </div>
  );
}
