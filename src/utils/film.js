const formatStringToDateWithTime = (date) => new Date(date).toLocaleString('en-GB');

const formatStringToDate = (date) => new Date(date).toLocaleString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'});

const formatStringToYear = (date) => new Date(date).getFullYear();

const formatMinutesToTime = (minutes) => {
  const MINUTES_PER_HOUR = 60;
  const time = (minutes > MINUTES_PER_HOUR) ? `${Math.floor(minutes / MINUTES_PER_HOUR)}h ${minutes % MINUTES_PER_HOUR}m` : `${minutes}m`;
  return time;
};

export {formatStringToDate, formatMinutesToTime, formatStringToDateWithTime, formatStringToYear};
