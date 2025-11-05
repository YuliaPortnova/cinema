import FilmsPresenter from './films-presenter.js';
import FilmsExtraCommentPresenter from './films-extra-comment-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsListLoadingView from '../view/films-list-loading-view.js';


import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType, TimeLimit } from '../const.js';

export default class MainPresenter {
  #filmsListEmptyComponent = new FilmsListEmptyView();
  #filmsListLoadingComponent = new FilmsListLoadingView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #filmsPresenter = null;
  #filmsExtraCommentPresenter = null;
  #filmDetailsPresenter = null;

  #selectedFilm = null;
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

  init() {
    this.#renderMainBoard();
  }

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setFilmEditing();
        }
        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
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
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#renderMainBoard();
        break;
    }
  };

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

  #renderMainBoard () {
    if (this.#isLoading) {
      render(this.#filmsListLoadingComponent, this.#container);
      return;
    }

    remove(this.#filmsListLoadingComponent);

    if (this.#filmsModel.films.length === 0) {
      render(this.#filmsListEmptyComponent, this.#container);
      return;
    }

    remove(this.#filmsListEmptyComponent);

    this.#filmsPresenter = new FilmsPresenter(
      this.#container,
      this.#filmsModel,
      this.#filterModel,
      this.#addFilmDetailsComponent,
      this.#escKeyDownHandler
    );
    this.#filmsPresenter.init();

    this.#filmsExtraCommentPresenter = new FilmsExtraCommentPresenter(
      this.#filmsPresenter.getFilmsContainer(),
      this.#filmsModel,
      this.#commentsModel,
      this.#addFilmDetailsComponent,
      this.#escKeyDownHandler
    );
    this.#filmsExtraCommentPresenter.init();
  }
}
