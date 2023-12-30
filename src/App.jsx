import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useSaveListsTitlesInLocalStorage } from './hooks/';
import { Suspense, lazy } from 'react';
import { SpinnerLoader } from './components/Common/SpinnerLoader';
import './styles/App.css';

const HomePage = lazy(() => import('./Pages/HomePage'));
const AppLayout = lazy(() => import('./Pages/AppLayout'));
const SignInForm = lazy(() => import('./Pages/auth/Forms/SignInForm'));
const SignUpForm = lazy(() => import('./Pages/auth/Forms/SignUpForm'));
const ForgotPassword = lazy(() => import('./Pages/auth/Forms/ForgotPassword'));
const NotFound = lazy(() => import('./Pages/NotFound'));
const AuthLayout = lazy(() => import('./Pages/auth/AuthLayout'));

function App() {
  const listsTitles = useSaveListsTitlesInLocalStorage();

  return (
    <Suspense fallback={<SpinnerLoader />}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='app' element={<AppLayout />}>
          {['all', 'today', 'sticky-wall', 'search', 'trash', 'upcoming', ...listsTitles].map(
            (tab) => (
              <Route path={`${tab}`} element={<AppLayout />} key={tab} />
            ),
          )}
        </Route>
        <Route element={<AuthLayout />}>
          <Route path='sign-in' element={<SignInForm />} />
          <Route path='sign-up' element={<SignUpForm />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster
        position={window.innerWidth < 768 ? 'bottom-center' : 'top-right'}
        loadingIcon={
          <i className='fa-solid fa-spinner animate-spin text-lg text-text-secondary'></i>
        }
        toastOptions={{
          className: 'sonner-toast',
          duration : 2000,
        }}
      />
    </Suspense>
  );
}
export default App;
