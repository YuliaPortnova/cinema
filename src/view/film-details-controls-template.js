export const createFilmDetailsControlsTemplate = ({watchlist, alreadyWatched, favorite}) =>
  `
    <section class="film-details__controls">
      <button
        type="button"
        class="
          film-details__control-button
          ${watchlist ? 'film-details__control-button--active' : ''}
          film-details__control-button--watchlist
        "
        id="watchlist"
        name="watchlist"
      >
        Add to watchlist
      </button>
      <button
        type="button"
        class="
          film-details__control-button
          ${alreadyWatched ? 'film-details__control-button--active' : ''}
          film-details__control-button--watched
        "
        id="watched"
        name="watched"
      >
        Already watched
      </button>
      <button
        type="button"
        class="
          film-details__control-button
          ${favorite ? 'film-details__control-button--active' : ''}
          film-details__control-button--favorite
        "
        id="favorite"
        name="favorite"
      >
        Add to favorites
      </button>
    </section>
  `;
