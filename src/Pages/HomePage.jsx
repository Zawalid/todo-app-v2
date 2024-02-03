import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Logo } from '../components/Common/Logo';
import ResetPassword from './ResetPassword';
import { useEffect } from 'react';

const HomePage = () => {
  const { checkIsUserAuthenticated } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isResetPassword = searchParams.get('userId') && searchParams.get('secret');

  useEffect(() => {
    checkIsUserAuthenticated() && navigate('/app');
  }, [checkIsUserAuthenticated, navigate]);

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <header className='flex h-14 items-center px-4 lg:px-6'>
        <Logo />
        {!isResetPassword && (
          <nav className='ml-auto flex items-center  sm:gap-6'>
            <Link
              className=' flex h-9 items-center border-border pr-4 font-medium text-text-primary sm:border-r'
              to='sign-in'
            >
              Sign In
            </Link>

            <GetStartedButton />
          </nav>
        )}
      </header>
      {isResetPassword ? (
        <ResetPassword />
      ) : (
        <section className='grid w-full flex-1 place-content-center py-12 md:py-24 lg:py-32'>
          <div className=' px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-7 text-center'>
              <h1 className='text-3xl font-bold tracking-tighter text-text-primary sm:text-5xl'>
                Manage Your Tasks Effortlessly
              </h1>
              <p className='mx-auto max-w-[700px] text-text-tertiary  md:text-xl'>
                I Do provides an easy and efficient way to manage all your tasks. Stay organized and
                get more done.
              </p>
              <GetStartedButton />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

function GetStartedButton() {
  return (
    <Link
      className='rounded-lg bg-primary px-5 py-2 font-medium text-white shadow  hover:bg-primary-hover '
      to='/sign-up'
    >
      Get Started
    </Link>
  );
}
