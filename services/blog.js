import { blogAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetchs posts from wordpress API.
 *
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 * @returns {Object[]} array of parsed posts.
 */
export const fetchPosts = (params = {}, headers = {}) => {
  logger.info('fetches posts from blog');

  return blogAPI.get('/posts', {
    headers: { ...headers },
    params: { ...params }
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        logger.error('Error fetching posts from blog:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      return data;
    })
    .catch(({ response }) => {
      const { data } = response;
      const {
        message,
        data: { status }
      } = data;

      logger.error(`Error fetching posts from blog: ${status}: ${message}`);
      throw new Error(`Error fetching posts from blog: ${status}: ${message}`);
    });
};

export default { fetchPosts };
