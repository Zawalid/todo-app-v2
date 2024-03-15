import { BiSolidError } from 'react-icons/bi';

export default function Error({ title, message }) {
  return (
    <div className='row-span-3 flex flex-col items-center justify-center gap-4 text-center'>
      <BiSolidError className='text-5xl text-red-500 sm:text-7xl' />
      <div className='space-y-2'>
        <h2 className='font-bold text-text-primary sm:text-lg lg:text-xl'>
          {title || 'Something went wrong'}
        </h2>
        <p className='text-sm  font-medium text-text-secondary sm:text-base'>
          {message || 'There was an unexpected error. Please try again later.'}
        </p>
      </div>
    </div>
  );
}
