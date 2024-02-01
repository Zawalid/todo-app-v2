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
  return isToday(new Date(date));
}

export function checkIfTomorrow(date) {
  if (!date) return;
  return isTomorrow(new Date(date));
}

export function checkIfYesterday(date) {
  if (!date) return;
  return isYesterday(new Date(date));
}

export function isDateInCurrentWeek(dateToCheck) {
  const startOfWeekDate = startOfWeek(new Date());
  const endOfWeekDate = endOfWeek(new Date());
  return isWithinInterval(new Date(dateToCheck), { start: startOfWeekDate, end: endOfWeekDate });
}

export function isTaskOverdue(dateToCheck) {
  return isBefore(startOfDay(new Date(dateToCheck)), startOfDay(new Date()));}
