import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';

import FilmPresenter from './film-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import { sortFilmsByRating, sortFilmsByDate } from '../utils/film.js';
import {FILMS_COUNT_PER_STEP, SortType, UserAction, UpdateType, FilterType, TimeLimit} from '../const.js';
import {filter} from '../utils/filter.js';
export default class FilmsPresenter {
  #sortComponent = null;
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #filmsComponent = new FilmsView();

  #container = null;
  #filmsModel = null;
  #filterModel = null;

  #filmPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmCardClickHandler = null;
  #escKeyDownHandler = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, filterModel, filmCardClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#filmCardClickHandler = filmCardClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    const filterType = this.#filterModel.get();
    const films = this.#filmsModel.films;

    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }
    return filteredFilms;
  }

  init() {
    this.#renderFilmBoard();
  }

  getFilmsContainer = () => this.#filmsComponent.element;

  #viewActionHandler = async (actionType, updateType, updateFilm) => {
    this.#uiBlocker.block();

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
        if (this.#filterModel.get() !== FilterType.ALL) {
          this.#modelEventHandler(UpdateType.MINOR);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderFilmBoard();
        break;
    }
  };

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

  #renderFilms(films, container) {
    films
      .forEach((film) => {
        this.#renderFilm(film, container);
      });
  }

  #filmButtonMoreClickHandler () {
    const filmsCount = this.films.length;

    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);

    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);
    this.#renderFilms(films, this.#filmsListContainerComponent);

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.films.length) {
      remove(this.#filmButtonMoreComponent);
    }
  }

  #sortTypeChangeHandle = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const films = this.films.slice(0, Math.min(this.films.length, FILMS_COUNT_PER_STEP));
    this.#clearFilmsList();
    this.#renderSort(this.#container);
    this.#renderFilmList(films);
  };

  #renderSort = (container) => {
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }

    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandle);
  };

  #renderFilmButtonMore(container) {
    render(this.#filmButtonMoreComponent, container);

    this.#filmButtonMoreComponent.setButtonClickHanler(() => this.#filmButtonMoreClickHandler());
  }

  #renderFilmList(films) {
    this.#renderFilms(
      films,
      this.#filmsListContainerComponent
    );

    if (this.films.length > this.#renderedFilmsCount) {
      this.#renderFilmButtonMore(this.#filmsListComponent.element);
    }
  }

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#filmButtonMoreComponent);
  };

  #renderFilmListContainer(container) {
    render(this.#filmsComponent, container);
    render(this.#filmsListComponent, this.#filmsComponent.element, RenderPosition.BEFOREBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
  }

  #renderFilmBoard () {
    const films = this.films.slice(0, Math.min(this.films.length, this.#renderedFilmsCount));

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList(films);
  }

  #clearFilmBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#filmButtonMoreComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
