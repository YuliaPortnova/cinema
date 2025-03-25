import { generateFilm } from '../mock/film.js';

const MOVIES_COUNT = 20;

export default class FilmsModel {
  #films = Array.from({length: MOVIES_COUNT}, generateFilm);

  getFilms = () => this.#films;
}
