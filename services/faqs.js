import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export const fetchFaqs = (params = {}, headers = {}) => {
  logger.info('Fetch all data - faqs');
  return WRIAPI.get(
    'faq',
    {
      params: {
        ...params,
        published: 'all',
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS
      },
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faqs: ${status}: ${statusText}`);
      throw new Error(`Error fetching faqs: ${status}: ${statusText}`);
    });
};

export const fetchFaq = (id, params = {}, headers = {}) => {
  logger.info(`Fetch faq data - ${id}`);
  return WRIAPI.get(
    `faq/${id}`,
    {
      params: {
        ...params,
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS
      },
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faq: ${status}: ${statusText}`);
      throw new Error(`Error fetching faq: ${status}: ${statusText}`);
    });
};

export const deleteFaq = (id, token, headers = {}) => {
  logger.info(`Delete faq data - ${id}`);
  return WRIAPI.delete(
    `faq/${id}`,
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
        Authorization: token
      }
    }
  )
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting faq: ${status}: ${statusText}`);
      throw new Error(`Error deleting faq: ${status}: ${statusText}`);
    });
};
export const updateFaq = (id, body, token, headers = {}) => {
  logger.info(`Updating faq data - ${id}`);
  return WRIAPI.patch(
    `faq/${id}`,
    { ...body },
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
        Authorization: token
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating faq: ${status}: ${statusText}`);
      throw new Error(`Error updating faq: ${status}: ${statusText}`);
    });
};

export const createFaq = (body, token, headers = {}) => {
  logger.info('Creating faq data');
  return WRIAPI.post(
    'faq',
    { ...body },
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
        Authorization: token
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating faq: ${status}: ${statusText}`);
      throw new Error(`Error creating faq: ${status}: ${statusText}`);
    });
};

export const updateFaqOrder = (order, token, headers = {}) => WRIAPI.post(
  'faq/reorder',
  { ...order },
  {
    headers: {
      ...headers,
      Authorization: token
    }
  }
)
  .then(response => WRISerializer(response.data))
  .catch(({ response }) => {
    const { status, statusText } = response;
    logger.error(`Error updating faq order: ${status}: ${statusText}`);
    throw new Error(`Error updating faq order: ${status}: ${statusText}`);
  });
