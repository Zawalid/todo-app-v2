export function Footer({ noteInfo }) {
  return (
    <div className='mt-3 flex items-center justify-between bg-background-secondary px-3 py-1  font-medium text-text-tertiary'>
      <div>
        <span className='text-[10px] '>
          <i className='fas fa-calendar mr-2 text-text-tertiary '></i>
          {noteInfo.date}
        </span>
      </div>
      <div className='flex items-center'>
        <span className='text-[10px]'>{noteInfo.words} words</span>
        <span className='mx-2 border-x border-text-tertiary px-2 text-[10px]'>
          {noteInfo.characters} characters
        </span>
        {noteInfo.getStatus()}
      </div>
    </div>
  );
}
