import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsListLoadingView from '../view/films-list-loading-view.js';

import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove, replace } from '../framework/render.js';
import { sortFilmsByRating, sortFilmsByDate } from '../utils/film.js';
import {FILMS_COUNT_PER_STEP, SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class FilmsPresenter {
  #sortComponent = null;
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #filmsComponent = new FilmsView();
  #filmsListEmptyComponent = new FilmsListEmptyView();
  #filmsListLoadingComponent = new FilmsListLoadingView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    this.#filterType = this.#filterModel.get();
    const films = this.#filmsModel.films;

    const filteredFilms = filter[this.#filterType](films);

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

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (
          this.#filmPresenter.get(updateFilm.id) && !this.#filmDetailsPresenter
        ) {
          this.#filmPresenter.get(updateFilm.id).setFilmEditing();
        }

        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setFilmEditing();
        }

        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (
            this.#filmPresenter.get(updateFilm.id) && !this.#filmDetailsPresenter
          ) {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }

          if (this.#filmDetailsPresenter) {
            this.#filmDetailsPresenter.setAborting({actionType});
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmDetailsPresenter.setCommentCreating();
        try {
          await this.#commentsModel.add(updateType, updateFilm, updateComment);
          this.#filmDetailsPresenter.clearViewData();
        } catch {
          this.#filmDetailsPresenter.setAborting({actionType});
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmDetailsPresenter.setCommentDeleting(updateComment.id);
        try {
          await this.#commentsModel.delete(updateType, updateFilm, updateComment);
        } catch {
          this.#filmDetailsPresenter.setAborting({actionType, commentId: updateComment.id});
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
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#filmsListLoadingComponent);
        this.#renderFilmBoard();
        break;
    }
  };

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#viewActionHandler,
      this.#addFilmDetailsComponent,
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
    document.removeEventListener('keydown', this.#ctrlEnterDownHandler);

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

  #ctrlEnterDownHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };

  #renderFilmDetails = async () => {
    const comments = await this.#commentsModel.get(this.#selectedFilm);

    const isCommentLoadingError = !comments;

    if(!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#viewActionHandler,
        this.#removeFilmDetailsComponent,
        this.#escKeyDownHandler
      );
    }

    if (!isCommentLoadingError) {
      document.addEventListener('keydown', this.#ctrlEnterDownHandler);
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments, isCommentLoadingError);
  };

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

    if (this.films.length > FILMS_COUNT_PER_STEP) {
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
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
  }

  #renderFilmBoard () {
    const films = this.films.slice(0, Math.min(this.films.length, FILMS_COUNT_PER_STEP));

    if (this.#isLoading) {
      render(this.#filmsListLoadingComponent, this.#container);
      return;
    }

    if (!this.#isLoading && this.films.length === 0) {
      this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterType);
      render(this.#filmsListEmptyComponent, this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList(films);
  }

  #clearFilmBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    remove(this.#filmButtonMoreComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
