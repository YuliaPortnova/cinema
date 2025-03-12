import HeaderProfileView from './view/header-profile-view.js';
import { render } from './render.js';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');

render(new HeaderProfileView(), siteHeaderElement);
