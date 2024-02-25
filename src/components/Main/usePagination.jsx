import { useCallback, useEffect, useReducer, useRef } from 'react';
import { DropDown } from '../Common/DropDown';

const rowsPerPageOptions = [5, 10, 20, 30];

const paginationState = {
  currentPage: 1,
  rowsPerPage: 10,
  disabledButton: 'previous',
};
function paginationReducer(state, action) {
  switch (action.type) {
    case 'NEXT_PAGE':
      return { ...state, currentPage: state.currentPage + 1 };
    case 'PREVIOUS_PAGE':
      return { ...state, currentPage: state.currentPage - 1 };
    case 'CHANGE_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, currentPage: 1 };
    case 'DISABLE_BUTTON':
      return { ...state, disabledButton: action.payload };
    default:
      throw new Error(
        `Unknown action type: ${action.type}. Make sure to add the action type to the reducer.`,
      );
  }
}

export function usePagination(itemsLength) {
  const [pagination, dispatch] = useReducer(paginationReducer, paginationState);
  const { currentPage, rowsPerPage, disabledButton } = pagination;
  const totalPages = useRef(Math.ceil(itemsLength / rowsPerPage));

  function handleNextPage() {
    currentPage * rowsPerPage >= itemsLength ||
      dispatch({ type: 'NEXT_PAGE', payload: currentPage + 1 });
  }
  const handlePreviousPage = useCallback(() => {
    currentPage === 1 || dispatch({ type: 'PREVIOUS_PAGE', payload: currentPage - 1 });
  }, [currentPage, dispatch]);

  // Responsible for disabling the pagination items when the user reaches the first or last page
  useEffect(() => {
    if (currentPage * rowsPerPage >= itemsLength)
      dispatch({ type: 'DISABLE_BUTTON', payload: 'next' });
    if (currentPage === 1) dispatch({ type: 'DISABLE_BUTTON', payload: 'previous' });
    if (currentPage * rowsPerPage >= itemsLength && currentPage === 1)
      dispatch({ type: 'DISABLE_BUTTON', payload: 'both' });
  }, [currentPage, rowsPerPage, itemsLength, dispatch]);

  useEffect(() => {
    totalPages.current = Math.ceil(itemsLength / rowsPerPage);
    currentPage > totalPages.current && handlePreviousPage();

    return () => dispatch({ type: 'DISABLE_BUTTON', payload: 'none' });
  }, [itemsLength, rowsPerPage, currentPage, handlePreviousPage, dispatch]);

  return {
    Pagination: (
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center  gap-2'>
          <span className='text-xs font-medium text-text-secondary sm:text-sm '>
            Rows per page:
          </span>
          <DropDown
            toggler={
              <span
                className=' cursor-pointer rounded-lg bg-background-secondary  px-3  py-1.5
            text-xs text-text-tertiary focus:outline-none sm:text-sm'
              >
                {rowsPerPage}
              </span>
            }
            options={{ placement: 'top', className: 'w-fit' }}
          >
            {rowsPerPageOptions.map((option) => (
              <DropDown.Button
                key={option}
                className='justify-center'
                size='small'
                onClick={() => dispatch({ type: 'CHANGE_ROWS_PER_PAGE', payload: option })}
                isCurrent={option === rowsPerPage}
              >
                <span>{option}</span>
              </DropDown.Button>
            ))}
          </DropDown>

          <span className='flex gap-1 text-xs text-text-secondary sm:text-sm'>
            <span className='font-semibold text-text-primary'>{currentPage}</span>
            of
            <span className='font-semibold text-text-primary'>
              {Math.ceil(itemsLength / rowsPerPage)}
            </span>
          </span>
        </div>

        <div className='flex items-center'>
          <button
            className='pagination-button  rounded-l-lg'
            disabled={disabledButton === 'previous' || disabledButton === 'both'}
            onClick={handlePreviousPage}
          >
            Previous
          </button>

          <button
            className='pagination-button  rounded-r-lg'
            disabled={disabledButton === 'next' || disabledButton === 'both'}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    ),
    currentPage,
    rowsPerPage,
  };
}
