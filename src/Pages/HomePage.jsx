import { Link } from 'react-router-dom';

const HomePage = () => {
  const isAuthenticated = true;
  return (
    <div className='grid h-full place-content-center bg-black text-center'>
      <h1 className='text-3xl font-bold text-white'>Welcome to Task Manager</h1>
      <p className='my-8 text-slate-400'>Stay organized and get things done with our app.</p>
      <div className='flex items-center justify-center gap-5'>
        {isAuthenticated && (
          <Link to='/app' className='rounded-xl bg-white px-3 py-2 text-sm font-semibold'>
            View Tasks
          </Link>
        )}
        {!isAuthenticated && (
          <>
            <Link to='/login' className='rounded-xl bg-white px-3 py-2 text-sm font-semibold'>
              Login
            </Link>
            <Link to='/signUp' className='rounded-xl bg-white px-3 py-2 text-sm font-semibold'>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
