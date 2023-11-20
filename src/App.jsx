import { Routes, Route } from 'react-router-dom';
import { HomePage, AppLayout, SignInForm, SignUpForm, NotFound, AuthLayout } from './Pages';
import { Toaster } from 'sonner';
import { useSaveListsTitlesInLocalStorage } from './hooks/';

function App() {
  const listsTitles = useSaveListsTitlesInLocalStorage();

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='app' element={<AppLayout />}>
          {['all', 'today', 'stickyWall', 'search', 'trash', 'upcoming', ...listsTitles].map(
            (tab) => (
              <Route path={`${tab}`} element={<AppLayout />} key={tab} />
            ),
          )}
        </Route>
        <Route element={<AuthLayout />}>
          <Route path='sign-in' element={<SignInForm />} />
          <Route path='sign-up' element={<SignUpForm />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>

      <Toaster
        position='top-right'
        loadingIcon={
          <i className='fa-solid fa-spinner animate-spin text-lg text-text-secondary'></i>
        }
        toastOptions={{
          className: 'sonner-toast',
        }}
      />
    </>
  );
}
export default App;
