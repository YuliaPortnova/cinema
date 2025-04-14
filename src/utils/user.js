import { UserStatusValue, UserStatusTitle } from '../const.js';

const getUserStatus = (films) => {
  const watchedFilmCount = films.filter((film) =>
    film.userDetails.alreadyWatched
  ).length;

  if ((watchedFilmCount > UserStatusValue.NOVICE) && (watchedFilmCount <= UserStatusValue.FUN)) {
    return UserStatusTitle.NOVICE;
  }

  if ((watchedFilmCount > UserStatusValue.FUN) && (watchedFilmCount <= UserStatusValue.MOVIE_BUFF)) {
    return UserStatusTitle.FUN;
  }

  if (watchedFilmCount > UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.MOVIE_BUFF;
  }

  return '';
};

export { getUserStatus };
