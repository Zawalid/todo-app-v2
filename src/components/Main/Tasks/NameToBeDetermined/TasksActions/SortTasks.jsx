export function SortTasks({ reference, sortKey, sortDirection }) {
  return (
    <div className='flex flex-wrap gap-3' ref={reference}>
      <Button
        dataKey='title'
        title='Title'
        sortDirection={sortDirection}
        isActive={sortKey === 'title'}
      />
      <Button
        dataKey='dDate'
        title='Due Date'
        sortDirection={sortDirection}
        isActive={sortKey === 'dDate'}
      />
      <Button
        dataKey='cDate'
        title='Creation Date'
        sortDirection={sortDirection}
        isActive={sortKey === 'cDate'}
      />
      <Button
        dataKey='priority'
        title='Priority'
        sortDirection={sortDirection}
        isActive={sortKey === 'priority'}
      />
    </div>
  );
}
function Button({ dataKey, title, sortDirection, isActive }) {
  return (
    <button
      className='relative min-w-[150px] flex-1  rounded-lg bg-background-secondary px-4 py-1  text-center text-text-tertiary'
      data-key={dataKey}
    >
      <i
        className={
          'fa-solid  absolute left-2 mr-3 ' +
          (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-desc ') +
          (isActive ? '' : 'hidden')
        }
      ></i>
      {title}
    </button>
  );
}
