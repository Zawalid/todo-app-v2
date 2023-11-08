import { createContext, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSearchParams } from 'react-router-dom';
import { useStickyNotes } from '../hooks/useStickyNotes';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [currentSearchTab, setCurrentSearchTab] = useState('all');
  const { tasks, todayTasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();
  const [searchParams,setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

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
        setQuery : setSearchParams
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
