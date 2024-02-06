import { format } from 'date-fns';
import { useSelector } from 'react-redux';

export function useFormatDateAndTime() {
  const { dateFormat, timeFormat } = useSelector((state) => state.settings.general.dateAndTime);

  return (date, withTime = true) => format(date, `${dateFormat} ${withTime ? timeFormat : ''}`);
}
