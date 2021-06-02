import axios from 'axios';

export const WRIAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WRI_API_URL,
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
