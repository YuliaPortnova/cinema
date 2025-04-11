import AbstractView from '../framework/view/abstract-view.js';
import { createFilmCardInfoTemplate } from './film-card-info-template.js';
import { createFilmCardControlsTemplate } from './film-card-controls-template.js';

const createFilmCardTemplate = (film) => {
  const {filmInfo, comments} = film;
  return (
    `<article class="film-card">
      ${createFilmCardInfoTemplate(filmInfo, comments)}
      ${createFilmCardControlsTemplate()}
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setCardClickHandler(callback) {
    this._callback.cardClick = callback;
    this.element.querySelector('a').addEventListener('click', this.#cardClickHandler)
  }

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };
}
