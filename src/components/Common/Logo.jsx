import { Link } from 'react-router-dom';

export function Logo({ color = 'black',className }) {
  return (
    <Link className='flex items-center justify-center' to='/'>
      <svg
        className={'h-8 w-8 ' + className}
        fill='none'
        height='24'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        viewBox='0 0 24 24'
        width='24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
      </svg>
      <span className='sr-only'>TaskMaster</span>
    </Link>
  );
}
