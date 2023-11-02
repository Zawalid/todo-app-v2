import { useEffect, useRef, useState } from 'react';
import { Tag } from './Tag';
import { AddNewTag } from './AddNewTag';
import { useTags } from '../../../hooks/useTags';

export function MenuTags() {
  const {tags} = useTags()
  const [isAddNewTagOpen, setIsAddNewTagOpen] = useState(false);
  const addNewTagContainer = useRef(null);
  const addNewTagToggler = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        addNewTagContainer.current &&
        !addNewTagContainer.current.contains(e.target) &&
        addNewTagToggler.current &&
        !addNewTagToggler.current.contains(e.target)
      ) {
        setIsAddNewTagOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='pb-5'>
      <h4 className='mb-4 mt-5 font-medium text-text-secondary'>Tags</h4>
      <ul className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Tag key={tag.$id} tag={tag} showDeleteButton={true} />
        ))}
        <li
          className='menu_tag_element cursor-pointer bg-background-tertiary text-text-secondary'
          onClick={() => setIsAddNewTagOpen(!isAddNewTagOpen)}
          ref={addNewTagToggler}
        >
          + Add Tag
        </li>
        {isAddNewTagOpen && <AddNewTag reference={addNewTagContainer} isOpen={isAddNewTagOpen} />}
      </ul>
    </div>
  );
}
