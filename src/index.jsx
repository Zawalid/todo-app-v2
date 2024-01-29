import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import {
  TasksProvider,
  ListsProvider,
  StickyNotesProvider,
  TagsProvider,
  TrashProvider,
  UserProvider,
  DarkModeProvider,
} from './contexts';
import './styles/index.css';
import { monitorNetwork } from './components/Common/MonitorNetwork.jsx';
import { ModalProvider } from './components/Common/ConfirmationModal.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
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
  </React.StrictMode>,
);

monitorNetwork();
