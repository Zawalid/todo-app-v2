import { createContext, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSearchParams } from 'react-router-dom';
import { useStickyNotes } from '../hooks/useStickyNotes';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [currentSearchTab, setCurrentSearchTab] = useState('all');
  const { tasks, todayTasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query');

  const searchSection =
    currentSearchTab === 'all'
      ? tasks
      : currentSearchTab === 'today'
      ? todayTasks
      : currentSearchTab === 'upcoming'
      ? upcomingTasks
      : stickyNotes;

  const searchResults = searchSection.filter((result) =>
    `${result.title ?? ''} ${
      result[currentSearchTab === 'stickyWall' ? 'content' : 'note'] ?? ''
    } ${result.description ?? ''}}`
      .toLowerCase()
      .includes(searchQuery?.toLowerCase()),
  );

  return (
    <SearchContext.Provider
      value={{
        currentSearchTab,
        setCurrentSearchTab,
        searchResults,
        searchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
