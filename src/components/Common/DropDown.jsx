import Tippy from '@tippyjs/react';

export default function DropDown({
  children,
  toggler,
  options = {
    className: 'w-32',
    placement: 'bottom',
  },
  shouldCloseOnClick = true,
}) {
  return (
    <Tippy
      content={<ul className='space-y-1 p-2'>{children}</ul>}
      className={'border border-zinc-200 p-0 shadow-md ' + (options.className || '')}
      theme='light'
      trigger='click'
      interactive={true}
      arrow={false}
      placement={options.placement || 'bottom'}
      onShown={(instance) => {
        shouldCloseOnClick &&
          document
            .querySelector('[data-tippy-root]')
            .addEventListener('click', () => instance.hide());
      }}
    >
      <button className='w-fit'>{toggler}</button>
    </Tippy>
  );
}

function Button({ children, onClick, className }) {
  return (
    <li>
      <button
        className={
          'relative flex w-full cursor-pointer items-center  gap-3 rounded-md p-2 px-3 transition-colors duration-300 hover:bg-background-secondary ' +
          className
        }
        onClick={onClick}
      >
        {children}
      </button>
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
