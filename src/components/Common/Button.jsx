import { FaSpinner } from "react-icons/fa6";

export function Button({
  children,
  isLoading,
  disabled,
  onClick,
  className,
  type = 'primary',
  size = 'default',
}) {
  const variations = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    cancel: 'bg-background-secondary text-text-secondary  hover:bg-background-tertiary',
    disabled: 'bg-background-disabled text-text-disabled',
    outline:
      'bg-transparent border border-border hover:border-primary text-text-primary hover:bg-primary hover:text-white',
    delete: 'bg-red-500 text-white hover:bg-red-600',
    'outline-delete': 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
  };

  const sizes = {
    small: 'px-2 py-1.5 text-xs rounded-md',
    default: 'px-3 py-2 text-sm rounded-lg',
    large: 'px-4 py-3 text-base rounded-xl',
  };

  return (
    <button
      className={`mt-auto transition-colors duration-300 flex justify-center font-medium ${className} ${sizes[size]} ${
        disabled ? variations.disabled : variations[type]
      }`}
      disabled={disabled}
      onClick={() => !disabled && onClick?.()}
    >
      {isLoading ? (
        <div className='flex items-center gap-3 text-white'>
          <FaSpinner className='animate-spin' />
          <span>{`${children.split(' ')[0]}ing ${children.split(' ')[1]}...`}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
