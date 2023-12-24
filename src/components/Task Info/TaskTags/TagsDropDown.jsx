import Tippy from '@tippyjs/react';
import { useTags } from '../../../hooks/useTags';
import { Tag } from '../../Menu/Menu Tags/Tag';

export function TagsDropDown({ reference, children }) {
  const { tags } = useTags();
  return (
    <Tippy
      content={
        <ul className='flex h-auto max-w-[200px] flex-wrap gap-2' ref={reference}>
          {tags.length > 0 &&
            tags.map((tag) => (
              <Tag
                key={tag.$id}
                tag={tag}
                showDeleteButton={false}
                customClassName={'cursor-pointer'}
              />
            ))}
          {tags.length === 0 && (
            <li className='flex-1 text-center text-sm text-text-tertiary'>No tags yet</li>
          )}
        </ul>
      }
      theme='light'
      trigger='click'
      interactive={true}
      arrow={false}
      placement='bottom'
    >
      {children}
    </Tippy>
  );
}
