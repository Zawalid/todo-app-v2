import { useState } from 'react';
import { ConfirmationModal } from '../../ConfirmationModal';
import { useTags } from '../../../hooks/useTags';

export function Tag({ tag, showDeleteButton, customClassName }) {
  const { handleDeleteTag } = useTags();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  return (
    <>
      <li
        className={'menu_tag_element relative ' + customClassName}
        style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
        data-id={tag.$id}
      >
        {showDeleteButton && (
          <button
            className='absolute -right-1 -top-1 grid h-3 w-3 cursor-pointer place-content-center rounded-full bg-red-600'
            onClick={() => setIsConfirmationModalOpen(true)}
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
            handleDeleteTag(tag.$id);
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
    </>
  );
}
