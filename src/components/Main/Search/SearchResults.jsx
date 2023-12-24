import { Task } from '../Tasks/Task';
import noResults from '../../../assets/no_result.png';
import { StickyNote } from '../Sticky Wall/StickyNote';
import { Tabs } from '../../Common/Tabs';
import { useSearch } from '../../../hooks/useSearch';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function SearchResults() {
  const { searchResults, currentSearchTab, setCurrentSearchTab } = useSearch();
  const { setCurrentNote, setIsStickyNoteOpened, setIsStickyNoteEditorOpen } = useStickyNotes();
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  return (
    <div className='relative flex h-full flex-col overflow-auto p-4'>
      <Tabs
        tabs={['All', 'Tasks', 'Upcoming', 'Sticky Wall']}
        currentTab={currentSearchTab}
        setCurrentTab={setCurrentSearchTab}
      />
      {searchResults.length === 0 && (
        <div className='flex  h-full flex-col items-center justify-center gap-2'>
          <img src={noResults} alt='no result' className='w-[300px]' />
          <h2 className='text-2xl font-semibold text-text-secondary'>No results found</h2>
        </div>
      )}
      {searchResults.length > 0 && (
        <ul
          className={
            'mt-5 overflow-y-auto pr-3 ' +
            (currentSearchTab === 'stickyWall'
              ? 'grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6'
              : 'space-y-2 ')
          }
          ref={parent}
        >
          {searchResults.map((result) => {
            if (currentSearchTab !== 'stickyWall') {
              return <Task key={result.$id} task={result} />;
            }
            if (currentSearchTab === 'stickyWall') {
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
