import AbstractView from '../framework/view/abstract-view.js';
import { ExtraFilmListType } from '../const';

const createFilmsListExptaViewTemplate = (type) =>
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">
       ${type === ExtraFilmListType.COMMENT ? 'Most commented' : 'Top rated'}
      </h2>
    </section>
  `;

export default class FilmsListExtraView extends AbstractView {
  #type = null;

  constructor(type) {
    super();
    this.#type = type;
  }

  get template() {
    return createFilmsListExptaViewTemplate(this.#type);
  }
}
