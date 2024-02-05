import { useTags } from '../../../hooks/useTags';
import { useModal } from '../../../hooks/useModal';
import { PiX } from 'react-icons/pi';

export function Tag({ tag, showDeleteButton, customClassName, onDeleteTag, onSelectTag }) {
  const { handleDeleteTag } = useTags();
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
                    onConfirm: async () => handleDeleteTag(tag.$id),
                  });
            }}
          >
            < PiX className='text-red-500' />
          </button>
        )}
        <li
          className={
            'menu_tag_element relative overflow-hidden truncate text-center ' + customClassName
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
