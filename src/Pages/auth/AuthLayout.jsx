import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';

function AuthLayout() {
  const { checkIsUserAuthenticated } = useUserAuth();

  return <>{checkIsUserAuthenticated() ? <Navigate to='/app' /> : <Outlet />}</>;
}
export default AuthLayout;
