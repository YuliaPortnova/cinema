import HeaderProfileView from './view/header-profile-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';

import { render } from './render.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(new HeaderProfileView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new FooterStatisticsView(), footerStatisticsElement);
