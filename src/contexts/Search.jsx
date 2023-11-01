import { createContext, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSearchParams } from 'react-router-dom';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [currentSearchTab, setCurrentSearchTab] = useState('all');
  const { tasks, todayTasks, upcomingTasks } = useTasks();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query');

  const searchSection =
    currentSearchTab === 'all'
      ? tasks
      : currentSearchTab === 'today'
      ? todayTasks
      : currentSearchTab === 'upcoming'
      ? upcomingTasks
      : upcomingTasks; //fix

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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
