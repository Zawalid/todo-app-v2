import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '../Tasks/Task Components/Task';
import { StickyNote } from '../Sticky Wall/StickyNote';
import { Tabs } from '../../Common/Tabs';
import { Title } from '../Title';
import noResults from '../../../assets/no_result.png';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useStickyNotes, useTasks, useUpcomingTasks } from '../../../lib/react-query/queries';

export default function SearchResults() {
  const [currentTab, setCurrentTab] = useState('all');
  const { searchQuery } = useParams();
  const { tasks } = useTasks();
  const { todayTasks, upcomingTasks } = useUpcomingTasks();
  const { stickyNotes } = useStickyNotes();
  const navigate = useNavigate();

  const [parent] = useAutoAnimate({
    duration: 500,
  });

  useEffect(() => {
    if (!searchQuery) navigate('/app');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections = {
    all: tasks,
    today: todayTasks,
    upcoming: upcomingTasks,
    stickyWall: stickyNotes,
  };

  const searchResults = sections[currentTab]?.filter((result) =>
    `${result.title ?? ''} ${result[currentTab === 'sticky-wall' ? 'content' : 'note'] ?? ''}`
      .toLowerCase()
      .includes(searchQuery?.toLowerCase()),
  );

  useEffect(() => {
    if (!searchQuery) return;
    document.title = `I Do | Search Results for "${searchQuery}"`;
  }, [searchQuery]);

  return (
    <>
      <Title title='Results' count={searchResults?.length} />
      <div className='relative flex h-full flex-col overflow-auto p-4' ref={parent}>
        <Tabs
          tabs={['All', 'Today', 'Upcoming', 'Sticky Wall']}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        {searchResults?.length > 0 && (
          <Results searchResults={searchResults} currentTab={currentTab} />
        )}
        {searchResults?.length === 0 && <NoResults />}
      </div>
    </>
  );
}

function Results({ searchResults, currentTab }) {
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  return (
    <ul
      className={
        'mt-5 h-full overflow-y-auto pr-3 ' +
        (currentTab === 'stickyWall'
          ? 'grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-4'
          : 'space-y-2 ')
      }
      ref={parent}
    >
      {searchResults.map((result) => {
        return currentTab === 'stickyWall' ? (
          <StickyNote key={result.$id} stickyNote={result} />
        ) : (
          <Task key={result.$id} task={result} />
        );
      })}
    </ul>
  );
}
function NoResults() {
  const { searchQuery } = useParams();
  return (
    <div className='flex  h-full flex-col items-center justify-center gap-2'>
      <img src={noResults} alt='no result' className='w-[200px] sm:w-[300px] ' />
      <h2 className='text-xl font-semibold text-text-secondary sm:text-2xl'>
        No results found for &quot;<span>{searchQuery}</span>&quot;
      </h2>
      <p className='text-center text-sm text-text-tertiary sm:text-base'>
        We couldn&apos;t find anything matching your search. Try again with a different term.
      </p>
    </div>
  );
}
