import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';

export function Search() {
  const { searchQuery, setQuery } = useSearch();
  const navigate = useNavigate();

  function search(query) {
    query?.trim() === '' ? navigate('') : navigate(`search?q=${query}`);
  }
  return (
    <div className='relative mb-5 w-full'>
      <input
        type='text'
        className='w-full rounded-lg border border-zinc-200  py-2 pl-3  pr-16 text-sm text-text-tertiary bg-background-secondary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Search'
        autoComplete='off'
        value={searchQuery || ''}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
      />
      {!searchQuery || searchQuery?.trim() !== '' && (
        <button
          className='absolute right-9 top-[6px] cursor-pointer rounded-sm  px-[5px]  text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
          onClick={() => {
            setQuery('');
            search('');
          }}
        >
          <i className='fas fa-xmark'></i>
        </button>
      )}
      <button
        className='absolute right-2 top-[6px] cursor-pointer rounded-sm  px-1 py-[2px] text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
        onClick={() => search(searchQuery)}
      >
        <i className='fas fa-search '></i>
      </button>
    </div>
  );
}
