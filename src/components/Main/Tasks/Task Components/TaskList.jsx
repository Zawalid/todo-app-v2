export function TaskList({ listId, listName, listColor }) {
  if (!listId || listId === 'none') return null;
  return (
    <div className='grid grid-cols-[16px_auto] items-center gap-2 overflow-hidden'>
      <span className='h-4 w-4 rounded-sm' style={{ backgroundColor: `var(${listColor})` }}></span>
      <span className='truncate text-xs font-semibold text-text-secondary'>{listName}</span>
    </div>
  );
}
