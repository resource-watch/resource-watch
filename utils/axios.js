import axios from 'axios';
import { signOut } from 'next-auth/client';

export const WRIAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WRI_API_URL || process.env.STORYBOOK_WRI_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const blogAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BLOG_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const localAPI = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

const onResponseSuccess = (response) => response;

const onResponseError = (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // if (error.response.status === 401) signOut();
  // Do something with response error
  return Promise.reject(error);
};

WRIAPI.interceptors.response.use(onResponseSuccess, onResponseError);
