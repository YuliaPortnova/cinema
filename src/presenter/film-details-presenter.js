import FilmDetailsView from '../view/film-details-view';
import { render, replace, remove } from '../framework/render';

export default class FilmDetailsPresenter {
  #container = null;

  #changeData;
  #closeBtnClickHandler = null;
  #escKeyDownHandler = null;

  #filmDetailsComponent = null;

  #film = null;
  #comments = null;

  #viewData = {
    emotion: null,
    comment: null,
    scrollPosition: 0
  };

  constructor (container, changeData, closeBtnClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#closeBtnClickHandler = closeBtnClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init (film, comments) {
    this.#film = film;
    this.#comments = comments;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;
    this.#filmDetailsComponent = new FilmDetailsView(
      this.#film,
      this.#comments,
      this.#viewData,
      this.#updateViewData
    );

    this.#filmDetailsComponent.setCloseButtonClickHandler(() => {
      this.#closeBtnClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#filmDetailsComponent.setWatchlistBtnClickHandler(this.#watchlistBtnClickHandler);
    this.#filmDetailsComponent.setWatchedBtnClickHandler(this.#watchedBtnClickHandler);
    this.#filmDetailsComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler);

    if (prevFilmDetailsComponent === null) {
      render(this.#filmDetailsComponent, this.#container);
      return;
    }

    replace(this.#filmDetailsComponent, prevFilmDetailsComponent);

    this.#filmDetailsComponent.setScrollPosition();

    remove(prevFilmDetailsComponent);
  }

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
  };

  #watchlistBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      },
    });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      },
    });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      },
    });
  };
}
