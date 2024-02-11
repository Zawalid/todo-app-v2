import { TaskInfo } from '../components/Task Info/TaskInfo';
import { Menu } from '../components/Menu/Menu';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useFetchAllElements } from '../hooks/useFetchAllElements';
import { useSelector } from 'react-redux';
import { useAutoAnimate } from '../hooks/useAutoAnimate';

export default function AppLayout() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { handleFetchAllElements, handleClearAllElements } = useFetchAllElements();

  // useEffect(() => {
  //   const fetch = () => {
  //     handleFetchAllElements();
  //   };
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') fetch();
  //   };
  //   if (isAuthenticated) {
  //     fetch();
  //     document.addEventListener('visibilitychange', handleVisibilityChange);
  //   }
  //   return () => {
  //     // To clear all elements from the state when the user logs out
  //     !isAuthenticated && handleClearAllElements();
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (isAuthenticated) {
    return (
      <>
        <Menu />
        <Main />
        <TaskInfo />
      </>
    );
  }

  // return <Navigate to='/sign-in' replace={true} />;
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
