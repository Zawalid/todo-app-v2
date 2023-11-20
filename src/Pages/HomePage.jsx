import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Logo } from '../components/Common/Logo';

const HomePage = () => {
  const { checkIsUserAuthenticated, handleSignOut } = useUser();
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='flex h-14 items-center px-4 lg:px-6'>
        <Logo />
        <nav className='ml-auto flex items-center  sm:gap-6'>
          {checkIsUserAuthenticated() ? (
            <button
              className=' flex h-9 items-center border-r pr-4 font-medium'
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          ) : (
            <Link className=' flex h-9 items-center border-r pr-4 font-medium' to='sign-in'>
              Sign In
            </Link>
          )}
          <GetStartedButton />
        </nav>
      </header>
      <section className='grid w-full flex-1 place-content-center py-12 md:py-24 lg:py-32'>
        <div className=' px-4 md:px-6'>
          <div className='flex flex-col items-center space-y-7 text-center'>
            <h1 className='text-3xl font-bold tracking-tighter text-text-primary sm:text-5xl'>
              {checkIsUserAuthenticated()
                ? 'Welcome back to TaskMaster'
                : ' Manage Your Tasks Effortlessly'}
            </h1>
            <p className='mx-auto max-w-[700px] text-text-tertiary  md:text-xl'>
              TaskMaster provides an easy and efficient way to manage all your tasks. Stay organized
              and get more done.
            </p>
            <GetStartedButton />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

function GetStartedButton() {
  const { checkIsUserAuthenticated } = useUser();

  return (
    <Link
      className='rounded-lg bg-text-secondary px-5 py-2 font-medium text-white shadow transition-colors '
      to={checkIsUserAuthenticated() ? '/app' : '/sign-up'}
    >
      {checkIsUserAuthenticated() ? 'Go to App' : 'Get Started'}
    </Link>
  );
}
