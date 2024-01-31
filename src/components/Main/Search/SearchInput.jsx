import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const { searchQuery } = useParams();
  const navigate = useNavigate();

  const search = (query) => (query?.trim() === '' ? navigate('/app') : navigate(`search/${query}`));

  useEffect(() => {
    setQuery(searchQuery ?? '');
  }, [searchQuery]);

  return (
    <form
      className='relative mb-5 w-full'
      onSubmit={(e) => {
        e.preventDefault();
        search(query ?? '');
      }}
    >
      <input
        type='text'
        className='w-full rounded-lg border border-border  bg-background-secondary py-2  pl-3 pr-16 text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Search'
        autoComplete='off'
        value={query}
        onChange={(e) => {
          const query = e.target.value;
          setQuery(query);
          query === '' && window.location.pathname.includes('/app/search/') && search('');
        }}
      />
      <button
        type='button'
        className={`absolute right-9 top-[6px] cursor-pointer rounded-sm  px-[5px]  text-text-tertiary  hover:bg-background-tertiary ${
          query?.trim() === '' ? 'scale-0' : 'scale-100'
        }`}
        onClick={() => search('')}
      >
        <i className='fas fa-xmark'></i>
      </button>

      <button className='absolute right-2 top-[6px] cursor-pointer rounded-sm  px-1 py-[2px] text-sm text-text-tertiary  hover:bg-background-tertiary'>
        <i className='fas fa-search '></i>
      </button>
    </form>
  );
}
