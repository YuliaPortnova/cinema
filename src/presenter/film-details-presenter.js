import FilmDetailsView from '../view/film-details-view';
import { render, replace, remove } from '../framework/render';

export default class FilmDetailsPresenter {
  #container = null;

  #closeBtnClickHandler = null;
  #escKeyDownHandler = null;

  #filmDetailsComponent = null;

  #film = null;
  #comments = null;

  constructor (container, closeBtnClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#closeBtnClickHandler = closeBtnClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init (film, comments) {
    this.#film = film;
    this.#comments = comments;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;
    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#comments);

    this.#filmDetailsComponent.setCloseButtonClickHandler(() => {
      this.#closeBtnClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    if (prevFilmDetailsComponent === null) {
      render(this.#filmDetailsComponent, this.#container);
      return;
    }

    replace(this.#filmDetailsComponent, prevFilmDetailsComponent);

    remove(prevFilmDetailsComponent);
  }

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };
}
