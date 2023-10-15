export function SortTasks({ reference }) {
  return (
    <div className='flex flex-wrap gap-3' ref={reference}>
      <Button dataKey='title' title='Title' />
      <Button dataKey='dueDate' title='Due Date' />
      <Button dataKey='created' title='Creation Date' />
      <Button dataKey='priority' title='Priority' />
    </div>
  );
}
function Button({ dataKey, title }) {
  return (
    <button
      className='relative flex-1 min-w-[150px]  rounded-lg bg-background-secondary px-4 py-1  text-center text-text-tertiary'
      data-key={dataKey}
    >
      <i className='fa-solid fa-sort-down absolute left-2 mr-3 hidden'></i>
      {title}
    </button>
  );
}
