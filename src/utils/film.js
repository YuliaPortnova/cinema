const formatStringToDateWithTime = (date) => new Date(date).toLocaleString('en-GB');

const formatStringToDate = (date) => new Date(date).toLocaleString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'});

const formatStringToYear = (date) => new Date(date).getFullYear();

const formatMinutesToTime = (minutes) => {
  const MINUTES_PER_HOUR = 60;
  const time = (minutes > MINUTES_PER_HOUR) ? `${Math.floor(minutes / MINUTES_PER_HOUR)}h ${minutes % MINUTES_PER_HOUR}m` : `${minutes}m`;
  return time;
};

const sortFilmsByDate = (filmA, filmB) =>
  new Date(filmB.filmInfo.release.date) - new Date(filmA.filmInfo.release.date);

const sortFilmsByRating = (filmA, filmB) =>
  filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {formatStringToDate, formatMinutesToTime, formatStringToDateWithTime, formatStringToYear, sortFilmsByDate, sortFilmsByRating};
