import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.js';

import UserProvider from './contexts/User.jsx';

import App from './App.jsx';
import { monitorNetwork } from './components/Common/MonitorNetwork.jsx';
import { ModalProvider } from './components/Common/ConfirmationModal.jsx';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <UserProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </UserProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>,
);

monitorNetwork();
