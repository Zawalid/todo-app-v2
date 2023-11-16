
export function Button({ text, disabled }) {
  return (
    <button
      className={'mx-auto mt-8 flex w-full justify-center rounded-lg py-2 font-medium text-white ' +
        (disabled ? 'bg-zinc-300' : 'bg-text-secondary')}
      disabled={disabled}
    >
      <div className='flex items-center gap-3 text-white'>
        <i className='fa-solid fa-floppy-disk'></i>
        <span>{text}</span>
      </div>
    </button>
  );
}
