import FilmDetailsView from '../view/film-details-view';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction } from '../const';
import { nanoid } from 'nanoid';

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
    this.#filmDetailsComponent.setCommentDeleteClickHandler(this.#commmentDeleteClickHandler);

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

  clearViewData = () => {
    this.#updateViewData({
      comment: null,
      emotion: null,
      scrollPosition: this.#viewData.scrollPosition
    });
  };

  createComment = () => {
    this.#filmDetailsComponent.setCommentData();

    const {emotion, comment} = this.#viewData;

    if (emotion && comment) {
      const newCommentId = nanoid();

      const createdComment = {
        id: newCommentId,
        author: 'Yulia',
        date: new Date(),
        emotion,
        comment
      };

      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          ...this.#film,
          comments: [
            ...this.#film.comments,
            newCommentId
          ]
        },
        createdComment
      );
    }
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
  };

  #watchlistBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        },
      });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        },
      });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        },
      });
  };

  #commmentDeleteClickHandler = (commentId) => {
    const filmCommentIdIndex = this.#film.comments
      .findIndex((filmCommentId) => filmCommentId === commentId);

    const deletedComment = this.#comments
      .find((comment) => comment.id === commentId);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        ...this.#film,
        comments: [
          ...this.#film.comments.slice(0, filmCommentIdIndex),
          ...this.#film.comments.slice(filmCommentIdIndex + 1)
        ]
      },
      deletedComment
    );
  };
}
