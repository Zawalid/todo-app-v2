import { createContext, useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSearchParams } from 'react-router-dom';
import { useStickyNotes } from '../hooks/useStickyNotes';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [currentSearchTab, setCurrentSearchTab] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const { tasks, todayTasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();

  useEffect(() => {
    if (!searchQuery) return;
    setSearchParams({ q: searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;
