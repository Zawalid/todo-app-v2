import { useEffect, useRef, useState } from 'react';
import { Tag } from './Tag';
import { AddNewTag } from './AddNewTag';

export function MenuTags({ tags, onAddTag, onDeleteTag }) {
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
    <div className='mb-16'>
      <h4 className='mb-4 mt-5 font-medium text-text-secondary'>Tags</h4>
      <ul className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            title={tag.title}
            bgColor={tag.bgColor}
            textColor={tag.textColor}
            onDeleteTag={() => onDeleteTag(tag.id)}
            showDeleteButton={true}
          />
        ))}
        <li
          className='menu_tag_element cursor-pointer bg-background-tertiary text-text-secondary'
          onClick={() => setIsAddNewTagOpen(!isAddNewTagOpen)}
          ref={addNewTagToggler}
        >
          + Add Tag
        </li>
        {isAddNewTagOpen && (
          <AddNewTag reference={addNewTagContainer} isOpen={isAddNewTagOpen} onAdd={onAddTag} />
        )}
      </ul>
    </div>
  );
}
