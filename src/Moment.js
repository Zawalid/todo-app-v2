import moment from 'moment';

export function getFormattedDate(date) {
  const inputDate = moment(date);
  const diffDays = moment().diff(inputDate, 'days');

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return diffDays <= 7 ? `${diffDays} days ago` : inputDate.format('ddd MMM D YY');
}

export function checkIfToday(date) {
  if (!date) return;
  return moment(date).isSame(moment(), 'day');
}
export function checkIfTomorrow(date) {
  if (!date) return;
  return moment(date).isSame(moment().add(1, 'day'), 'day');
}
export function checkIfYesterday(date) {
  if (!date) return;
  return moment(date).isSame(moment().subtract(1, 'day'), 'day');
}

export function isDateInCurrentWeek(dateToCheck) {
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');
  return moment(dateToCheck).isBetween(startOfWeek, endOfWeek);
}

export function isTaskOverdue(dateToCheck) {
  return moment(dateToCheck).isBefore(moment(), 'day');
}


