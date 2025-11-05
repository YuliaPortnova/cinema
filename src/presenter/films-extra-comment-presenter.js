import FilmsListExtraView from '../view/films-list-extra-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';

import FilmPresenter from './film-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render} from '../framework/render.js';
import {sortFilmsByCommentCount} from '../utils/film.js';
import { UserAction, UpdateType, TimeLimit, ExtraFilmListType, FILM_EXTRA_COUNT } from '../const';

export default class FilmsExtraCommentPresenter {
  #filmExtraCommentComponent = new FilmsListExtraView(ExtraFilmListType.COMMENT);
  #filmsListContainerComponent = new FilmsListContainerView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPresenter = new Map();
  #filmCardClickHandler = null;
  #escKeyDownHandler = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filmCardClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filmCardClickHandler = filmCardClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#commentsModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    return [...this.#filmsModel.films]
      .sort(sortFilmsByCommentCount)
      .slice(0, FILM_EXTRA_COUNT);
  }


  init = () => {
    this.#renderExtraCommentBoard();
  };

  #viewActionHandler = async (actionType, updateType, updateFilm) => {
    this.UiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#filmPresenter.get(updateFilm.id)) {
          this.#filmPresenter.get(updateFilm.id).setFilmEditing();
        }
        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (this.#filmPresenter.get(updateFilm.id)) {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if(this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.EXTRA:
        this.#filmPresenter.forEach(((presenter) => presenter.destroy()));
        this.#filmPresenter.clear();

        this.#renderFilmsList(this.films);
        break;
    }
  };

  #renderFilmsListContainer(container) {
    render(this.#filmExtraCommentComponent, container);
    render(this.#filmsListContainerComponent, this.#filmExtraCommentComponent.element);
  }

  #renderFilmsList(films) {
    this.#renderFilms(
      films,
      this.#filmsListContainerComponent
    );
  }

  #renderFilms(films, container) {
    films
      .forEach((film) =>
        this.#renderFilm(film, container)
      );
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#viewActionHandler,
      this.#filmCardClickHandler,
      this.#escKeyDownHandler
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderExtraCommentBoard() {
    const films = this.films;

    if (films.length > 0) {
      this.#renderFilmsListContainer(this.#container);
      this.#renderFilmsList(films);
    }
  }
}
