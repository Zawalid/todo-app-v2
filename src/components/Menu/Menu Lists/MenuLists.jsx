import { useEffect, useRef, useState } from 'react';
import { List } from './List';
import { AddNewList } from './AddNewList';

export function MenuLists({
  lists,
  onAddList,
  onRenameList,
  onDeleteList,
  onChangeListColor,
  onDuplicateList,
}) {
  const [isAddNewListOpen, setIsAddNewListOpen] = useState(false);
  const addNewListContainer = useRef(null);
  const addNewListToggler = useRef(null);
  const untitledTasksNumber = useRef(0);

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
    <div className='border-y border-background-tertiary pb-5'>
      <h4 className='mb-4 mt-5  font-medium text-text-secondary'>Lists</h4>
      <ul className=' space-y-1 '>
        {lists.map((list) => (
          <List
            key={list.id}
            title={list.title}
            color={list.color}
            tasksNumber={list.tasks.length}
            onRename={(title) => onRenameList(list.id, title)}
            onDelete={() => onDeleteList(list.id)}
            onChangeColor={(color) => onChangeListColor(list.id, color)}
            onDuplicateList={() => onDuplicateList(list.id)}
          />
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
        <AddNewList
          reference={addNewListContainer}
          isOpen={isAddNewListOpen}
          onAdd={onAddList}
          untitledTasksNumber={untitledTasksNumber}
        />
      )}
    </div>
  );
}
