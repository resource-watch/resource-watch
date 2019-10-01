import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Retrieve all collections of the user
 * @param {*} token User's token
 * @param {*} params Request optional parameters
 */
export const fetchAllCollections = (
  token,
  params = {
    env: process.env.API_ENV,
    application: process.env.APPLICATIONS
  }
) => {
  logger.info('Fetch all collections');
  return WRIAPI.get('collection', {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1
    },
    params
  })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching all collections: ${status}: ${statusText}`);
      throw new Error(`Error fetching all collections: ${status}: ${statusText}`);
    });
};
/**
 * Retrieve data of a specific collection
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection we are asking for.
 * @param {*} params Request parameters
 */
export const fetchCollection = (
  token,
  collectionId,
  params = {
    env: process.env.API_ENV,
    application: process.env.APPLICATIONS
  }
) => {
  logger.info(`Fetch collection ${collectionId}`);
  return WRIAPI.get(`collection/${collectionId}`, {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1
    },
    params
  })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(`Error fetching collection ${collectionId}: ${status}: ${statusText}`);
    });
};

/**
 * Creates a new collection attached to the current user
 * @param {*} token User's token
 * @param {*} data collection data
 */
export const createCollection = (token, data = {}) => {
  logger.info('Create collection');
  return WRIAPI.post(`${process.env.WRI_API_URL}/collection`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating collection: ${status}: ${statusText}`);
      throw new Error(`Error creating collection: ${status}: ${statusText}`);
    });
};

/**
 * Deletes an existing collection attached to the current user
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be removed
 */
export const deleteCollection = (token, collectionId) => {
  logger.info(`Delete collection ${collectionId}`);
  return WRIAPI.delete(`collection/${collectionId}`, { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting collection ${collectionId}: ${status}: ${statusText}`);
    });
};

/**
 * Update an existing collection attached to the current user
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be edited
 * @param {*} data Data to be updated
 */
export const updateCollection = (token, collectionId, data) => {
  logger.info(`Update collection ${collectionId}`);
  return WRIAPI.patch(`collection/${collectionId}`, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: token
    }
  })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(`Error updating collection ${collectionId}: ${status}: ${statusText}`);
    });
};

/* Resources management  */

/**
 *
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be edited
 * @param {*} resource Resource to be addded to the collection
 */
export const addResourceToCollection = (token, collectionId, resource = []) => {
  logger.info(`Add resource to collection ${collectionId}`);
  return WRIAPI.post(
    `collection/${collectionId}/resource`,
    { ...resource },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error adding resource to collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(
        `Error adding resource to collection ${collectionId}: ${status}: ${statusText}`
      );
    });
};

/**
 *
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be edited
 * @param {*} resource Resource to be removed from the collection
 */
export const removeResourceFromCollection = (token, collectionId, resource = []) => {
  logger.info(`Remove resource from collection ${collectionId}`);
  const { type, id } = resource;
  return WRIAPI.delete(`collection/${collectionId}/resource/${type}/${id}`, { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(
        `Error removing resource from collection ${collectionId}: ${status}: ${statusText}`
      );
      throw new Error(
        `Error removing resource from collection ${collectionId}: ${status}: ${statusText}`
      );
    });
};

export default {
  fetchAllCollections,
  fetchCollection,
  createCollection,
  deleteCollection,
  updateCollection,
  addResourceToCollection,
  removeResourceFromCollection
};
