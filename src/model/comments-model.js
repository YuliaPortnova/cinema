import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get = async (film) => {
    this.#comments = await this.#apiService.get(film);
    return this.#comments;
  };

  add = (updateType, update) => {
    this.#comments.push(update);
    this._notify(updateType, update);
  };

  delete = (updateType, update) => {
    const index = this.#comments.findIndex(
      (comment) => comment.id === update.id
    );

    if (index === -1) {
      throw new ErrorEvent('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
