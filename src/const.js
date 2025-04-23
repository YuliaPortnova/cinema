const FILMS_COUNT_PER_STEP = 5;

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const FILTER_TYPE_ALL_NAME = 'All movies';

const UserStatusValue = {
  NOVICE: 0,
  FUN: 10,
  MOVIE_BUFF: 20,
};

const UserStatusTitle = {
  NOVICE: 'novice',
  FUN: 'fan',
  MOVIE_BUFF: 'movie buff',
};

export {
  FILMS_COUNT_PER_STEP,
  FilterType,
  FILTER_TYPE_ALL_NAME,
  UserStatusValue,
  UserStatusTitle
};
