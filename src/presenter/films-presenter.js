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

  init(container, filmsModel) {
    this.container = container;
    this.filmsModel = filmsModel;

    this.films = [...filmsModel.getFilms()];

    render(this.sortComponent, this.container);
    render(this.filmsComponent, this.container);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListContainerComponent.getElement());
    }

    render(this.filmButtonMoreComponent, this.filmsListComponent.getElement());
    render(new FilmDetailsView(), this.container.parentElement);
  }
}
