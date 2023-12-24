import { TaskInfo } from '../components/Task Info/TaskInfo';
import { Menu } from '../components/Menu/Menu';
import { Main } from '../components/Main/Main';
import { SearchProvider } from '../contexts';
import { useFetchAllElements, useUser } from '../hooks';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

function AppLayout() {
  const { checkIsUserAuthenticated } = useUser();
  const { handleFetchAllElements, handleClearAllElements } = useFetchAllElements();

  useEffect(() => {
    if (checkIsUserAuthenticated()) {
      handleFetchAllElements();
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFetchAllElements();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      !checkIsUserAuthenticated() && handleClearAllElements();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
