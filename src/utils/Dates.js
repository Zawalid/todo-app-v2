import {
  isToday,
  isTomorrow,
  isYesterday,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isBefore,
  startOfDay,
} from 'date-fns';

export function checkIfToday(date) {
  if (!date) return;
  return isToday(new Date(date)) || date === 'Today';
}

export function checkIfTomorrow(date) {
  if (!date) return;
  return isTomorrow(new Date(date)) || date === 'Tomorrow';
}

export function checkIfYesterday(date) {
  if (!date) return;
  return isYesterday(new Date(date));
}

export function isDateInCurrentWeek(dateToCheck, weekStartsOn) {
  const startOfWeekDate = startOfWeek(new Date(), {
    weekStartsOn,
  });
  const endOfWeekDate = endOfWeek(new Date(), {
    weekStartsOn,
  });
  return isWithinInterval(new Date(dateToCheck), { start: startOfWeekDate, end: endOfWeekDate });
}

export function isTaskOverdue(dateToCheck) {
  return isBefore(startOfDay(new Date(dateToCheck)), startOfDay(new Date()));
}
