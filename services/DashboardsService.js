import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';

export const fetchDashboards = (params = {}, token) =>
  WRIAPI.get('/dashboard', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      Authorization: token
    },
    params: {
      env: process.env.API_ENV,
      ...Object.keys(params).reduce((x, y) => ({ ...x, ...params[y] }), {})
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

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

export const deleteDashboard = (id, token) =>
  WRIAPI.delete(`/dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });

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
