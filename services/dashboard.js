import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';

// API docs: TBD

/**
 * Fetchs dashboards according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized dashboards.
 */
export const fetchDashboards = (params = {}) =>
  WRIAPI.get('/dashboard', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      env: process.env.API_ENV,
      ...params
    }
  })
    .then((response) => {
      console.log(response)
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

/**
 * fetchs data for a specific dashboard.
 *
 * @param {String} id - dashboard id.
 * @returns {Object} serialized specified dashboard.
 */
export const fetchDashboard = id =>
  WRIAPI.get(`/dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: { env: process.env.API_ENV }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

/**
 * Creates a dashboard with the provided data.
 * This fetch needs authentication.
 *
 * @param {Object} body - data provided to create the new dashboard.
 * @param {String} token - user's token.
 * @returns {Object} serialized created dashboard.
 */
export const createDashboard = (body, token) =>
  WRIAPI.post('/dashboard', { ...body }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

/**
 * Updates a specified dashboard with the provided data.
 * This fetch needs authentication.
 *
 * @param {String} id - dashboard ID to be updated.
 * @param {Object} body - data provided to update the dashboard.
 * @param {String} token - user's token
 * @returns {Object} serialized dashboard with updated data
 */
export const updateDashboard = (id, body, token) =>
  WRIAPI.patch(`/dashboard/${id}`, { ...body }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

/**
 * Deletes a specified dashboard.
 * This fetch needs authentication.
 *
 * @param {*} id - dashboard ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteDashboard = (id, token) =>
  WRIAPI.delete(`/dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText } = response;
      if (status >= 400) throw new Error(statusText);
      return response;
    });

/**
 * Clones a topic to convert it into a dashboard based on topic's data.
 * This fetch needs authentication.
 *
 * @param {String} id - topic ID to be cloned.
 * @param {string} token - user's token.
 * @return {Object} serialized dashboard cloned based on the ID topic.
 */
export const cloneDashboard = (id, token) =>
  WRIAPI.post(`/topics/${id}/clone-dashboard`, {}, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

export default {
  fetchDashboards,
  fetchDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  cloneDashboard
};
