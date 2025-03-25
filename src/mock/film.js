import { getRandomInteger, getRandomValue } from '../utils.js';
import { nanoid } from 'nanoid';
import { Rating, AgeRating, Runtime, directors, writers, actors, titles, posters, genres, description, countries,
} from './const.js';

export const generateFilm = () => (
  {
    id: nanoid(),
    comments: [],
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
  }
);
