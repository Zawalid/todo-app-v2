import { Tag } from '../Menu/Menu Tags/Tag';


export function TagsDropDown({ tags, reference }) {
  return (
    <div
      className='absolute -left-full top-full mt-2 cursor-auto  rounded-lg border  border-background-tertiary bg-background-primary p-3'
      ref={reference}
    >
      <ul className='flex h-auto w-[200px] flex-wrap gap-2  ' ref={reference}>
        {tags.length > 0 &&
          tags.map((tag) => (
            <Tag
              key={tag.id}
              title={tag.title}
              bgColor={tag.bgColor}
              textColor={tag.textColor}
              showDeleteButton={false}
              id={tag.id}
              customClassName={'cursor-pointer'} />
          ))}
        {tags.length === 0 && (
          <li className='flex-1 text-center text-sm text-text-tertiary'>No tags yet</li>
        )}
      </ul>
    </div>
  );
}
