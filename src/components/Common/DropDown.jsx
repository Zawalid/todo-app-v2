import Tippy from '@tippyjs/react';


const defaultOptions = {
  className: 'w-32',
  placement: 'bottom-end',
  trigger: 'click',
  shouldCloseOnClick: true,
};
export function DropDown({ children, toggler, togglerClassName, options, onOpen, onClose }) {

  return (
    <Tippy
      content={<ul className='grid gap-1 p-2'>{children}</ul>}
      className={
        'border border-zinc-200 p-0 shadow-md ' + (options?.className || defaultOptions.className)
      }
      theme='light'
      trigger={options?.trigger || defaultOptions.trigger}
      interactive={true}
      arrow={false}
      placement={options?.placement || defaultOptions.placement}
      onShow={(instance) => {
        onOpen?.();
        (options?.shouldCloseOnClick ?? defaultOptions.shouldCloseOnClick) &&
          instance.popper.addEventListener('click', () => instance.hide());
      }}
      onHidden={onClose}
    >
      <button className={togglerClassName}>{toggler}</button>
    </Tippy>
  );
}

function Button({ children, onClick, className, isDeleteButton,size = 'default' }) {
  return (
    <li
      className={
        'relative flex w-full cursor-pointer items-center  gap-3 rounded-md transition-colors duration-300 hover:bg-background-secondary ' +
        className +
        (size === 'small' ? ' py-1 px-2' : ' py-2 px-3') +
        (isDeleteButton ? ' hover:bg-red-500 hover:text-white' : '')
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

function Title({ children }) {
  return <span className='text-sm text-text-tertiary'>{children}</span>;
}

function Divider() {
  return <hr className='border border-zinc-200' />;
}

function NestedMenu({ children, toggler, togglerClassName, options }) {
  return (
    <DropDown
      toggler={toggler}
      togglerClassName={togglerClassName}
      options={{
        ...options,
        trigger: 'mouseenter focus',
      }}
    >
      {children}
    </DropDown>
  );
}
DropDown.Button = Button;
DropDown.Toggler = Toggler;
DropDown.Title = Title;
DropDown.Divider = Divider;
DropDown.NestedMenu = NestedMenu;
