export function Button({ text, disabled, onClick }) {
  return (
    <button
      className={
        'mx-auto mt-auto flex w-full justify-center rounded-lg py-2 font-medium text-white transition-colors duration-300 ' +
        (disabled ? 'bg-zinc-200' : 'bg-text-secondary')
      }
      disabled={disabled}
      onClick={() => {
        if (!onClick) return;
        !disabled && onClick();
      }}
    >
      <span className='text-white'>{text}</span>
    </button>
  );
}