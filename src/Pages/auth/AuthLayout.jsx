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
        <div className='grid h-full w-full  grid-cols-2 p-5'>
          <section className='grid place-content-center rounded-xl bg-black'>
            <Logo color='white' className='absolute top-8 left-8' />
            <img src={bgImage} alt='bg' className='w-[300px]' />
          </section>
          <Outlet />
        </div>
      )}
    </>
  );
}
export default AuthLayout;
