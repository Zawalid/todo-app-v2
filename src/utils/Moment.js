import moment from 'moment';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});


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


