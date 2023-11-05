import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';

export function Search() {
  const { searchQuery } = useSearch();
  const [query, setQuery] = useState(searchQuery || '');
  const navigate = useNavigate();

  function search(query) {
    query?.trim() === '' ? navigate('/all') : navigate(`/search?query=${query}`);
  }
  return (
    <div className='relative mb-5 w-full'>
      <input
        type='text'
        className='w-full rounded-lg border border-background-tertiary  bg-transparent  py-1 pl-3  pr-16 text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Search'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
      />
      {query.trim() !== '' && (
        <button
          className='absolute right-9 top-[2.5px] cursor-pointer rounded-sm  px-[5px]  text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
          onClick={() => {
            setQuery('');
            search('');
          }}
        >
          <i className='fas fa-xmark'></i>
        </button>
      )}
      <button
        className='absolute right-2 top-[2.5px] cursor-pointer rounded-sm  px-1 py-[2px] text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
        onClick={() => search(query)}
      >
        <i className='fas fa-search '></i>
      </button>
    </div>
  );
}
