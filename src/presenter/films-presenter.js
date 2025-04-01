import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';

import { render } from '../render.js';

export default class FilmsPresenter {
  filmButtonMoreComponent = new FilmButtonMoreView();
  filmsListContainerComponent = new FilmsListContainerView();
  filmsListComponent = new FilmsListView();
  filmsComponent = new FilmsView();
  sortComponent = new SortView();

  init(container, filmsModel, commentsModel) {
    this.container = container;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;

    this.films = [...filmsModel.getFilms()];

    render(this.sortComponent, this.container);
    render(this.filmsComponent, this.container);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), this.filmsListContainerComponent.getElement());
    }

    render(this.filmButtonMoreComponent, this.filmsListComponent.getElement());

    const comments = [...this.commentsModel.get(this.films[0])];

    render(new FilmDetailsView(this.films[0], comments), this.container.parentElement);
  }
}
