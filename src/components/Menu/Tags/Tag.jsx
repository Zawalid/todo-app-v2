import { useModal } from '../../../hooks/useModal';
import { PiX } from 'react-icons/pi';
import { useDeleteTag } from '../../../lib/react-query/mutations';

export function Tag({ tag, showDeleteButton, customClassName, onDeleteTag, onSelectTag }) {
  const { mutate: deleteTag } = useDeleteTag();
  const { openModal: confirmDelete } = useModal();
  return (
    <>
      <div
        className={
          'grid items-center gap-1 overflow-hidden' +
          (showDeleteButton ? ' grid-cols-[16px_auto]' : '')
        }
      >
        {showDeleteButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTag
                ? onDeleteTag(tag.$id)
                : confirmDelete({
                    title: 'Delete Tag',
                    message: `Are you sure you want to delete this tag ?`,
                    onConfirm: async (deletePermanently) =>
                      deleteTag({ id: tag.$id, deletePermanently }),
                  });
            }}
          >
            <PiX className='text-red-500' />
          </button>
        )}
        <li
          className={
            'menu_tag_element list-none relative overflow-hidden truncate text-center ' + customClassName
          }
          style={{ backgroundColor: `var(${tag.bgColor})`, color: tag.textColor }}
          onClick={() => onSelectTag?.(tag.$id)}
        >
          {tag.title}
        </li>
      </div>
    </>
  );
}
