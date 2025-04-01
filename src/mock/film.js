import { getRandomInteger, getRandomValue } from '../utils.js';
import { nanoid } from 'nanoid';
import { Rating, AgeRating, Runtime, directors, writers, actors, titles, posters, genres, description, countries, MAX_COMMENTS_ON_FILM, MOVIES_COUNT } from './const.js';

let totalCommentsCount = 0;

const generateFilm = () => {
  const hasComments = getRandomInteger(0, 1);

  const filmCommentsCount = hasComments
    ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
    : 0;

  totalCommentsCount += filmCommentsCount;

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
        date: new Date(2021, 0, 1),
        releaseCountry: getRandomValue(countries)
      },
      runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
      genre: genres.slice(0, getRandomInteger(1, genres.length)),
      description
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: true,
      watchingDate: new Date(2025, 0, 1),
      favorite: false
    }
  });
};

export const generateFilms = () => Array.from({length: MOVIES_COUNT}, generateFilm);
