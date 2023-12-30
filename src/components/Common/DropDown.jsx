import Tippy from '@tippyjs/react';

export function DropDown({
  children,
  toggler,
  togglerClassName,
  options,
  shouldCloseOnClick = true,
  onOpen,
  onClose,
}) {
  const defaultOptions = {
    className: 'w-32',
    placement: 'bottom-end',
  };

  return (
    <Tippy
      content={<ul className='grid gap-1 p-2'>{children}</ul>}
      className={
        'border border-zinc-200 p-0 shadow-md ' + (options?.className || defaultOptions.className)
      }
      theme='light'
      trigger='click'
      interactive={true}
      arrow={false}
      placement={options?.placement || defaultOptions.placement}
      onShown={(instance) => {
        onOpen?.();
        shouldCloseOnClick &&
          document
            .querySelector('[data-tippy-root]')
            .addEventListener('click', () => instance?.hide());
      }}
      onHidden={onClose}
    >
      <button className={`w-fit ${togglerClassName}`}>{toggler}</button>
    </Tippy>
  );
}

function Button({ children, onClick, className }) {
  return (
    <li
      className={
        'relative flex w-full cursor-pointer items-center  gap-3 rounded-md p-2 px-3 transition-colors duration-300 hover:bg-background-secondary ' +
        className
      }
      onClick={onClick}
    >
      {children}
    </li>
  );
}

function Toggler({ children }) {
  return (
    <span className='flex w-32 cursor-pointer items-center justify-between rounded-lg border border-zinc-200  bg-background-secondary p-2 text-start  text-sm text-text-secondary  focus:outline-none'>
      {children}
    </span>
  );
}

DropDown.Button = Button;
DropDown.Toggler = Toggler;
