import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';

export function Search() {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  function search(query) {
    query?.trim() === '' ? navigate('') : navigate(`search?q=${query}`);
  }
  return (
    <form
      className='relative mb-5 w-full'
      onSubmit={(e) => {
        e.preventDefault();
        search(searchQuery ?? '');
      }}
    >
      <input
        type='text'
        className='w-full rounded-lg border border-border  bg-background-secondary py-2  pl-3 pr-16 text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Search'
        autoComplete='off'
        value={searchQuery || ''}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          e.target.value === '' && search('');
        }}
      />
      {!searchQuery ||
        (searchQuery?.trim() !== '' && (
          <button
            type='button'
            className='absolute right-9 top-[6px] cursor-pointer rounded-sm  px-[5px]  text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'
            onClick={() => {
              setSearchQuery('');
              search('');
            }}
          >
            <i className='fas fa-xmark'></i>
          </button>
        ))}
      <button className='absolute right-2 top-[6px] cursor-pointer rounded-sm  px-1 py-[2px] text-sm text-text-tertiary transition-colors duration-300 hover:bg-background-tertiary'>
        <i className='fas fa-search '></i>
      </button>
    </form>
  );
}
