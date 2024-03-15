import { Outlet, Navigate } from 'react-router-dom';
import bgImage from '../assets/bg.png';
import { Logo } from '../components/Common/Logo';
import { useSelector } from 'react-redux';

function AuthLayout() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/app' replace={true} />
      ) : (
        <div className='flex h-full  w-full p-5 '>
          <section className='hidden flex-[1.2] place-content-center rounded-xl bg-black md:grid'>
            <img src={bgImage} alt='bg' className='w-[300px]' />
          </section>
          <section className='h-full flex-[1.5]'>
            <Logo />
            <div className='flex h-full flex-col items-center justify-center gap-10 text-center sm:px-5 md:px-16'>
              <Outlet />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
export default AuthLayout;
