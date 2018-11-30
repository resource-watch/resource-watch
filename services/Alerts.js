import axios from 'axios';


// https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export const axiosAPI = axios.create({
  baseURL: 'http://api.resourcewatch.org/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosAPI;
