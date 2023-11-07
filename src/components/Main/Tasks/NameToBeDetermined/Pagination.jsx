export function Pagination({
  currentPage,
  onNextPage,
  onPreviousPage,
  rowsPerPage,
  tasksLength,
  onChangeRowsPerPage,
  disabledButton,
}) {
  return (
    <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
      <div className='flex items-center  gap-2'>
        <span className='text-sm font-medium text-text-secondary '>Rows per page:</span>
        <select
          className=' cursor-pointer rounded-lg bg-background-secondary  px-3  py-1.5
            text-sm text-text-tertiary focus:outline-none'
          value={rowsPerPage}
          onChange={onChangeRowsPerPage}
        >
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='30'>50</option>
        </select>
        <span className='dark:text-dark-text-2 flex gap-1 text-sm text-text-secondary'>
          <span className='dark:text-dark-text font-semibold text-text-primary'>{currentPage}</span>
          of
          <span className='dark:text-dark-text font-semibold text-text-primary'>
            {Math.ceil(tasksLength / rowsPerPage)}
          </span>
        </span>
      </div>

      <div className='flex items-center'>
        <button
          className={`pagination-button rounded-l-lg ${
            disabledButton === 'previous' || disabledButton === 'both'
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-background-tertiary  '
          }`}
          onClick={onPreviousPage}
        >
          Previous
        </button>

        <button
          className={`pagination-button rounded-r-lg ${
            disabledButton === 'next' || disabledButton === 'both'
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-background-tertiary'
          }`}
          onClick={onNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
