export function TaskDates({ date }) {
  return (
    <>
      <p className='mb-1 text-xs font-medium text-text-tertiary '>
        Created :{' '}
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(date.created))}
      </p>
      <p className='text-xs font-medium text-text-tertiary '>
        Last modified :{' '}
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(date.updated))}
      </p>
    </>
  );
}
