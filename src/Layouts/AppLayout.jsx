import { TaskInfo } from '../components/Task Info/TaskInfo';
import { Menu } from '../components/Menu/Menu';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAutoAnimate } from '../hooks/useAutoAnimate';

export default function AppLayout() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) {
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
