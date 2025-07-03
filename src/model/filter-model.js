import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter () {
    return this.#filter;
  }

  set = (updateType, update) => {
    this.#filter = update;
    this._notify(updateType);
  };
}
