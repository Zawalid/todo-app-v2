import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { FaSpinner } from 'react-icons/fa6';
import './styles/App.css';

import { SpinnerLoader } from './components/Common/SpinnerLoader';
import Inbox from './components/Main/Tasks/Inbox';
import TodayTasks from './components/Main/Tasks/TodayTasks';
import ListTasks from './components/Main/Tasks/ListTasks';
import Upcoming from './components/Main/Tasks/Upcoming';
import StickyWall from './components/Main/Sticky Wall/StickyWall';
import SearchResults from './components/Main/Search/SearchResults';
import { StickyNoteEditor } from './components/Main/Sticky Wall/Sticky Note Editor/StickyNoteEditor';
import { useSelector } from 'react-redux';
import CompletedTasks from './components/Main/Tasks/CompletedTasks';

const HomePage = lazy(() => import('./Pages/HomePage'));
const AppLayout = lazy(() => import('./Layouts/AppLayout'));
const AuthLayout = lazy(() => import('./Layouts/AuthLayout'));
const SignInForm = lazy(() => import('./Pages/auth/SignInForm'));
const SignUpForm = lazy(() => import('./Pages/auth/SignUpForm'));
const ForgotPassword = lazy(() => import('./Pages/auth/ForgotPassword'));
const NotFound = lazy(() => import('./Pages/NotFound'));

const tabs = {
  inbox: <Inbox />,
  today: <TodayTasks />,
  upcoming: <Upcoming />,
  'sticky wall': <StickyWall />,
  completed: <CompletedTasks />,
};

function App() {
  const { themeMode, primaryTheme } = useSelector((state) => state.settings.theme);
  const { defaultHomeView, animation } = useSelector((state) => state.settings.general.preferences);

  // Initialize the theme and primary theme color and animation on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-theme-primary', primaryTheme);
    document.documentElement.setAttribute('data-animation', animation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<SpinnerLoader />}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='app' element={<AppLayout />}>
          <Route index element={<Navigate to={defaultHomeView} />} />
          {Object.keys(tabs).map((tab) => (
            <Route key={tab} path={tab.replace(' ', '-')} element={tabs[tab]} />
          ))}
          <Route path='lists/:listName' element={<ListTasks />} />
          <Route path='sticky-wall/:noteId' element={<StickyNoteEditor />} />
          <Route path='search/:searchQuery' element={<SearchResults />} />
          <Route path='search' element={<SearchResults />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='sign-in' element={<SignInForm />} />
          <Route path='sign-up' element={<SignUpForm />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>

      <Toaster
        position={window.innerWidth < 768 ? 'bottom-center' : 'bottom-right'}
        theme={themeMode}
        loadingIcon={<FaSpinner className='animate-spin text-lg text-text-secondary' />}
        toastOptions={{
          className: 'sonner-toast',
          duration: 2000,
        }}
      />
    </Suspense>
  );
}
export default App;
