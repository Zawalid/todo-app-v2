import { useState } from 'react';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import { useTags } from '../../../hooks/useTags';

export function Tag({ tag, showDeleteButton, customClassName, onDeleteTag, onSelectTag }) {
  const { handleDeleteTag } = useTags();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  return (
    <>
      <div
        className={
          'items-center gap-1 grid overflow-hidden ' +
          (showDeleteButton ? ' grid-cols-[16px_auto]' : '')
        }
      >
        {showDeleteButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTag ? onDeleteTag(tag.$id) : setIsConfirmationModalOpen(true);
            }}
          >
            <i className='fas fa-xmark text-red-500'></i>
          </button>
        )}
        <li
          className={'menu_tag_element truncate relative overflow-hidden text-center ' + customClassName}
          style={{ backgroundColor: `var(${tag.bgColor})`, color: tag.textColor }}
          onClick={() => onSelectTag?.(tag.$id)}
        >
         {tag.title}
        </li>
      </div>
        <ConfirmationModal
       isOpen={isConfirmationModalOpen}
          sentence={`Are you sure you want to delete this tag ? `}
          confirmText={'Delete'}
          onConfirm={() => {
            setIsConfirmationModalOpen(false);
            handleDeleteTag(tag.$id, deletePermanently);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          element='Tag'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
    </>
  );
}
