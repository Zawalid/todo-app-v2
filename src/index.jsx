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
  UserAuthProvider,
} from './contexts';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAuthProvider>
        <TrashProvider>
          <ListsProvider>
            <TasksProvider>
              <StickyNotesProvider>
                <TagsProvider>
                  <App />
                </TagsProvider>
              </StickyNotesProvider>
            </TasksProvider>
          </ListsProvider>
        </TrashProvider>
      </UserAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
