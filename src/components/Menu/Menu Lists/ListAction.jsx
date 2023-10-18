import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../Colors';
export function ListAction({
  isOpen,
  reference,
  onDelete,
  onClose,
  onChangeColor,
  onOpenRenameInput,
  onDuplicateList,
}) {
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const colorsDiv = useRef(null);

  useEffect(() => {
    isOpen || setIsColorsOpen(false);
  }, [isOpen]);
  useEffect(() => {
    function handleClick(e) {
      if (isOpen && e.target.tagName === 'SPAN') {
        const color = e.target.dataset.color;
        onChangeColor(color);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    // eslint-disable-next-line
  }, [isOpen]);

  function handleChangeColor() {
    setIsColorsOpen(!isColorsOpen);
  }

  return (
    <ul
      className={
        'absolute right-1 top-full z-10 mt-2 w-44 rounded-lg bg-background-primary p-3 shadow-md ' +
        (isOpen ? 'block' : 'hidden')
      }
      ref={reference}
    >
      <li
        className='mb-3 grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-sm text-text-secondary transition-colors duration-300 hover:text-text-tertiary'
        onClick={() => {
          onOpenRenameInput();
          setTimeout(() => onClose(), 50);
        }}
      >
        <i className='fa-solid fa-pen '></i>
        <p>Rename List</p>
      </li>
      {isColorsOpen || (
        <li
          className='grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-sm text-text-secondary transition-colors duration-300 hover:text-text-tertiary'
          onClick={handleChangeColor}
        >
          <i className='fa-solid fa-palette'></i>
          <p>Change Color</p>
        </li>
      )}
      <div
        className={
          'flex flex-wrap items-center gap-2  overflow-hidden transition-[height] duration-300 ' +
          (isColorsOpen ? 'h-16' : 'h-0')
        }
        ref={colorsDiv}
      >
        <Colors />
      </div>
      <li
        className='my-3 grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-sm text-text-secondary transition-colors duration-300 hover:text-text-tertiary'
        onClick={() => {
          onDuplicateList();
          setTimeout(() => onClose(), 50);
        }}
      >
        <i className='fa-solid fa-copy '></i>
        <p>Duplicate List</p>
      </li>
      <li
        className='grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-sm text-text-secondary transition-colors duration-300 hover:text-text-tertiary'
        onClick={onDelete}
      >
        <i className='fa-solid fa-trash-can '></i>
        <p>Delete List</p>
      </li>
      <li className='mt-3 grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-sm text-text-secondary transition-colors duration-300 hover:text-text-tertiary'>
        <i className='fa-solid fa-heart '></i>
        <p>Add To Favorites</p>
      </li>
    </ul>
  );
}
