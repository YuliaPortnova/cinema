import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';

import { render, remove } from '../framework/render.js';
import FilmsListEmptyView from '../view/films-list-empty.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #filmsComponent = new FilmsView();
  #sortComponent = new SortView();

  #filmDetailsComponent = null;
  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];

    this.#renderFilmBoard();
  }

  #renderFilm(film, container) {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.setCardClickHandler(() => {
      this.#addFilmDetailsComponent(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });
    render(filmCardComponent, container.element);
  }

  #renderFilmDetails(film) {
    const comments = [...this.#commentsModel.get(film)];
    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    this.#filmDetailsComponent.setCloseButtonClickHandler(() => {
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    render(this.#filmDetailsComponent, this.#container.parentElement);
  }

  #addFilmDetailsComponent = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    remove(this.#filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onFilmButtonMoreClick = () => {
    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => {
        this.#renderFilm(film, this.#filmsListContainerComponent);
      });

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#filmButtonMoreComponent);
    }
  };

  #renderFilmBoard () {
    if (this.#films.length === 0) {
      render(new FilmsListEmptyView(), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerComponent);
    }

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#filmButtonMoreComponent, this.#filmsListComponent.element);

      this.#filmButtonMoreComponent.setButtonClickHanler(() => this.#onFilmButtonMoreClick());
    }

  }
}
