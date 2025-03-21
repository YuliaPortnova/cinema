export const createFilmCardInfoTemplate = () =>
  `
    <a class="film-card__link">
      <h3 class="film-card__title">Popeye the Sailor Meets Sindbad the Sailor</h3>
      <p class="film-card__rating">6.3</p>
      <p class="film-card__info">
        <span class="film-card__year">1936</span>
        <span class="film-card__duration">16m</span>
        <span class="film-card__genre">Cartoon</span>
      </p>
      <img src="./images/posters/popeye-meets-sinbad.png" alt="" class="film-card__poster">
      <p class="film-card__description">In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…</p>
      <span class="film-card__comments">0 comments</span>
    </a>
  `;
