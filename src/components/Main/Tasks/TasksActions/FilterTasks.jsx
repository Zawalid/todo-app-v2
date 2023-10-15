export function FilterTasks({ selectedOption, onSelect }) {
  return (
    <div className='relative flex-1'>
      <i className='fas fa-filter absolute left-3 top-2 text-text-tertiary '></i>
      <select
        className='w-full cursor-pointer rounded-lg bg-background-secondary py-1 pl-10 text-text-tertiary  focus:outline-none
        '
        value={selectedOption}
        onChange={onSelect}
      >
        <option value='all'>All</option>
        <option value='completed'>Completed</option>
        <option value='uncompleted'>Uncompleted</option>
        <option value='overdue'>Overdue</option>
        <option value='highPriority'>High Priority</option>
        <option value='mediumPriority'>Medium Priority</option>
        <option value='lowPriority'>Low Priority</option>
      </select>
    </div>
  );
}
