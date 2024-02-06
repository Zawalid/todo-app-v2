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
        'border border-border p-0 shadow-md ' + (options?.className || defaultOptions.className)
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
        className={`${togglerClassName} disabled:bg-background-disabled disabled:text-text-disabled` }
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
  className = '',
  isDeleteButton,
  size = '',
  isCurrent,
  disabled,
  id,
}) {
  return (
    <li
      className={`dropDown-button ${size} ${className} ${isDeleteButton ? 'delete' : ' '} ${
        isCurrent ? 'current' : ''
      } ${disabled ? 'disabled' : ''}
        `}
      onClick={() => disabled || onClick?.()}
      id={id}
    >
      {children}
    </li>
  );
}

function Toggler({ children }) {
  return (
    <span className='flex w-36 hover:bg-background-tertiary transition-colors duration-200 cursor-pointer items-center justify-between rounded-lg border border-border  bg-background-secondary p-2 text-start  text-sm text-text-secondary  focus:outline-none'>
      {children}
    </span>
  );
}

function Title({ children }) {
  return <span className='text-sm text-text-tertiary'>{children}</span>;
}

function Divider() {
  return <hr className='border border-border' />;
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
