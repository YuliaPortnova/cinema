import { createElement } from '../render.js';

const createButtonMoreTemplate = () =>
  `
    <button class="films-list__show-more">Show more</button>
  `;

export default class ButtonMoreView {
  getTemplate() {
    return createButtonMoreTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
