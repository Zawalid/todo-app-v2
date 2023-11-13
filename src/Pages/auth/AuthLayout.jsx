import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import bgImage from '../../assets/bg.png';

function AuthLayout() {
  const { checkIsUserAuthenticated } = useUserAuth();

  return (
    <>
      {checkIsUserAuthenticated() ? (
        <Navigate to='/app' />
      ) : (
        <div className='grid h-full w-full  grid-cols-2 p-5'>
          <section className='grid place-content-center rounded-xl bg-black'>
            <img src={bgImage} alt='bg' className='w-[300px]' />
          </section>
          <Outlet />
        </div>
      )}
    </>
  );
}
export default AuthLayout;
