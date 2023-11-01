import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './NotFound';
import '../AppWrite';
import { TasksProvider } from '../contexts/Tasks';
import { ListsProvider } from '../contexts/Lists';
import { useState } from 'react';

export default function App() {
  const [lists, setLists] = useState([
    // {
    //   title: 'Personal',
    //   color: '#ff6b6b',
    //   tasks: [
    //     {
    //       title: 'idk',
    //       note: '',
    //       dueDate: '',
    //       listId: '65424b5a69fab6f186d2',
    //       subtasks: [],
    //       isCompleted: false,
    //       tagsIds: [],
    //       priority: 0,
    //       index: 2,
    //       $id: '65419d00b10b220d3f93',
    //       $createdAt: '2023-11-01T00:34:08.726+00:00',
    //       $updatedAt: '2023-11-01T00:34:08.726+00:00',
    //       $permissions: [],
    //       $databaseId: '654169b1a5c05d9c1e7e',
    //       $collectionId: '65416a6c8f0a546d8b4b',
    //     },
    //   ],
    //   number: 0,
    //   index: 3,
    //   $id: '65424b5a69fab6f186d2',
    //   $createdAt: '2023-11-01T12:58:02.435+00:00',
    //   $updatedAt: '2023-11-01T12:58:02.435+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65422c65a17f95378d53',
    // },
    // {
    //   title: 'Work',
    //   color: '#fffebe',
    //   tasks: [],
    //   number: 0,
    //   index: 4,
    //   $id: '65424b881a6f20cec5cd',
    //   $createdAt: '2023-11-01T12:58:48.109+00:00',
    //   $updatedAt: '2023-11-01T12:58:48.109+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65422c65a17f95378d53',
    // },
    // {
    //   title: 'no',
    //   color: '#ff6b6b',
    //   tasks: [],
    //   number: 0,
    //   index: 5,
    //   $id: '65424b9f1451b234e086',
    //   $createdAt: '2023-11-01T12:59:11.084+00:00',
    //   $updatedAt: '2023-11-01T12:59:11.084+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65422c65a17f95378d53',
    // },
    // {
    //   title: 'no',
    //   color: '#ff6b6b',
    //   tasks: [],
    //   number: 0,
    //   index: 5,
    //   $id: '65424ba9dcf2f29e1ca9',
    //   $createdAt: '2023-11-01T12:59:21.993+00:00',
    //   $updatedAt: '2023-11-01T12:59:21.993+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65422c65a17f95378d53',
    // },
  ]);
  const listsTitles = lists.map((list) => list.title);

  return (
    <TasksProvider>
      <ListsProvider lists={lists} setLists={setLists}>
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
      </ListsProvider>
    </TasksProvider>
  );
}
