export function Title({ title, count }) {
  return (
    <div className='mb-5 flex items-center gap-8'>
      <h1 className='truncate text-3xl font-bold text-text-primary sm:text-4xl'>{title}</h1>
      {count >= 0 && (
        <span className='rounded-lg border border-border px-2 py-1 text-2xl  font-semibold text-text-primary sm:px-3 sm:py-2 sm:text-3xl'>
          {count}
        </span>
      )}
    </div>
  );
}
