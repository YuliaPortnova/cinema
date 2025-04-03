import { createElement } from '../render.js';
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

export default class FilmCardView {
  #film = null;
  #element = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
