import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';
import FilmsListEmptyView from '../view/films-list-empty.js';

import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import { render, remove } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import {FILMS_COUNT_PER_STEP} from '../const.js';
export default class FilmsPresenter {
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #filmsComponent = new FilmsView();
  #sortComponent = new SortView();
  #filmsListEmptyComponent = new FilmsListEmptyView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #films = [];

  #selectedFilm = null;
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

  #filmChangeHandler = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);

    if (this.#filmDetailsPresenter && this.#selectedFilm.id === updatedFilm.id) {
      this.#selectedFilm = updatedFilm;
      this.#renderFilmDetails();
    }
  };

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#filmChangeHandler,
      this.#addFilmDetailsComponent,
      this.#escKeyDownHandler
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms(from, to, container) {
    this.#films
      .slice(from, to)
      .forEach((film) => {
        this.#renderFilm(film, container);
      });
  }

  #addFilmDetailsComponent = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetailsComponent();
    }

    this.#selectedFilm = film;
    this.#renderFilmDetails();

    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #renderFilmDetails() {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if(!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#filmChangeHandler,
        this.#removeFilmDetailsComponent,
        this.#escKeyDownHandler
      );
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  }

  #filmButtonMoreClickHandler = () => {
    this.#renderFilms(
      this.#renderedFilmsCount,
      this.#renderedFilmsCount + FILMS_COUNT_PER_STEP,
      this.#filmsListContainerComponent
    );

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#filmButtonMoreComponent);
    }
  };

  #renderSort = (container) => {
    render(this.#sortComponent, container);
  };

  #renderFilmButtonMore(container) {
    render(this.#filmButtonMoreComponent, container);

    this.#filmButtonMoreComponent.setButtonClickHanler(() => this.#filmButtonMoreClickHandler());
  }

  #renderFilmList() {
    this.#renderFilms(
      0,
      Math.min(this.#films.length, FILMS_COUNT_PER_STEP),
      this.#filmsListContainerComponent
    );

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      this.#renderFilmButtonMore(this.#filmsListComponent.element);
    }
  }

  #renderFilmListContainer(container) {
    render(this.#filmsComponent, container);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
  }

  #renderFilmBoard () {
    if (this.#films.length === 0) {
      render(this.#filmsListEmptyComponent, this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList();
  }
}
