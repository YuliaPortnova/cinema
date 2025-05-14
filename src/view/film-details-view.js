import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createFilmDetailsInfoTemplate } from './film-details-info-template.js';
import { createFilmDetailsControlsTemplate } from './film-details-controls-template.js';
import { createFilmDetailsCommentsTemplate } from './film-details-comments-template.js';
import { createFilmDetailsFormTemplate } from './film-details-form-template.js';

const createFilmDetailsTemplate = ({filmInfo, userDetails, comments, checkedEmotion, comment}) => {
  const { poster, ageRating } = filmInfo;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${poster} alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            ${createFilmDetailsInfoTemplate(filmInfo)}
          </div>

          ${createFilmDetailsControlsTemplate(userDetails)}
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            ${createFilmDetailsCommentsTemplate(comments)}

            ${createFilmDetailsFormTemplate(checkedEmotion, comment)}
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsView extends AbstractStatefulView {
  constructor (film, comments, viewData, updateViewData) {
    super();
    this._state = FilmDetailsView.transformFilmToState(
      film,
      comments,
      viewData.emotion,
      viewData.comment,
      viewData.scrollPosition
    );
    this.updateViewData = updateViewData;
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setScrollPosition();
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchlistBtnClickHandler(this._callback.watchlistBtnClick);
    this.setWatchedBtnClickHandler(this._callback.watchedBtnClick);
    this.setFavoriteBtnClickHandler(this._callback.favoriteBtnClick);
  };

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollPosition;
  };

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  setWatchlistBtnClickHandler(callback) {
    this._callback.watchlistBtnClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistBtnClickHandler);
  }

  setWatchedBtnClickHandler(callback) {
    this._callback.watchedBtnClick = callback;
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedBtnClickHandler);
  }

  setFavoriteBtnClickHandler(callback) {
    this._callback.favoriteBtnClick = callback;
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteBtnClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  #watchlistBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchlistBtnClick();
  };

  #watchedBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchedBtnClick();
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.favoriteBtnClick();
  };

  static transformFilmToState = (
    film,
    comments,
    checkedEmotion = null,
    comment = null,
    scrollPosition = 0
  ) => ({
    ...film,
    comments,
    checkedEmotion,
    comment,
    scrollPosition
  });

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedEmotion: evt.currentTarget.dataset.emotionType,
      scrollPosition: this.element.scrollTop
    });
  };

  #commentInputChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({comment: evt.target.value});
  };

  #updateViewData = () => {
    this.updateViewData({
      emotion: this._state.checkedEmotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop
    });
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-label')
      .forEach((element) => {
        element.addEventListener('click', this.#emotionClickHandler);
      });
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputChangeHandler);
  };
}
