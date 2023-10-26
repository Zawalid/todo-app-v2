import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './NotFound';
import { useLocalStorageState } from '../useLocalStorageState';

export default function App() {
  const [lists, setLists] = useLocalStorageState('lists', [
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
  ]);
  const listsTitles = lists.map((list) => list.title);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout lists={lists} setLists={setLists} />} />
        {['all', 'today', 'stickyWall', 'upcoming', ...listsTitles].map((tab) => (
          <Route
            path={`/${tab}`}
            element={<AppLayout lists={lists} setLists={setLists} />}
            key={tab}
          />
        ))}
        <Route path='search' element={<AppLayout lists={lists} setLists={setLists} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
