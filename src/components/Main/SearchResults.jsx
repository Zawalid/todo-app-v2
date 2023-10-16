import { Task } from './Tasks/Task';
import noResults from '../../assets/no_result.png';
import { useState } from 'react';
import { StickyNote } from './Sticky Wall/StickyNote';

export function SearchResults({
  searchResults,
  onOpen,
  onComplete,
  lists,
  tags,
  currentSearchTab,
  setCurrentSearchTab,
  setCurrentNote,
  setIsEditorOpen,
  setIsStickyNoteOpened,
}) {
  return (
    <div className='relative flex h-full flex-col overflow-auto'>
      <Tabs currentSearchTab={currentSearchTab} setCurrentSearchTab={setCurrentSearchTab} />
      {searchResults.length === 0 && (
        <div className='flex  h-full flex-col items-center justify-center gap-2'>
          <img src={noResults} alt='no result' className='w-[300px]' />
          <h2 className='text-2xl font-semibold text-text-secondary'>No results found</h2>
        </div>
      )}
      {searchResults.length > 0 && (
        <ul
          className={
            'mt-5 overflow-y-auto ' +
            (currentSearchTab === 'stickyWall'
              ? 'grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6'
              : 'space-y-2 ')
          }
        >
          {searchResults.map((result) => {
            if (currentSearchTab !== 'stickyWall') {
              return (
                <Task
                  key={result.id}
                  task={result}
                  onOpen={() => onOpen(result)}
                  onComplete={(isCompleted) => onComplete(result.id, isCompleted)}
                  lists={lists}
                  tags={tags}
                />
              );
            }
            if (currentSearchTab === 'stickyWall') {
              return (
                <StickyNote
                  key={result.id}
                  title={result.title}
                  description={result.description}
                  bgColor={result.bgColor}
                  textColor={result.textColor}
                  creationDate={result.creationDate}
                  onClick={() => {
                    setCurrentNote({
                      id: result.id,
                      title: result.title,
                      content: result.content || '<p></p>',
                      description: result.description,
                      bgColor: result.bgColor,
                      textColor: result.textColor,
                      creationDate: result.creationDate,
                    });
                    setIsEditorOpen(true);
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

function Tabs({ currentSearchTab, setCurrentSearchTab }) {
  return (
    <div className='flex items-center justify-center gap-8'>
      <button
        className={
          'border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'all' ? 'border-text-secondary' : '')
        }
        onClick={() => setCurrentSearchTab('all')}
      >
        All
      </button>
      <button
        className={
          'border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'today' ? 'border-text-secondary' : '')
        }
        onClick={() => setCurrentSearchTab('today')}
      >
        Today
      </button>
      <button
        className={
          'border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'upcoming' ? 'border-text-secondary' : '')
        }
        onClick={() => setCurrentSearchTab('upcoming')}
      >
        Upcoming
      </button>
      <button
        className={
          'border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'stickyWall' ? 'border-text-secondary' : '')
        }
        onClick={() => setCurrentSearchTab('stickyWall')}
      >
        Sticky Wall
      </button>
    </div>
  );
}
