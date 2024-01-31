import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useDarkMode } from './hooks/';
import { Suspense, lazy } from 'react';
import { SpinnerLoader } from './components/Common/SpinnerLoader';
import './styles/App.css';

import AllTasks from './components/Main/Tasks/AllTasks';
import TodayTasks from './components/Main/Tasks/TodayTasks';
import ListTasks from './components/Main/Tasks/ListTasks';
import Upcoming from './components/Main/Tasks/Upcoming';
import StickyWall from './components/Main/Sticky Wall/StickyWall';
import SearchResults from './components/Main/Search/SearchResults';

const HomePage = lazy(() => import('./Pages/HomePage'));
const AppLayout = lazy(() => import('./Layouts/AppLayout'));
const AuthLayout = lazy(() => import('./Layouts/AuthLayout'));
const SignInForm = lazy(() => import('./Pages/auth/SignInForm'));
const SignUpForm = lazy(() => import('./Pages/auth/SignUpForm'));
const ForgotPassword = lazy(() => import('./Pages/auth/ForgotPassword'));
const NotFound = lazy(() => import('./Pages/NotFound'));

function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <Suspense fallback={<SpinnerLoader />}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='app' element={<AppLayout />}>
          <Route index element={<AllTasks />} />
          <Route path='all' element={<AllTasks />} />
          <Route path='today' element={<TodayTasks />} />
          <Route path='upcoming' element={<Upcoming />} />
          <Route path='lists/:listName' element={<ListTasks />} />
          <Route path='sticky-wall' element={<StickyWall />} />
          <Route path='sticky-wall/:noteId' element={<StickyWall />} />
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
        theme={isDarkMode ? 'dark' : 'light'}
        loadingIcon={
          <i className='fa-solid fa-spinner animate-spin text-lg text-text-secondary'></i>
        }
        toastOptions={{
          className: 'sonner-toast',
          duration: 2000,
        }}
      />
    </Suspense>
  );
}
export default App;
