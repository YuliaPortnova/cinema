import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPE_ALL_NAME, FilterType} from '../const.js';

const createFilterItemTemplate = ({name, count}, isActive) => {
  const getFilterName = (filterName) =>
    (filterName === FilterType.ALL)
      ? FILTER_TYPE_ALL_NAME
      : `${filterName.charAt(0).toUpperCase()}${filterName.slice(1)}`;

  const getCount = (filterName) =>
    (filterName === FilterType.ALL)
      ? ''
      : `<span class="main-navigation__item-count">${count}</span>`;

  return `
    <a
      href="#${name}"
      class="main-navigation__item"
      ${isActive ? 'main-navigation__item--active' : ''}
    >
      ${getFilterName(name)}
      ${getCount(name)}
    </a>
  `;
};


const createFilterTemplate = (filters) => {
  const filterItems = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `
    <nav class="main-navigation">
      ${filterItems}
    </nav>
    `;
};
export default class FilterView extends AbstractView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
