export function Tabs({ currentSearchTab, setCurrentSearchTab }) {
  return (
    <div className='flex items-center justify-center gap-8'>
      <button
        className={
          'border-b-2  px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'all' ? 'border-text-secondary' : 'border-transparent')
        }
        onClick={() => setCurrentSearchTab('all')}
      >
        All
      </button>
      <button
        className={
          'border-b-2  px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'today' ? 'border-text-secondary' : 'border-transparent')
        }
        onClick={() => setCurrentSearchTab('today')}
      >
        Today
      </button>
      <button
        className={
          'border-b-2  px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'upcoming' ? 'border-text-secondary' : 'border-transparent')
        }
        onClick={() => setCurrentSearchTab('upcoming')}
      >
        Upcoming
      </button>
      <button
        className={
          'border-b-2  px-4 py-2 text-sm font-semibold text-text-secondary transition-[border] duration-300 hover:border-text-secondary ' +
          (currentSearchTab === 'stickyWall' ? 'border-text-secondary' : 'border-transparent')
        }
        onClick={() => setCurrentSearchTab('stickyWall')}
      >
        Sticky Wall
      </button>
    </div>
  );
}
