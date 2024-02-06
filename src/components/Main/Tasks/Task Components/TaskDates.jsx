import { useFormatDateAndTime } from '../../../../hooks/useFormatDateAndTime';

export function TaskDates({ date }) {
  const format = useFormatDateAndTime();
  return (
    <>
      <p className='mb-1 text-xs font-medium text-text-tertiary '>
        Created : {format(new Date(date.created))}
      </p>
      <p className='text-xs font-medium text-text-tertiary '>
        Last modified : {format(new Date(date.updated))}
      </p>
    </>
  );
}
