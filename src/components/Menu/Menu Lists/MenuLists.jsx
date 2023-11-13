import { useEffect, useRef, useState } from 'react';
import { List } from './List';
import { AddNewList } from './AddNewList';
import { useLists } from '../../../hooks/useLists';
import { SpinnerLoader } from '../../Common/SpinnerLoader';

export function MenuLists() {
  const { lists,isListsLoading } = useLists();
  const [isAddNewListOpen, setIsAddNewListOpen] = useState(false);
  const addNewListContainer = useRef(null);
  const addNewListToggler = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        addNewListContainer.current &&
        !addNewListContainer.current.contains(e.target) &&
        addNewListToggler.current &&
        !addNewListToggler.current.contains(e.target)
      ) {
        setIsAddNewListOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='border-y min-h-[120px] relative border-background-tertiary pb-5'>
      <h4 className='mb-4 mt-5  font-medium text-text-secondary'>Lists</h4>
      {isListsLoading ? (
        <SpinnerLoader size='small' />
      ) : (
        <>
          <ul className=' space-y-1 '>
            {lists.map((list) => (
              <List key={list.$id} list={list} />
            ))}
          </ul>
          <button
            className='my-4 flex cursor-pointer items-center text-sm text-text-secondary'
            ref={addNewListToggler}
            onClick={() => setIsAddNewListOpen(!isAddNewListOpen)}
          >
            <i className='fas  fa-plus w-10 text-text-tertiary'></i>
            Add New List
          </button>
          {isAddNewListOpen && (
            <AddNewList reference={addNewListContainer} isOpen={isAddNewListOpen} />
          )}
        </>
      )}
    </div>
  );
}
