const FILMS_COUNT_PER_STEP = 5;

const FILM_EXTRA_COUNT = 2;

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

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

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  EXTRA: 'EXTRA',
  INIT: 'INIT',
};

const Method = {
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const ExtraFilmListType = {
  RATING: 'rating',
  COMMENT: 'comment'
};

export {
  FILMS_COUNT_PER_STEP,
  FILM_EXTRA_COUNT,
  EMOTIONS,
  FilterType,
  FILTER_TYPE_ALL_NAME,
  UserStatusValue,
  UserStatusTitle,
  SortType,
  UserAction,
  UpdateType,
  Method,
  TimeLimit,
  ExtraFilmListType
};
