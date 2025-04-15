import HeaderProfileView from './view/header-profile-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

import { render } from './framework/render.js';
import { getUserStatus } from './utils/user.js';
import { generateFilter } from './mock/filter.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

const userStatus = getUserStatus(filmsModel.films);
const filters = generateFilter(filmsModel.films);
const filmsCount = filmsModel.films.length;

render(new HeaderProfileView(userStatus), siteHeaderElement);
render(new FilterView(filters), siteMainElement);
render(new FooterStatisticsView(filmsCount), footerStatisticsElement);

filmsPresenter.init();
