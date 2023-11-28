export function Button({ text, children, isLoading, disabled, onClick }) {
  return (
    <button
      className={
        'mx-auto mt-auto flex w-full justify-center rounded-lg py-2 font-medium text-white transition-colors duration-500 ' +
        (disabled ? 'bg-zinc-200' : 'bg-indigo-600  hover:bg-indigo-500')
      }
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