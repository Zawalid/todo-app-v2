import { useEffect, useRef, useState } from 'react';
import { Tag } from './Tag';
import { AddNewTag } from './AddNewTag';
import { TABS } from '../TabsList';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { TagsSkeleton } from '../../Skeletons';
import { useTags } from '../../../lib/react-query/queries';

export function Tags() {
  const { tags, isLoading } = useTags();
  const [isAddNewTagOpen, setIsAddNewTagOpen] = useState(false);
  const addNewTagContainer = useRef(null);
  const addNewTagToggler = useRef(null);
  const [parent] = useAutoAnimate({
    duration: 500,
  });
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
    <div className='relative border-t border-border'>
      <div className='mb-4 mt-5 flex items-center gap-3'>
        <span className=' text-lg text-text-tertiary'>{TABS.tags.icon}</span>
        <h4 className='font-medium text-text-secondary'>Tags</h4>
      </div>{' '}
      {isLoading ? (
        <TagsSkeleton />
      ) : (
        <>
          <ul className='flex flex-wrap gap-2' ref={parent}>
            {tags.map((tag) => (
              <Tag key={tag.$id} tag={tag} showDeleteButton={true} />
            ))}
            <li
              className='menu_tag_element cursor-pointer text-text-secondary transition-colors duration-200 hover:bg-background-tertiary'
              onClick={() => {
                setIsAddNewTagOpen(!isAddNewTagOpen);
                setTimeout(() => addNewTagContainer.current.querySelector('input').focus(), 100);
              }}
              ref={addNewTagToggler}
            >
              + Add Tag
            </li>
          </ul>
          {isAddNewTagOpen && <AddNewTag reference={addNewTagContainer} onClose={() => setIsAddNewTagOpen(false)} />}
        </>
      )}
    </div>
  );
}
