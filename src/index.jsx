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
} from './contexts';
import './styles/index.css';
import { monitorNetwork } from './components/Common/MonitorNetwork.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>,
);

monitorNetwork()