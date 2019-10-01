
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Retrieve all collections of the user
 * @param {*} params Request optional parameters
 * @param {*} token User's token
 */
export const fetchAllCollections = (token, params = {
    env: process.env.API_ENV,
    application: process.env.APPLICATIONS
  }) => {
  logger.info('Fetch all collections');
  WRIAPI.get('collection',
    {
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
 */
export const fetchCollection = (token, collectionId, params = {
    env: process.env.API_ENV,
    application: process.env.APPLICATIONS
  }) => {
  logger.info(`Fetch collection ${collectionId}`);
  return WRIAPI.get(`collection/${collectionId}`,
    {
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
}

/**
 * Creates a new collection attached to the current user
 * @param {*} token User's token
 * @param {*} name Name of the new collection
 * @param {*} resources List of resources attached to the new collection (optional)
 */
export const createCollection = (token, params = {}) => {
  logger.info('Create collection');
  return new Promise((resolve, reject) => {
    fetch(`${process.env.WRI_API_URL}/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV,
        name,
        resources
      })
    })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating collection: ${status}: ${statusText}`);
      throw new Error(`Error creating collection: ${status}: ${statusText}`);
    });
  });
}

/**
 * Deletes an existing collection attached to the current user
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be removed
 */
static deleteCollection(token, collectionId) {
  return new Promise((resolve, reject) => {
    fetch(`${process.env.WRI_API_URL}/collection/${collectionId}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    })
      .then((response) => {
        const { status, statusText } = response;

        if (status === 200) return resolve();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(data => resolve(data))
      .catch((errors) => { reject(errors); });
  });
}

/**
 * Edits an existing collection attached to the current user
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be edited
 * @param {*} name New name of the existing collection
 */
static updateCollection(token, collectionId, name) {
  return new Promise((resolve, reject) => {
    fetch(`${process.env.WRI_API_URL}/collection/${collectionId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        name
      })
    })
      .then((response) => {
        const { status, statusText } = response;

        if (status === 200) return resolve();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(data => resolve(data))
      .catch((errors) => { reject(errors); });
  });
}

/* Resources management  */

/**
 *
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be edited
 * @param {*} resource Resource to be addded to the collection
 */
static addResourceToCollection(token, collectionId, resource = []) {
  return new Promise((resolve, reject) => {
    fetch(`${process.env.WRI_API_URL}/collection/${collectionId}/resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ ...resource })
    })
      .then((response) => {
        const { status, statusText } = response;

        if (status === 200) return resolve();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(data => resolve(data))
      .catch((errors) => { reject(errors); });
  });
}

/**
 *
 * @param {*} token User's token
 * @param {*} collectionId Id of the collection to be edited
 * @param {*} resource Resource to be removed from the collection
 */
static removeResourceFromCollection(token, collectionId, resource = []) {
  const { type, id } = resource;
  return new Promise((resolve, reject) => {
    fetch(`${process.env.WRI_API_URL}/collection/${collectionId}/resource/${type}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token
      },
      body: {}
    })
      .then((response) => {
        const { status, statusText } = response;

        if (status === 200) return resolve();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(data => resolve(data))
      .catch((errors) => { reject(errors); });
  });
}

export default {
  fetchAllCollections,
  fetchCollection,
  createCollection,
  deleteCollection,
  updateCollection,
  addResourceToCollection,
  removeResourceFromCollection
};
