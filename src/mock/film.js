import { getRandomInteger, getRandomValue } from '../utils/common.js';
import { nanoid } from 'nanoid';
import { Rating, AgeRating, Runtime, directors, writers, actors, titles, posters, genres, description, countries, MAX_COMMENTS_ON_FILM, MOVIES_COUNT } from './const.js';

let totalCommentsCount = 0;

const generateFilm = () => {
  const hasComments = getRandomInteger(0, 1);

  const filmCommentsCount = hasComments
    ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
    : 0;

  totalCommentsCount += filmCommentsCount;
  const alreadyWatched = Boolean(getRandomInteger(0, 1));

  const getDate = () => {
    const date = new Date();
    date.setFullYear(
      date.getFullYear() - getRandomInteger(1, 20)
    );

    return date.toISOString();
  };

  return ({
    id: nanoid(),
    comments: (hasComments)
      ? Array.from({length: filmCommentsCount}, (_value, commentIndex) => String(totalCommentsCount - commentIndex)
      )
      : [],
    filmInfo: {
      title: getRandomValue(titles),
      alternativeTitle: getRandomValue(titles),
      totalRating: getRandomInteger(Rating.MIN, Rating.MAX),
      poster: getRandomValue(posters),
      ageRating: getRandomInteger(AgeRating.MIN, AgeRating.MAX),
      director: getRandomValue(directors),
      writers: writers.slice(0, getRandomInteger(1, writers.length)),
      actors: actors.slice(0, getRandomInteger(1, actors.length)),
      release: {
        date: getDate(),
        releaseCountry: getRandomValue(countries)
      },
      runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
      genre: genres.slice(0, getRandomInteger(1, genres.length)),
      description
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched,
      watchingDate: (alreadyWatched) ? new Date(2025, 0, 1) : null,
      favorite: Boolean(getRandomInteger(0, 1))
    }
  });
};

export const generateFilms = () => Array.from({length: MOVIES_COUNT}, generateFilm);
