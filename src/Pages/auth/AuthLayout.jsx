import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import bgImage from '../../assets/bg.png';
import { Logo } from '../../components/Common/Logo';

function AuthLayout() {
  const { checkIsUserAuthenticated } = useUser();

  return (
    <>
      {checkIsUserAuthenticated() ? (
        <Navigate to='/app' replace={true} />
      ) : (
        <div className='grid h-full w-full grid-cols-[auto_1fr] p-5 sm:grid-cols-2'>
          <section className='hidden place-content-center rounded-xl bg-black sm:grid'>
            <Logo color='white' className='absolute left-8 top-8' />
            <img src={bgImage} alt='bg' className='w-[300px]' />
          </section>
          <Logo color='black' className='absolute left-8 top-8 sm:hidden' />
          <Outlet />
        </div>
      )}
    </>
  );
}
export default AuthLayout;
