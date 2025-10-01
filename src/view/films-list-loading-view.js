import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListLoadingTemplate = () =>
  `
    <h2 class="films-list__title">Loading...</h2>
  `;

export default class FilmsListLoadingView extends AbstractView {
  get template() {
    return createFilmsListLoadingTemplate();
  }
}
