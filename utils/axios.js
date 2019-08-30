import axios from 'axios';

export const WRIAPI = axios.create({
  baseURL: process.env.WRI_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const blogAPI = axios.create({
  baseURL: process.env.BLOG_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const controlTowerAPI = axios.create({
  baseURL: process.env.CONTROL_TOWER_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const localAPI = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' }
});

export default {
  WRIAPI,
  blogAPI
};
