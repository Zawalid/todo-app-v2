export function Button({ text, children, isLoading, disabled, onClick, className, isCancel }) {
  const primaryClass = !isCancel ? 'bg-primary text-white hover:bg-primary-hover' : '';

  const cancelClass = isCancel
    ? 'bg-background-secondary text-text-secondary  hover:bg-background-tertiary'
    : '';

  const disabledClass = disabled ? 'bg-background-disabled text-text-disabled' : '';

  return (
    <button
      className={`mt-auto flex justify-center rounded-lg  px-3 py-2 text-sm font-medium ${className} ${
        disabled ? disabledClass : `${primaryClass} ${cancelClass}`
      }`}
      disabled={disabled}
      onClick={() => !disabled && onClick?.()}
    >
      {isLoading ? (
        <div className='flex items-center gap-3 text-white'>
          <i className='fa-solid fa-spinner animate-spin'></i>
          <span>{`${text.split(' ')[0]}ing ${text.split(' ')[1]}...`}</span>
        </div>
      ) : (
        children || text
      )}
    </button>
  );
}
