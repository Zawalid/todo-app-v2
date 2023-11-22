export function Button({ isLoading, text, children }) {
  return (
    <button className='mx-auto flex w-full justify-center rounded-lg bg-text-secondary py-2 font-medium text-white'>
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
