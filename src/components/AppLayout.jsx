import { TaskInfo } from './Task Info/TaskInfo';
import { Menu } from './Menu/Menu';
import { Main } from './Main/Main';
import '../styles/App.css';
import { SearchProvider } from '../contexts/Search';
import { Toaster } from 'sonner';

export default function AppLayout() {
  return (
    <>
      <Toaster position='top-right' />
      <div className='flex h-full gap-2 bg-background-primary p-5'>
        <SearchProvider>
          <Menu />
          <Main />
        </SearchProvider>
        <TaskInfo />
      </div>
    </>
  );
}
