import { Tag } from '../../Menu/Menu Tags/Tag';
import { TagsDropDown } from './TagsDropDown';
import { useTags } from '../../../hooks/useTags';

export function TaskTags({
  taskTagsIds,
  tagsDropDown,
  tagsDropDownToggler,
  handleDeleteTagFromTask,
}) {
  const { tags } = useTags();
  return (
    <>
      <label className='text-sm text-text-tertiary'>Tags</label>
      <ul className='flex flex-wrap gap-2'>
        {taskTagsIds?.map((tagId) => {
          const tag = tags.find((t) => t.$id === tagId);
          if (tag)
            return (
              <Tag
                key={tag.$id}
                tag={tag}
                isMainTag={false}
                showDeleteButton={true}
                onDeleteTag={() => handleDeleteTagFromTask(tag.$id)}
              />
            );
        })}
        <TagsDropDown
        reference={tagsDropDown}
        >
          <li
            className='menu_tag_element w-32 relative cursor-pointer bg-background-secondary'
            ref={tagsDropDownToggler}
          >
            + Add Tag
          </li>
        </TagsDropDown>
      </ul>
    </>
  );
}
