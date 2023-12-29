import { useState } from 'react';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import { useTags } from '../../../hooks/useTags';

export function Tag({ tag, showDeleteButton, customClassName, onDeleteTag, onSelectTag }) {
  const { handleDeleteTag } = useTags();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  return (
    <>
      <li
        className={'menu_tag_element relative text-center ' + customClassName}
        style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
        onClick={() => onSelectTag?.(tag.$id)}
      >
        {showDeleteButton && (
          <button
            className='absolute -right-1 -top-1 grid h-4 w-4 cursor-pointer place-content-center rounded-full bg-red-600'
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTag ? onDeleteTag(tag.$id) : setIsConfirmationModalOpen(true);
            }}
          >
            <i className='fas fa-xmark  text-[10px] text-white'></i>
          </button>
        )}
        {tag.title}
      </li>
      {isConfirmationModalOpen && (
        <ConfirmationModal
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
      )}
    </>
  );
}
