import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';

function AuthLayout() {
  const { isAuthenticated } = useUserAuth();

  return <>{isAuthenticated ? <Navigate to='/app' /> : <Outlet />}</>;
}
export default AuthLayout;
