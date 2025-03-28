import { formatStringToDate, formatMinutesToTime } from '../utils.js';

export const createFilmDetailsInfoTemplate = (filmInfo) => {
  const { title, alternativeTitle, totalRating, director, writers, actors, release, runtime, description, genre } = filmInfo;

  const generateGenreTitle = (genres) => {
    const isSingle = (genres.length <= 1);
    return isSingle ? 'Genre' : 'Genres';
  };

  const generateGenresList = (genres) => {
    const genreTemplate = (genreItem) => `<span class="film-details__genre">${genreItem}</span>`;
    return genres.map((genreItem) => genreTemplate(genreItem)).join('');
  };

  return (
    `<div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">Original: ${alternativeTitle}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${totalRating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${writers.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${actors.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${formatStringToDate(release.date)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${formatMinutesToTime(runtime)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${release.releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">${generateGenreTitle(genre)}</td>
          <td class="film-details__cell">
            ${generateGenresList(genre)}
        </tr>
      </table>

      <p class="film-details__film-description">${description}</p>
    </div>`
  );
};
