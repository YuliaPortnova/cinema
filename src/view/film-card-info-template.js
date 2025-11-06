import { formatStringToYear, formatMinutesToTime } from '../utils/film.js';
import { DESCRIPTION_LENGTH } from '../const.js';

export const createFilmCardInfoTemplate = (filmInfo, comments) => {
  const { title, totalRating, release, description, poster, genre, runtime} = filmInfo;
  // const croppedDescription = description.length > DESCRIPTION_LENGTH ? description : description.substring(0, 40);
  const shortDescription = (description.length <= DESCRIPTION_LENGTH) ? description : `${description.substring(0, DESCRIPTION_LENGTH - 1)}…`;
  return (
    `<a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatStringToYear(release.date)}</span>
        <span class="film-card__duration">${formatMinutesToTime(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>`
  );
};
