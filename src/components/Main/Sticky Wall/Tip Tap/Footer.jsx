function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}
export function Footer({ editor, creationDate }) {
  let cDate;
  const diffDays = getDifferenceInDays(new Date(), new Date(creationDate));

  if (diffDays <= 7) {
    switch (diffDays) {
      case 0:
        cDate = 'Today';
        break;
      case 1:
        cDate = 'Yesterday';
        break;
      default:
        cDate = `${diffDays} days ago`;
    }
  } else {
    cDate = new Date(creationDate).toLocaleDateString();
  }

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
