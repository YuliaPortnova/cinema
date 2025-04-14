import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (filmsCount = 0) =>
  `
    <p>${filmsCount} movies inside</p>
  `;

export default class FooterStatisticsView extends AbstractView {
  #filmsCount = null;

  constructor (filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmsCount);
  }
}
