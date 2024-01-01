import { TaskInfo } from '../components/Task Info/TaskInfo';
import { Menu } from '../components/Menu/Menu';
import { Main } from '../components/Main/Main';
import { SearchProvider } from '../contexts';
import {  useTrash, useUser } from '../hooks';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useFetchAllElements } from './useFetchAllElements';

function AppLayout() {
  const { checkIsUserAuthenticated, user } = useUser();
  const { handleFetchAllElements, handleDeleteAllElements } = useFetchAllElements();
  const { initializeTrash } = useTrash();

  useEffect(() => {
    const fetch = () => {
      handleFetchAllElements();
      initializeTrash(user);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetch();
    };
    if (checkIsUserAuthenticated()) {
      fetch();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    return () => {
      !checkIsUserAuthenticated() && handleDeleteAllElements();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {checkIsUserAuthenticated() ? (
        <div className='flex h-full gap-2 bg-background-primary p-2'>
          <SearchProvider>
            <Menu />
            <Main />
          </SearchProvider>
          <TaskInfo />
        </div>
      ) : (
        <Navigate to='/sign-in' replace={true} />
      )}
    </>
  );
}
export default AppLayout;
