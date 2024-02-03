import { Tag } from '../Menu/Tags/Tag';
import { useTags } from '../../hooks/useTags';
import { DropDown } from '../Common/DropDown';

export function TaskTags({ taskTagsIds, handleAddTagToTask, handleDeleteTagFromTask }) {
  const { tags } = useTags();
  return (
    <>
      <label className='justify-self-start text-sm text-text-tertiary'>Tags</label>
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span> Add Tag</span>
            {taskTagsIds.length === 0 ? (
              <i className='fas fa-plus text-text-secondary'></i>
            ) : (
              <span className='grid h-5 w-5 place-content-center rounded-full bg-primary text-xs text-white'>
                {taskTagsIds.length}
              </span>
            )}
          </DropDown.Toggler>
        }
        options={{
          shouldCloseOnClick: false,
        }}
      >
        {tags.map((tag) => (
          <div key={tag.$id} className='grid grid-cols-[1fr_auto] items-center'>
            <div role='button'>
              <Tag
                tag={tag}
                showDeleteButton={taskTagsIds.includes(tag.$id)}
                onSelectTag={(id) => handleAddTagToTask(id)}
                onDeleteTag={(id) => handleDeleteTagFromTask(id)}
              />
            </div>
          </div>
        ))}
      </DropDown>
    </>
  );
}
