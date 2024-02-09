import { useEffect, useRef, useState } from 'react';
import { List } from './List';
import { AddNewList } from './AddNewList';
import { ListsSkeleton } from '../../Skeletons';
import { TABS } from '../TabsList';
import { PiPlusBold } from 'react-icons/pi';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useLists } from '../../../lib/react-query/queries';

export function Lists() {
  const { lists, isLoading } = useLists();
  const [isAddNewListOpen, setIsAddNewListOpen] = useState(false);
  const [currentOpenedList, setCurrentOpenedList] = useState(null);
  const addNewListContainer = useRef(null);
  const addNewListToggler = useRef(null);
  const [parent] = useAutoAnimate({
    duration: 500,
  });

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
    <div className='relative min-h-[120px] border-t border-border'>
      <div className='mb-4 mt-5 flex items-center gap-3'>
        <span className=' text-lg text-text-tertiary'>{TABS.lists.icon}</span>
        <h4 className='font-medium text-text-secondary'>Lists</h4>
      </div>
      {isLoading ? (
        <ListsSkeleton />
      ) : (
        <>
          <ul className='space-y-1 ' ref={parent}>
            {lists?.map((list) => (
              <List
                key={list.$id}
                list={list}
                currentOpenedList={currentOpenedList}
                setCurrentOpenedList={setCurrentOpenedList}
              />
            ))}
          </ul>
          <button
            className='my-4 flex w-full cursor-pointer items-center gap-4 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors duration-200 hover:bg-background-tertiary'
            ref={addNewListToggler}
            onClick={() => {
              setIsAddNewListOpen(!isAddNewListOpen);
              setTimeout(() => {
                const input = addNewListContainer.current?.querySelector('input');
                input?.focus();
                input?.select();
              }, 100);
            }}
          >
            <PiPlusBold className='text-text-tertiary' />
            Add New List
          </button>
          {isAddNewListOpen && (
            <AddNewList
              reference={addNewListContainer}
              onClose={() => setIsAddNewListOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
