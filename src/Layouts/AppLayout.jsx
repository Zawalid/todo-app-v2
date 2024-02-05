import { TaskInfo } from '../components/Task Info/TaskInfo';
import { Menu } from '../components/Menu/Menu';
import { useTrash, useUser } from '../hooks';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useFetchAllElements } from '../hooks/useFetchAllElements';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function AppLayout() {
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

  if (checkIsUserAuthenticated()) {
    return (
      <>
        <Menu />
        <Main />
        <TaskInfo />
      </>
    );
  }

  return <Navigate to='/sign-in' replace={true} />;
}

function Main() {
  const [parent] = useAutoAnimate({
    duration: 300,
  });

  return (
    <main
      className='relative  grid flex-1 grid-rows-[min-content_auto_min-content] gap-3 overflow-hidden bg-background-primary'
      ref={parent}
    >
      <Outlet />
    </main>
  );
}
