import { Tag } from '../Menu/Tags/Tag';
import { DropDown } from '../Common/DropDown';
import { PiPlusBold } from 'react-icons/pi';
import { useTags } from '../../lib/react-query/queries';

export function TaskTags({ taskTagsIds, handleAddTagToTask, handleDeleteTagFromTask }) {
  const { tags } = useTags();
  if (!taskTagsIds) return null;

  const validTags = taskTagsIds.filter((id) => tags?.find((tag) => tag.$id === id));

  return (
    <>
      <label className='justify-self-start text-sm text-text-tertiary'>Tags</label>
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span> Add Tag</span>
            {validTags.length === 0 ? (
              <PiPlusBold />
            ) : (
              <span className='grid h-5 w-5 place-content-center rounded-full bg-primary text-xs text-white'>
                {validTags.length}
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
