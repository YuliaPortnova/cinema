import AbstractView from '../framework/view/abstract-view.js';

const createButtonMoreTemplate = () =>
  `
    <button class="films-list__show-more">Show more</button>
  `;

export default class ButtonMoreView extends AbstractView {
  get template() {
    return createButtonMoreTemplate();
  }

  setButtonClickHanler(callback) {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonClick();
  };
}
