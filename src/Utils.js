function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}
export function getFormatedDate(date) {
  let formatedDate;
  const diffDays = getDifferenceInDays(new Date(), new Date(date));

  if (diffDays <= 7) {
    switch (diffDays) {
      case 0:
        formatedDate = 'Today';
        break;
      case 1:
        formatedDate = 'Yesterday';
        break;
      default:
        formatedDate = `${diffDays} days ago`;
    }
  } else {
    formatedDate = new Date(date).toDateString({
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  }
  return formatedDate;
}

export function checkIfToday(date) {
  if (!date) return;
  return date === new Date().toISOString().split('T')[0];
}
export function checkIfTomorrow(date) {
  if (!date) return;
  return date === new Date(Date.now() + 86400000).toISOString().split('T')[0];
}
