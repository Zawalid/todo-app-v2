import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './NotFound';
import '../AppWrite';
import { TasksProvider } from '../contexts/Tasks';
import { ListsProvider } from '../contexts/Lists';
// import { useLists } from '../hooks/useLists';

export default function App() {
  // const { lists } = useLists();
  const lists = [
    {
      id: Math.random(),
      title: 'Personal',
      color: '#ff6b6b',
      tasks: [],
      number: 0,
      index: 0,
    },
    {
      id: Math.random(),
      title: 'Work',
      color: '#66d9e8',
      tasks: [],
      number: 0,
      index: 1,
    },
  ];
  const listsTitles = lists.map((list) => list.title);

  return (
    <ListsProvider>
        <TasksProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<AppLayout />} />
            {['all', 'today', 'stickyWall', 'upcoming', ...listsTitles].map((tab) => (
              <Route path={`/${tab}`} element={<AppLayout />} key={tab}>
                <Route path='trash' element={<AppLayout />} />
              </Route>
            ))}
            <Route path='search' element={<AppLayout />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </TasksProvider>
      </ListsProvider>
  );
}
