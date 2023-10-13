import { getFormattedDate } from '../../../../Utils';

export function Footer({ editor, creationDate }) {
  const cDate = getFormattedDate(creationDate);
  return (
    <div className='mt-3 flex items-center justify-between bg-background-secondary px-3 py-2 text-sm font-medium text-text-tertiary'>
      <div>
        <span>
          <i className='fas fa-calendar mr-2 text-text-tertiary '></i>
          Created {Number.isFinite(parseInt(cDate)) ? 'on' : ''} {cDate}
        </span>
      </div>
      <div>
        <span className='mr-2 border-r border-text-tertiary pr-2'>
          {editor?.storage?.characterCount?.words()} words
        </span>
        <span>{editor?.storage?.characterCount?.characters()} characters</span>
      </div>
    </div>
  );
}
