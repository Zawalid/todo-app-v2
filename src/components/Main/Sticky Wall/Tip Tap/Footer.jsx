import { getFormattedDate } from '../../../../utils/Moment';

export function Footer({ editor, creationDate }) {
  const cDate = getFormattedDate(creationDate);
  return (
    <div className='mt-3 flex items-center justify-between bg-background-secondary px-3 py-2  font-medium text-text-tertiary'>
      <div>
        <span className='text-xs sm:text-sm'>
          <i className='fas fa-calendar mr-2 text-text-tertiary '></i>
          Created {Number.isFinite(parseInt(cDate)) ? 'on' : ''} {cDate}
        </span>
      </div>
      <div>
        <span className='mr-2 text-xs sm:text-sm border-r border-text-tertiary pr-2'>
          {editor?.storage?.characterCount?.words()} words
        </span>
        <span className='text-xs sm:text-sm'>{editor?.storage?.characterCount?.characters()} characters</span>
      </div>
    </div>
  );
}
