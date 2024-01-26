import Tippy from '@tippyjs/react';

const defaultOptions = {
  className: 'w-36  overflow-auto  max-h-[200px]',
  placement: 'bottom-end',
  trigger: 'click',
  shouldCloseOnClick: true,
};
export function DropDown({
  children,
  toggler,
  togglerClassName,
  togglerDisabled,
  options,
  onOpen,
  onClose,
}) {
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
      <button
        onClick={(e) => e.stopPropagation()}
        className={togglerClassName}
        disabled={togglerDisabled}
      >
        {toggler}
      </button>
    </Tippy>
  );
}

function Button({
  children,
  onClick,
  className,
  isDeleteButton,
  size = 'default',
  isCurrent,
  disabled,
}) {
  return (
    <li
      className={`' + className + relative flex w-full cursor-pointer items-center gap-3  overflow-hidden rounded-md font-medium text-text-secondary transition-colors
        duration-300 
        ${size === 'small' ? ' px-2 py-1 ' : ' px-3 py-2 '}
        ${isDeleteButton && !disabled ? 'hover:bg-red-500 hover:text-white ' : ' '}
        ${isCurrent ? 'bg-background-secondary ' : 'bg-background-primary '}
        ${
          disabled
            ? 'cursor-not-allowed opacity-50 '
            : 'hover:bg-background-secondary hover:text-text-primary'
        }
        ${className}
        `}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

function Toggler({ children }) {
  return (
    <span className='flex w-36 cursor-pointer items-center justify-between rounded-lg border border-zinc-200  bg-background-secondary p-2 text-start  text-sm text-text-secondary  focus:outline-none'>
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
