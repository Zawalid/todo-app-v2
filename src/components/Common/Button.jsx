export function Button({ text, children, isLoading, disabled, onClick, className }) {
  return (
    <button
      className={`mx-auto mt-auto flex justify-center  rounded-lg py-2 text-sm font-medium ${className} ${
        disabled
          ? 'bg-background-disabled text-text-disabled'
          : 'bg-primary  text-white hover:bg-primary-hover'
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
