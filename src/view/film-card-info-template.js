import { formatStringToYear } from '../utils/film.js';

export const createFilmCardInfoTemplate = (filmInfo, comments) => {
  const { title, totalRating, release, description, poster, genre, runtime} = filmInfo;
  return (
    `<a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatStringToYear(release.date)}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>`
  );
};
