import { useEffect, useMemo, useState } from 'react';
export function TasksPeriod({ count, setCount, period, setTasksDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateNow = useMemo(() => new Date(), []);

  useEffect(() => {
    updateCurrentDate(period, count);
  }, [period, count]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentDate(period, count);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dateNow, period, count]);

  const updateCurrentDate = (period, count) => {
    const newDate = new Date();
    if (period === 'days') {
      newDate.setDate(newDate.getDate() + count);
    } else if (period === 'weeks') {
      newDate.setDate(newDate.getDate() + count * 7);
    } else if (period === 'months') {
      newDate.setMonth(newDate.getMonth() + count);
    } else if (period === 'years') {
      newDate.setFullYear(newDate.getFullYear() + count);
    }
    setCurrentDate(newDate);
  };

  useEffect(() => {
    setTasksDate(currentDate);
  }, [period, count, setTasksDate, currentDate]);

  useEffect(() => {
    setCount(0);
  }, [period, setCount]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        setCount((prev) => prev - 1);
      } else if (e.key === 'ArrowRight') {
        setCount((prev) => prev + 1);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, [count]);

  return (
    <div className='flex mb-2 items-center justify-between  text-center'>
      <i
        className='fa-solid fa-chevron-left cursor-pointer text-lg text-text-primary'
        onClick={() => setCount((prev) => prev - 1)}
      ></i>
      {
        {
          days: <TasksByDays currentDate={currentDate} />,
          weeks: <TasksByWeeks currentDate={currentDate} />,
          months: <TasksByMonths currentDate={currentDate} />,
          years: <TasksByYears currentDate={currentDate} />,
        }[period]
      }
      <i
        className='fa-solid fa-chevron-right cursor-pointer text-lg text-text-primary'
        onClick={() => setCount((prev) => prev + 1)}
      ></i>
    </div>
  );
}
function TasksByDays({ currentDate }) {
  return (
    <div>
      <h1 className=' text-xl  font-bold text-text-primary'>
        {currentDate.getDate() === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getYear() === new Date().getYear()
          ? 'Today'
          : currentDate.getDate() === new Date().getDate() + 1 &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getYear() === new Date().getYear()
          ? 'Tomorrow'
          : currentDate.getDate() === new Date().getDate() - 1 &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getYear() === new Date().getYear()
          ? 'Yesterday'
          : currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
            })}
      </h1>
      <p className=' font-semibold text-text-secondary text-sm'>
        {currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
function TasksByWeeks({ currentDate }) {
  const weekLastDay = useMemo(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 6);
    return newDate;
  }, [currentDate]);

  return (
    <div>
      <h1 className='text-xl font-bold text-text-primary'>
        {currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}{' '}
        -{' '}
        {weekLastDay.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </h1>
      <p className=' font-semibold text-text-secondary text-sm'>
        {currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
function TasksByMonths({ currentDate }) {
  return (
    <div>
      <h1 className=' text-xl  font-bold text-text-primary'>
        {currentDate.toLocaleDateString('en-US', {
          month: 'long',
        })}
      </h1>
      <p className=' font-semibold text-text-secondary text-sm'>
        {currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
function TasksByYears({ currentDate }) {
  return (
    <div>
      <h1 className=' text-xl  font-bold text-text-primary'>{currentDate.getFullYear()}</h1>
    </div>
  );
}
