import AbstractView from '../framework/view/abstract-view.js';
import { createFilmDetailsInfoTemplate } from './film-details-info-template.js';
import { createFilmDetailsControlsTemplate } from './film-details-controls-template.js';
import { createFilmDetailsCommentsTemplate } from './film-details-comments-template.js';
import { createFilmDetailsFormTemplate } from './film-details-form-template.js';

const createFilmDetailsTemplate = (film, comments) => {
  const { filmInfo } = film;
  const { poster } = filmInfo;

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

              <p class="film-details__age">18+</p>
            </div>

            ${createFilmDetailsInfoTemplate(filmInfo)}
          </div>

          ${createFilmDetailsControlsTemplate()}
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            ${createFilmDetailsCommentsTemplate(comments)}

            ${createFilmDetailsFormTemplate()}
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsView extends AbstractView {
  #film = null;
  #comments = null;

  constructor (film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };
}
