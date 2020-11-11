import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Retrieve all collections from a user
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-collections|here}
 * @param {String} token User's token
 * @param {Object} params Request optional parameters
 */
export const fetchAllCollections = (
  token,
  params = {},
  _meta = false,
) => {
  logger.info('Fetch all collections');
  return WRIAPI.get('collection', {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1,
    },
    params: {
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
      ...params,
    },
    ..._meta && {
      transformResponse: [].concat(
        WRIAPI.defaults.transformResponse,
        (({ data, meta }) => ({
          collections: data,
          meta,
        })),
      ),
    },
  })
    .then((response) => {
      const { status, statusText, data } = response;
      const { collections, meta } = data;

      if (status >= 300) {
        logger.error('Error fetching collections:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      if (_meta) {
        return {
          collections: WRISerializer({ data: collections }),
          meta,
        };
      }
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching all collections: ${status}: ${statusText}`);
      throw new Error(`Error fetching all collections: ${status}: ${statusText}`);
    });
};
/**
 * Retrieve a specific collection
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-collection-by-id|here}
 * @param {String} token User's token
 * @param {String} collectionId Id of the collection we are asking for.
 * @param {Object} params Request parameters
 */
export const fetchCollection = (
  token,
  collectionId,
  params = {},
) => {
  logger.info(`Fetch collection ${collectionId}`);
  return WRIAPI.get(`collection/${collectionId}`, {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1,
    },
    params: {
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
      ...params,
    },
  })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(`Error fetching collection ${collectionId}: ${status}: ${statusText}`);
    });
};

/**
 * Create a new collection associated to the authenticated user
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-collection|here}
 * @param {String} token User's token
 * @param {Object} data collection data
 */
export const createCollection = (token, data = {}) => {
  logger.info('Create collection');
  return WRIAPI.post(`${process.env.WRI_API_URL}/collection`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating collection: ${status}: ${statusText}`);
      // we shouldn't assume 400 is duplicated collection,
      // but there's no another way to find it out at this moment
      if (status === 400) {
        throw new Error(`Collection duplicated. The collection "${data.name}" already exists.`);
      } else {
        throw new Error(`Error creating collection: ${status}: ${statusText}`);
      }
    });
};

/**
 * Delete an existing collection associated to the authenticated user
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-collection|here}
 * @param {String} token User's token
 * @param {String} collectionId Id of the collection to be removed
 */
export const deleteCollection = (token, collectionId) => {
  logger.info(`Delete collection ${collectionId}`);
  return WRIAPI.delete(`collection/${collectionId}`, { headers: { Authorization: token } })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting collection ${collectionId}: ${status}: ${statusText}`);
    });
};

/**
 * Update an existing collection associated to the authenticated user
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-collection|here}
 * @param {String} token User's token
 * @param {String} collectionId Id of the collection to be edited
 * @param {Object} data Data to be updated
 */
export const updateCollection = (token, collectionId, data) => {
  logger.info(`Update collection ${collectionId}`);
  return WRIAPI.patch(`collection/${collectionId}`, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: token,
    },
  })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(`Error updating collection ${collectionId}: ${status}: ${statusText}`);
    });
};

/* Resources management  */

/**
 * Add a resource to the collection
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#add-resource-to-collection|here}
 * @param {String} token User's token
 * @param {String} collectionId Id of the collection to be edited
 * @param {Object} resource Resource to be addded to the collection
 */
export const addResourceToCollection = (token, collectionId, resource = {}) => {
  logger.info(`Add resource to collection ${collectionId}`);
  return WRIAPI.post(
    `collection/${collectionId}/resource`,
    { ...resource },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    },
  )
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error adding resource to collection ${collectionId}: ${status}: ${statusText}`);
      throw new Error(
        `Error adding resource to collection ${collectionId}: ${status}: ${statusText}`,
      );
    });
};

/**
 * Remove resource from collection
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-collection-resource|here}
 * @param {String} token User's token
 * @param {String} collectionId Id of the collection to be edited
 * @param {Object} resource Resource to be removed from the collection
 */
export const removeResourceFromCollection = (token, collectionId, resource = {}) => {
  logger.info(`Remove resource from collection ${collectionId}`);
  const { type, id } = resource;
  return WRIAPI.delete(`collection/${collectionId}/resource/${type}/${id}`, { headers: { Authorization: token } })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(
        `Error removing resource from collection ${collectionId}: ${status}: ${statusText}`,
      );
      throw new Error(
        `Error removing resource from collection ${collectionId}: ${status}: ${statusText}`,
      );
    });
};
