import { Tag } from '../Menu/Menu Tags/Tag';
import { TagsDropDown } from './TagsDropDown';

export function TaskTags({
  taskTagsIds, tags, isSelectTagOpen, setIsSelectTagOpen, tagsDropDown, tagsDropDownToggler, handleDeleteTagFromTask,
}) {
  return (
    <>
      <label className='text-sm text-text-tertiary'>Tags</label>
      <ul className='flex flex-wrap gap-2'>
        {taskTagsIds?.map((tagId) => {
          const tag = tags.find((t) => t.id === +tagId);
          if (tag)
            return (
              <Tag
                key={tag.id}
                title={tag.title}
                bgColor={tag.bgColor}
                textColor={tag.textColor}
                isMainTag={false}
                showDeleteButton={true}
                id={tag.id}
                onDeleteTag={() => handleDeleteTagFromTask(tag.id)} />
            );
        })}
        <li
          className='menu_tag_element relative cursor-pointer bg-background-tertiary'
          ref={tagsDropDownToggler}
          onClick={() => setIsSelectTagOpen(true)}
        >
          + Add Tag
          {isSelectTagOpen && <TagsDropDown tags={tags} reference={tagsDropDown} />}
        </li>
      </ul>
    </>
  );
}
