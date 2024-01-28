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
        <div className='rounded-xl sm:grid h-full w-full grid-cols-[auto_1fr] bg-background-secondary p-5 sm:grid-cols-2'>
          <section className='hidden place-content-center rounded-xl bg-black sm:grid'>
            <img src={bgImage} alt='bg' className='w-[300px]' />
          </section>
          <div className='h-full '>
            <Logo />
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
export default AuthLayout;
