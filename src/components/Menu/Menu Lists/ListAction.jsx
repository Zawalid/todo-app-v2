import { useEffect, useRef, useState } from 'react';
import { Colors } from '../../Common/Colors';
export function ListAction({
  isOpen,
  reference,
  onDelete,
  onClose,
  onChangeColor,
  onOpenRenameInput,
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

  return (
    <ul
      className={
        'absolute right-1 top-full z-10 mt-2 w-44 rounded-lg bg-background-primary p-2 border border-zinc-200 shadow-md ' +
        (isOpen ? 'block' : 'hidden')
      }
      ref={reference}
    >
      <Li
        onClick={() => {
          onOpenRenameInput();
          setTimeout(() => onClose(), 50);
        }}
      >
        <i className='fa-solid fa-pen '></i>
        <p>Rename List</p>
      </Li>
      {isColorsOpen || (
        <Li onClick={() => setIsColorsOpen(!isColorsOpen)}>
          <i className='fa-solid fa-palette'></i>
          <p>Change Color</p>
        </Li>
      )}
      <div
        className={
          'flex flex-wrap items-center gap-2  overflow-hidden transition-[height] duration-300 ' +
          (isColorsOpen ? 'h-auto' : 'h-0')
        }
        ref={colorsDiv}
      >
        <Colors />
      </div>
      <Li onClick={onDelete} className='hover:bg-red-500 hover:text-white'>
        <i className='fa-solid fa-trash-can '></i>
        <p>Delete List</p>
      </Li>
    </ul>
  );
}

function Li({ children, onClick, className }) {
  return (
    <li
      className={
        'mb-1 grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 rounded-md px-3 py-1 text-start text-sm text-text-secondary transition-colors  duration-300 hover:bg-background-tertiary ' +
        className
      }
      onClick={onClick}
    >
      {children}
    </li>
  );
}
