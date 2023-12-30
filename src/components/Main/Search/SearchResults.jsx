import { Task } from '../Tasks/Task';
import noResults from '../../../assets/no_result.png';
import { StickyNote } from '../Sticky Wall/StickyNote';
import { Tabs } from '../../Common/Tabs';
import { useSearch } from '../../../hooks/useSearch';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function SearchResults() {
  const { searchResults, currentSearchTab, setCurrentSearchTab, searchQuery } = useSearch();
  const { setCurrentNote, setIsStickyNoteOpened, setIsStickyNoteEditorOpen } = useStickyNotes();
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  return (
    <div className='relative flex h-full flex-col overflow-auto p-4'>
      <Tabs
        tabs={['All', 'Today', 'Upcoming', 'Sticky Wall']}
        currentTab={currentSearchTab}
        setCurrentTab={setCurrentSearchTab}
      />
      {searchResults.length === 0 && (
        <div className='flex  h-full flex-col items-center justify-center gap-2'>
          <img src={noResults} alt='no result' className='w-[200px] sm:w-[300px] ' />
          <h2 className='text-xl font-semibold text-text-secondary sm:text-2xl'>
            No results found for &quot;<span>{searchQuery}</span>&quot;
          </h2>
          <p className='text-center text-sm text-text-tertiary sm:text-base'>
            We couldn&apos;t find anything matching your search. Try again with a different term.
          </p>
        </div>
      )}
      {searchResults.length > 0 && (
        <ul
          className={
            'mt-5 overflow-y-auto pr-3 ' +
            (currentSearchTab === 'sticky-wall'
              ? 'grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6'
              : 'space-y-2 ')
          }
          ref={parent}
        >
          {searchResults.map((result) => {
            if (currentSearchTab !== 'sticky-wall') {
              return <Task key={result.$id} task={result} />;
            }
            if (currentSearchTab === 'sticky-wall') {
              return (
                <StickyNote
                  key={result.$id}
                  stickyNote={result}
                  onClick={() => {
                    setCurrentNote(result);
                    setIsStickyNoteEditorOpen(true);
                    setIsStickyNoteOpened(true);
                  }}
                />
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}
