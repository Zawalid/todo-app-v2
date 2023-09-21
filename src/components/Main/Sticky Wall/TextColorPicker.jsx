import { useColorPicker } from './useColorPicker';

export function TextColorPicker({ onChange }) {
  const { isOpen, setIsOpen, colorsDiv } = useColorPicker(onChange);

  return (
    <>
      <i
        className={'fas cursor-pointer ' + (isOpen ? 'fa-chevron-left' : 'fa-chevron-right')}
        onClick={() => setIsOpen(!isOpen)}
      ></i>
      <div
        className={' absolute flex h-full items-center justify-center gap-1 transition-[left] duration-500 ' +
          (isOpen ? 'left-8' : '-left-10')}
        ref={colorsDiv}
      >
        <span
          className='h-4 w-4 cursor-pointer rounded-full bg-text-secondary shadow-md'
          data-color='#444'
        ></span>
        <span
          className='h-4 w-4 cursor-pointer rounded-full bg-background-primary shadow-md'
          data-color='#fff'
        ></span>
      </div>
    </>
  );
}
