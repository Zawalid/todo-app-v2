export function Search({ searchQuery, onSearch }) {
  return (
    <div className='relative mb-5 w-full'>
      <input
        type='text'
        className='w-full rounded-lg border border-background-tertiary  bg-transparent  py-1 pl-3  pr-16 text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Search'
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
      {searchQuery.trim() !== '' && (
        <button
          className='absolute right-9 top-[2.5px] cursor-pointer rounded-sm  px-[5px]  text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
          onClick={() => onSearch('')}
        >
          <i className='fas fa-xmark'></i>
        </button>
      )}
      <button
        className='absolute right-2 top-[2.5px] cursor-pointer rounded-sm  px-1 py-[2px] text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
        onClick={() => onSearch(searchQuery)}
      >
        <i className='fas fa-search '></i>
      </button>
    </div>
  );
}
