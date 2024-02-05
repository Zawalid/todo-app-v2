import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PiX } from 'react-icons/pi';
import { IoMdSearch } from 'react-icons/io';

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
      className='relative my-5 w-full'
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
        className={`absolute right-9 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm  px-[5px] py-[2px]  text-text-tertiary  hover:bg-background-tertiary ${
          query?.trim() === '' ? 'scale-0' : 'scale-100'
        }`}
        onClick={() => search('')}
      >
        < PiX />
      </button>

      <button className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm  px-1 py-[2px] text-text-tertiary  hover:bg-background-tertiary'>
        <IoMdSearch />
      </button>
    </form>
  );
}
