import { useTags } from '../../../../lib/react-query/queries';
import { Tag } from '../../../Menu/Tags/Tag';

export function TaskTags({ tagsIds }) {
  const { tags } = useTags();
  if (!tagsIds?.length > 0) return null;
  return tagsIds.map((tagId) => {
    const tag = tags.find((t) => t.$id === tagId);
    if (tag)
      return (
        <Tag
          key={tag.$id}
          tag={tag}
          isMainTag={false}
          showDeleteButton={false}
          customClassName={'px-2 py-1 cursor-auto'} />
      );
  });
}
