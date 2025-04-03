import { getRandomValue } from '../utils.js';
import { emotions, comment } from './const.js';

const generateComment = () => (
  {
    author: 'Ilya O\'Reilly',
    comment,
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomValue(emotions)
  }
);

const getCommentCount = (films) => films.reduce(
  (count, film) => count + film.comments.length, 0
);

const generateComments = (films) => {
  const commentCount = getCommentCount(films);

  return Array.from({length: commentCount}, (_value, index) => {
    const commentItem = generateComment();

    return {
      id: String(index + 1),
      ...commentItem,
    };
  });
};

export { generateComments };
