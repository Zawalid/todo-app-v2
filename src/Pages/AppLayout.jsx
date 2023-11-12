import { TaskInfo } from '../components/Task Info/TaskInfo';
import { Menu } from '../components/Menu/Menu';
import { Main } from '../components/Main/Main';
import '../styles/App.css';
import { SearchProvider } from '../contexts';
import { useUserAuth } from '../hooks/useUserAuth';
import { Navigate } from 'react-router-dom';

function AppLayout() {
  const { isAuthenticated } = useUserAuth();
  return (
    <>
      {isAuthenticated ? (
        <div className='flex h-full gap-2  bg-background-primary p-5'>
          <SearchProvider>
            <Menu />
            <Main />
          </SearchProvider>
          <TaskInfo />
        </div>
      ) : (
        <Navigate to='/sign-in' />
      )}
    </>
  );
}
export default AppLayout;
