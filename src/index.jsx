import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.js';

import DarkModeProvider from './contexts/DarkModeContext.jsx';
import TrashProvider from './contexts/Trash.jsx';
import UserProvider from './contexts/User.jsx';
import ListsProvider from './contexts/Lists.jsx';
import TasksProvider from './contexts/Tasks.jsx';
import StickyNotesProvider from './contexts/StickyNotes.jsx';
import TagsProvider from './contexts/Tags.jsx';

import App from './App.jsx';
import { monitorNetwork } from './components/Common/MonitorNetwork.jsx';
import { ModalProvider } from './components/Common/ConfirmationModal.jsx';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ModalProvider>
            <DarkModeProvider>
              <TrashProvider>
                <UserProvider>
                  <ListsProvider>
                    <TasksProvider>
                      <StickyNotesProvider>
                        <TagsProvider>
                          <App />
                        </TagsProvider>
                      </StickyNotesProvider>
                    </TasksProvider>
                  </ListsProvider>
                </UserProvider>
              </TrashProvider>
            </DarkModeProvider>
          </ModalProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>,
);

monitorNetwork();
