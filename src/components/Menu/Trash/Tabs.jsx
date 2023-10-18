export function Tabs({ currentTab, setCurrentTab }) {
  return (
    <div className='flex items-center gap-8  border-b-2 pb-2 '>
      <button
        className={
          'relative  text-sm font-semibold text-text-secondary before:absolute before:-bottom-[10px] before:left-0 before:h-[2px] before:w-full before:transition-colors before:duration-300 hover:before:bg-text-secondary ' +
          (currentTab === 'tasks' ? 'before:bg-text-secondary' : 'before:bg-text-transparent')
        }
        onClick={() => setCurrentTab('tasks')}
      >
        Tasks
      </button>
      <button
        className={
          'relative  text-sm font-semibold text-text-secondary before:absolute before:-bottom-[10px] before:left-0 before:h-[2px] before:w-full before:transition-colors before:duration-300 hover:before:bg-text-secondary ' +
          (currentTab === 'lists' ? 'before:bg-text-secondary' : 'before:bg-text-transparent')
        }
        onClick={() => setCurrentTab('lists')}
      >
        Lists
      </button>
      <button
        className={
          'relative  text-sm font-semibold text-text-secondary before:absolute before:-bottom-[10px] before:left-0 before:h-[2px] before:w-full before:transition-colors before:duration-300 hover:before:bg-text-secondary ' +
          (currentTab === 'tags' ? 'before:bg-text-secondary' : 'before:bg-text-transparent')
        }
        onClick={() => setCurrentTab('tags')}
      >
        Tags
      </button>
      <button
        className={
          'relative  text-sm font-semibold text-text-secondary before:absolute before:-bottom-[10px] before:left-0 before:h-[2px] before:w-full before:transition-colors before:duration-300 hover:before:bg-text-secondary ' +
          (currentTab === 'notes' ? 'before:bg-text-secondary' : 'before:bg-text-transparent')
        }
        onClick={() => setCurrentTab('notes')}
      >
        Notes
      </button>
    </div>
  );
}
