import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main>
      <div className='mx-auto flex h-screen max-w-screen-xl items-center justify-start px-4 md:px-8'>
        <div className='mx-auto max-w-lg space-y-5 text-center'>
          <h3 className='font-semibold text-indigo-600'>404 Error</h3>
          <p className='text-4xl font-semibold text-gray-800 sm:text-5xl'>Page not found</p>
          <p className='text-gray-600'>
            Sorry, the page you are looking for could not be found or has been removed.
          </p>
          <Link
            to={-1}
            className='block w-fit m-auto rounded-lg bg-primary px-4 py-2 font-medium text-white duration-150 hover:bg-primary-hover active:bg-indigo-700'
          >
            Go back
          </Link>
        </div>
      </div>
    </main>
  );
}
