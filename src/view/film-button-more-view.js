import { createElement } from '../render.js';

const createButtonMoreTemplate = () =>
  `
    <button class="films-list__show-more">Show more</button>
  `;

export default class ButtonMoreView {
  #element = null;

  get template() {
    return createButtonMoreTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
